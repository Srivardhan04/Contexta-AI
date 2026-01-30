import os
from pathlib import Path
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# Load environment variables
load_dotenv()

# ✅ Centralized Configuration (Single source of truth)
# Use absolute paths to fix "paths mismatch" errors
BASE_DIR = Path(__file__).resolve().parent
DB_FAISS_PATH = os.path.join(BASE_DIR, "vector_store")
GROQ_MODEL = "llama-3.3-70b-versatile"
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

def vector_store_exists():
    """Check if the FAISS vector store exists on disk"""
    return Path(DB_FAISS_PATH).exists()

def process_pdf(pdf_path):
    """Process PDF and store embeddings in FAISS vector store persistently"""
    try:
        loader = PyPDFLoader(pdf_path)
        pages = loader.load_and_split()
        
        if not pages:
            raise ValueError("PDF file is empty or could not be read.")
        
        # Create and save FAISS vector store to disk (PERSISTENT)
        vectorstore = FAISS.from_documents(pages, embedding_model)
        vectorstore.save_local(DB_FAISS_PATH)
        return True
    except Exception as e:
        print(f"Error processing PDF: {str(e)}")
        raise

def load_retriever():
    """Load the FAISS vector store and return as retriever with safety checks"""
    try:
        # CRITICAL: Check if vector store exists before attempting to load
        if not vector_store_exists():
            raise FileNotFoundError(
                "No PDF has been processed yet. Please upload and process a PDF first."
            )
        
        vectorstore = FAISS.load_local(
            DB_FAISS_PATH, 
            embedding_model, 
            allow_dangerous_deserialization=True
        )
        return vectorstore.as_retriever()
    except FileNotFoundError as e:
        raise e
    except Exception as e:
        print(f"Error loading retriever: {str(e)}")
        raise

def load_llm():
    """Initialize the Groq LLM with supported model"""
    return ChatGroq(
        groq_api_key=os.getenv("GROQ_API_KEY"),
        model=GROQ_MODEL,  # Use 'model' to ensure correct parameter passing
        temperature=0
    )

def create_rag_chain(retriever, llm):
    """Create a RAG chain using modern LCEL pattern"""
    prompt = PromptTemplate.from_template(
        """Use the following context to answer the question.
If you don't know the answer, say you don't know.

Context:
{context}

Question:
{question}

Answer:"""
    )
    
    # Create RAG chain using LCEL (Langchain Expression Language)
    # The | operator chains operations together
    rag_chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    
    return rag_chain

def ask_question(question):
    """Ask a question about the loaded PDF with comprehensive error handling"""
    if not question or not question.strip():
        return "Please enter a valid question."
    
    try:
        if not vector_store_exists():
            return "No PDF has been processed yet. Please upload and process a PDF first."
        
        retriever = load_retriever()
        llm = load_llm()
        rag_chain = create_rag_chain(retriever, llm)
        result = rag_chain.invoke(question)
        return result
    except FileNotFoundError as e:
        return f"Vector store not found: {str(e)}"
    except Exception as e:
        print(f"Error in ask_question: {str(e)}")
        return f"Error while processing your question: {str(e)}. Please ensure the PDF was uploaded correctly."

def custom_prompt_query(prompt):
    """Execute a custom prompt query on the loaded PDF with comprehensive error handling"""
    if not prompt or not prompt.strip():
        return "Please provide a valid prompt."
    
    try:
        if not vector_store_exists():
            return "No PDF has been processed yet. Please upload and process a PDF first."
        
        retriever = load_retriever()
        llm = load_llm()
        rag_chain = create_rag_chain(retriever, llm)
        result = rag_chain.invoke(prompt)
        return result
    except FileNotFoundError as e:
        return f"Vector store not found: {str(e)}"
    except Exception as e:
        print(f"Error in custom_prompt_query: {str(e)}")
        return f"Error while processing your request: {str(e)}. Please ensure the PDF was uploaded correctly."

# ✨ New smart features
def extract_key_insights():
    """Extract 5 key insights from the document"""
    prompt = "Extract 5 key insights from this paper in bullet points."
    return custom_prompt_query(prompt)

def one_line_summary():
    """Generate a one-line summary of the document"""
    prompt = "Give a one-line summary of the paper."
    return custom_prompt_query(prompt)

def define_technical_term(term):
    """Define a technical term in simple words"""
    prompt = f"Explain the term '{term}' in simple words."
    return custom_prompt_query(prompt)
