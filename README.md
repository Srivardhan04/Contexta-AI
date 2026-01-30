# Contexta AI - RAG-Powered Research Paper Assistant

Contexta AI is a GenAI-powered tool that helps students, researchers, and professionals understand research papers faster using natural language queries and intelligent summarization. It combines Retrieval-Augmented Generation (RAG) with Large Language Models (LLMs) to provide comprehensive document analysis and interactive learning.

---

## Overview

Contexta AI leverages advanced NLP and machine learning to allow users to:
- Upload research papers in PDF format
- Ask questions in plain English and receive intelligent answers
- Generate one-line summaries and key insights
- Extract and define technical terminology from documents
- Listen to answers via text-to-speech synthesis

---

## Features

- PDF document upload and processing
- Natural language question answering about paper content
- Comprehensive paper summarization
- One-line summary generation for quick overview
- Key insight extraction and analysis
- Technical term definition and explanation
- Text-to-speech functionality for audio output
- Interactive web-based user interface
- Real-time document processing and retrieval

---

## Technology Stack

### Backend
- **Language**: Python 3.x
- **LLM Provider**: Groq API (Llama 3.3-70b-versatile model)
- **RAG Framework**: LangChain
- **Vector Database**: FAISS (CPU-based)
- **Text Embeddings**: sentence-transformers (all-MiniLM-L6-v2)
- **PDF Processing**: PyPDF2, LangChain PyPDFLoader
- **Text-to-Speech**: pyttsx3
- **API Framework**: FastAPI
- **Environment Management**: python-dotenv

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.8
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Animation**: Framer Motion
- **Styling**: CSS with Tailwind configuration

### Database
- **Vector Storage**: FAISS with persistent local storage
- **Embedding Model**: Hugging Face sentence-transformers

---

## Project Structure

```
Contexta AI/
├── backend/
│   ├── main.py                 # FastAPI application and routes
│   ├── rag_pipeline.py         # RAG implementation and LLM integration
│   ├── requirements.txt        # Python dependencies
│   └── uploaded_docs/          # Directory for uploaded PDF files
├── frontend/
│   ├── src/
│   │   ├── components/         # React components (ChatWindow, Sidebar, etc.)
│   │   ├── pages/              # Application pages (Home, Chat, About, Insights)
│   │   ├── services/           # API service calls
│   │   ├── context/            # React context for state management
│   │   ├── App.jsx             # Main React component
│   │   └── main.jsx            # React entry point
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.js          # Vite configuration
│   └── index.html              # HTML entry point
├── vector_store/               # FAISS vector database storage
├── README.md                   # Project documentation
├── LICENSE                     # License information
└── .gitignore                  # Git ignore rules

---

## Installation and Setup

### Prerequisites
- Python 3.8 or higher
- Node.js 16.x or higher
- npm or yarn package manager
- Groq API key

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/Srivardhan04/Contexta-AI.git
cd Contexta-AI




2. Navigate to project directory and create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Create environment configuration file (.env):
```bash
# Create .env file in project root
echo GROQ_API_KEY=your_groq_api_key_here > .env
```

Note: Obtain your Groq API key from https://console.groq.com

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:5173

---

## Running the Application

### Start Backend Server

From project root:
```bash
python main.py
```

The FastAPI server will start on http://localhost:8000

### API Endpoints

- **POST** /upload-paper: Upload PDF document for processing
- **POST** /ask-question: Ask questions about uploaded document
- **GET** /health: Health check endpoint

### Start Frontend Application

```bash
cd frontend
npm run dev
```

---

## Usage Guide

1. Open the application in your browser (http://localhost:5173)
2. Upload a research paper in PDF format using the upload panel
3. Wait for document processing and embedding generation
4. Ask questions about the paper content
5. Receive AI-generated answers with source references
6. Use features like one-line summary, insights, and term definitions

---

## API Configuration

The application requires a Groq API key for LLM functionality:

1. Sign up at https://console.groq.com
2. Generate an API key
3. Add to .env file: GROQ_API_KEY=your_key
4. Restart the backend server

---

## Important Notes

- Keep .env file secure and never commit to version control
- FAISS vector store is saved locally for persistence
- Document embeddings are cached for faster retrieval
- Text-to-speech requires system audio output
- Supports PDF files up to 50MB in size

---

## Troubleshooting

**"No PDF has been processed yet" error**
- Ensure a PDF file has been successfully uploaded and processed
- Check vector_store directory exists and contains FAISS files

**CORS errors from frontend**
- Verify backend is running on http://localhost:8000
- Check CORS configuration in main.py matches frontend origin

**PDF upload fails**
- Ensure file is valid PDF format
- Check uploaded_docs directory has write permissions
- Verify file size is under 50MB

**API key errors**
- Confirm GROQ_API_KEY is set in .env file
- Verify API key is valid and has active quota
- Restart backend after changing .env file

---

## Project Roadmap

- Multi-document analysis and comparison
- Advanced search filters and sorting
- Custom prompt templates
- Document annotation features
- Export summary to PDF/Word
- Collaborative sharing features
- API rate limiting and user authentication
- Support for multiple document formats

---

## License

This project is licensed under the MIT License. See LICENSE file for details.

---

## Contributors

Developed by Srivardhan and the Contexta AI team.

For questions or issues, please open an issue on GitHub repository.
