from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
import gc
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

from rag_pipeline import (
    ask_question,
    define_technical_term
)

app = FastAPI()

# ================= CORS =================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= STORAGE =================
UPLOAD_DIR = "uploaded_docs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Configuration
DB_FAISS_PATH = "vector_store"
BATCH_SIZE = 32

# Initialize Embeddings (Singleton)
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    model_kwargs={'device': 'cpu'}
)

# ================= ROUTES =================

@app.post("/upload-paper")
async def upload_paper(file: UploadFile = File(...)):
    if not file:
        return {"error": "No file received"}

    pdf_path = os.path.join(UPLOAD_DIR, file.filename)

    # 1. Stream file to disk (Avoid loading 50MB+ into RAM)
    try:
        with open(pdf_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        return {"error": f"Failed to save upload: {str(e)}"}

    # 2. Process safely (Streaming & Batching)
    try:
        loader = PyPDFLoader(pdf_path)
        pages_generator = loader.lazy_load() # Generator, not list

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=800,
            chunk_overlap=150,
            separators=["\n\n", "\n", ".", " ", ""]
        )

        # Start fresh for every new document upload
        # This ensures we don't mix content from previous PDFs
        db = None

        current_batch_docs = []

        for page in pages_generator:
            chunks = text_splitter.split_documents([page])
            for chunk in chunks:
                chunk.metadata['source'] = file.filename
                current_batch_docs.append(chunk)
            
            # Process batch
            if len(current_batch_docs) >= BATCH_SIZE:
                if db is None:
                    db = FAISS.from_documents(current_batch_docs, embeddings)
                else:
                    db.add_documents(current_batch_docs)
                current_batch_docs = []
                gc.collect() # Free memory

        # Process remaining
        if current_batch_docs:
            if db is None:
                db = FAISS.from_documents(current_batch_docs, embeddings)
            else:
                db.add_documents(current_batch_docs)
        
        if db:
            db.save_local(DB_FAISS_PATH)

    except Exception as e:
        print(f"Error processing PDF: {e}")
        return {"error": "Error processing document"}
    finally:
        gc.collect()

    return {
        "message": "PDF processed successfully.",
        "filename": file.filename
    }


@app.get("/ask-question")
def query_paper(q: str):
    if not q:
        return {"error": "Query parameter 'q' is required"}

    answer = ask_question(q)
    return {
        "question": q,
        "answer": answer
    }


@app.get("/define-term")
def define_term(term: str):
    if not term:
        return {"error": "Term is required"}

    definition = define_technical_term(term)
    return {
        "term": term,
        "definition": definition
    }
