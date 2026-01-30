import gradio as gr
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

from rag_pipeline import (
    process_pdf,
    ask_question,
    extract_key_insights,
    one_line_summary,
    define_technical_term
)

uploaded_pdf_path = None

# Load CSS
css_path = Path("assets/workspace.css")
custom_css = css_path.read_text() if css_path.exists() else ""

def handle_upload(file):
    global uploaded_pdf_path
    if not file:
        return "Please upload a PDF."
    uploaded_pdf_path = file.name
    process_pdf(uploaded_pdf_path)
    return "Document processed successfully."

def handle_summary():
    return ask_question("Provide a comprehensive summary of the document.")

def handle_question(q):
    return ask_question(q)

def handle_define(term):
    return define_technical_term(term)

with gr.Blocks(
    title="Contexta AI",
    theme=gr.themes.Base(),
    css=custom_css
) as demo:

    # ===== TOP BAR =====
    gr.Markdown("""
    <div class="topbar">
        <div class="topbar-title">Contexta AI</div>
        <div class="topbar-subtitle">
            Research-focused document intelligence powered by RAG
        </div>
    </div>
    """)

    # ===== NAV =====
    with gr.Tabs():

        # ================= UPLOAD =================
        with gr.TabItem("📄 Upload"):

            with gr.Row():

                # LEFT
                with gr.Column(scale=1):
                    gr.Markdown("<div class='section-header'>Upload Document</div>")
                    with gr.Column(elem_classes=["panel"]):
                        pdf = gr.File(file_types=[".pdf"])
                        upload_btn = gr.Button("Process Document", variant="primary")
                        status = gr.Textbox(interactive=False)

                # RIGHT
                with gr.Column(scale=2):
                    gr.Markdown("<div class='section-header'>Summary Output</div>")
                    with gr.Column(elem_classes=["panel"]):
                        summary_btn = gr.Button("Generate Summary", variant="secondary")
                        summary = gr.Textbox(lines=20, interactive=False)

            upload_btn.click(handle_upload, pdf, status)
            summary_btn.click(handle_summary, None, summary)

        # ================= ASK =================
        with gr.TabItem("💬 Ask"):

            with gr.Row():

                with gr.Column(scale=1):
                    gr.Markdown("<div class='section-header'>Ask Question</div>")
                    with gr.Column(elem_classes=["panel"]):
                        question = gr.Textbox(
                            placeholder="Ask a question about the document..."
                        )
                        ask_btn = gr.Button("Get Answer", variant="primary")

                with gr.Column(scale=2):
                    gr.Markdown("<div class='section-header'>Answer</div>")
                    with gr.Column(elem_classes=["panel"]):
                        answer = gr.Textbox(lines=20, interactive=False)

            ask_btn.click(handle_question, question, answer)

        # ================= INSIGHTS =================
        with gr.TabItem("✨ Insights"):

            with gr.Row():

                with gr.Column(scale=1):
                    gr.Markdown("<div class='section-header'>Actions</div>")
                    with gr.Column(elem_classes=["panel"]):
                        one_btn = gr.Button("One-line Summary", variant="secondary")
                        key_btn = gr.Button("Key Insights", variant="secondary")

                with gr.Column(scale=2):
                    gr.Markdown("<div class='section-header'>Insights</div>")
                    with gr.Column(elem_classes=["panel"]):
                        insights = gr.Textbox(lines=18, interactive=False)

            one_btn.click(one_line_summary, None, insights)
            key_btn.click(extract_key_insights, None, insights)

        # ================= TERMINOLOGY =================
        with gr.TabItem("📘 Terminology"):

            with gr.Row():

                with gr.Column(scale=1):
                    gr.Markdown("<div class='section-header'>Define Term</div>")
                    with gr.Column(elem_classes=["panel"]):
                        term = gr.Textbox(placeholder="Enter a technical term")
                        define_btn = gr.Button("Define", variant="primary")

                with gr.Column(scale=2):
                    gr.Markdown("<div class='section-header'>Definition</div>")
                    with gr.Column(elem_classes=["panel"]):
                        definition = gr.Textbox(lines=16, interactive=False)

            define_btn.click(handle_define, term, definition)

if __name__ == "__main__":
    demo.launch(
        server_name="127.0.0.1",
        server_port=7860,
        share=False
    )
