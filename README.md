
# 📄 SummarEase – RAG-powered Research Paper Assistant

> 💡 A GenAI-powered tool that helps students, researchers, and professionals **understand research papers faster** using natural language queries and intelligent summarization.

---

## 🚀 Overview

SummarEase leverages **Retrieval-Augmented Generation (RAG)** and **Large Language Models (LLMs)** to allow users to:
- Upload any research paper (PDF)
- Ask questions in plain English
- Get one-line summaries, key insights, and technical definitions
- Listen to answers via **text-to-speech** (TTS)

---

## 🧠 Features

- 📤 Upload research papers in PDF format
- 💬 Ask natural language questions about the paper
- 📚 Get comprehensive summaries
- 📌 One-line summary generation
- 💡 Key insight extraction
- 📖 Define technical terms from the paper
- 🎙️ Text-to-speech for answers and summaries (via `pyttsx3`)

---

## ⚙️ Technologies Used

| Type             | Tool/Library                         | Purpose                                      |
| 🧠 LLM           | Llama 3.3-70b via **Groq API**       | Generate intelligent answers                 |
| 🔎 RAG           | **LangChain** + **FAISS**            | Retrieve context-relevant chunks             |
| 📚 Embedding     | `sentence-transformers/all-MiniLM-L6-v2` | Convert text to vector format           |
| 💾 Vector DB     | FAISS                                | Store and query semantic chunks              |
| 📄 PDF Parser    | `LangChain`'s PyPDFLoader            | Split PDF into chunks/pages                  |
| 🎙️ TTS           | `pyttsx3`                            | Speak answers and summaries aloud            |
| ⚙️ Backend       | Python, dotenv, OS                   | Project backend logic and environment config |
| 🎛️ Frontend      | Gradio                              | Interactive UI for seamless user experience  |

---

## 🛠️ Setup Instructions

1. **Clone the Repo**
```bash
git clone https://github.com/Riyaa200/SummarEase.git
cd SummarEase




2. Install Requirements

pip install -r requirements.txt


Environment Variables

Create a .env file in the project root and add your Groq API key:
 GROQ_API_KEY=your_groq_api_key_here

⚠️ Do not commit your .env file. It is already ignored via .gitignore.


▶️ Run the Application

python ui_gradio.py
