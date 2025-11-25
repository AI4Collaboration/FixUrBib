import os
import streamlit as st
import bibtexparser
from bibtexparser.bwriter import BibTexWriter
from bibtexparser.bibdatabase import BibDatabase
from bibfixer.agent import BibFixAgent

st.set_page_config(
    page_title="BibFixer",
    page_icon="📚",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.title("📚 BibFixer")
st.caption("Fix and complete BibTeX entries using GPT with web search.")

with st.sidebar:
    st.header("Settings")
    api_key = st.text_input(
        "OpenAI API Key",
        type="password",
        placeholder="Enter your OpenAI API key here",
        help="Used for OpenAI API. Not stored.",
        value=os.getenv("OPENAI_API_KEY", ""),
    )

    model_friendly = st.selectbox(
        "Model",
        options=["gpt-5-mini", "gpt-5-nano", "gpt-4.1"],
        index=0,
        help="Select the model to use. Default is gpt-5-mini.",
    )
    model_map = {
        "gpt-5-mini": "gpt-5-mini-2025-08-07",
        "gpt-5-nano": "gpt-5-nano-2025-08-07",
        "gpt-4.1": "gpt-4.1",
    }
    selected_model = model_map.get(model_friendly, "gpt-5-mini-2025-08-07")

    preferences = st.text_area(
        "Formatting Preferences",
        placeholder="e.g., 'Use sentence case for titles', 'abbreviate journal names'",
        height=120,
    )


bibtex_content = st.text_area(
    "BibTeX Content",
    height=240,
    placeholder="Paste your BibTeX entries here.",
)

if st.button("Fix BibTeX", type="primary"):
    # secrets/env fallback (OpenAI only)
    effective_api_key = (
        api_key
        or (st.secrets.get("OPENAI_API_KEY") if hasattr(st, "secrets") else None)
        or os.getenv("OPENAI_API_KEY")
    )

    if not effective_api_key:
        st.error("Please provide an API key (input or in secrets/environment).")
    elif not bibtex_content:
        st.error("Please enter BibTeX content.")
    else:
        try:
            agent = BibFixAgent(api_key=effective_api_key)
            # Apply selected model to agent
            agent.model = selected_model
            db = bibtexparser.loads(bibtex_content)

            if not db.entries:
                st.warning("No BibTeX entries found.")
            else:
                progress_bar = st.progress(0)
                status_text = st.empty()
                revised_entries = []

                for i, entry in enumerate(db.entries):
                    entry_id = entry.get("ID", f"entry_{i+1}")
                    status_text.text(
                        f"Processing entry {i+1}/{len(db.entries)}: {entry_id}"
                    )

                    single_entry_db = BibDatabase()
                    single_entry_db.entries = [entry]
                    writer = BibTexWriter()
                    writer.order_entries_by = None
                    original_entry_text = writer.write(single_entry_db)

                    revised_entry_text = agent.revise_bibtex(
                        original_entry_text, preferences
                    )
                    revised_entries.append(revised_entry_text)
                    progress_bar.progress((i + 1) / len(db.entries))

                status_text.text("Done!")
                combined = "\n\n".join(revised_entries)
                st.text_area("Revised BibTeX", combined, height=400)
                st.download_button(
                    "Download revised.bib",
                    combined.encode("utf-8"),
                    file_name="revised.bib",
                    mime="text/plain",
                )

        except Exception as e:
            st.error(f"An error occurred: {e}")
