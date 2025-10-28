# Tourrealtime — Streamlit deployment

This repository contains a minimal Streamlit demo app in `streamlit_app.py`.

Quick deploy to Streamlit Cloud

1. Ensure the repo is pushed to GitHub and the default branch is `main` (already done).
2. Confirm `requirements.txt` exists at the repository root (Streamlit Cloud uses it to install dependencies).
3. Open Streamlit Cloud: https://share.streamlit.io
4. Click "New app" → Connect your GitHub account (authorize if needed) → select repository `ThuongLuu2603/Tourrealtime`, branch `main`, and file `streamlit_app.py` → Deploy.

Secrets / environment variables

- If your app needs secrets (DB credentials, API keys), open the deployed app in Streamlit Cloud → Manage app → Secrets and add KEY=VALUE pairs.

Notes

- This repository has had `.venv` removed from history and large binaries moved to Git LFS; your working tree should be clean.
- If you need me to trigger additional setup (create a Procfile, add more files, or set secrets), tell me which variables to add and I will prepare instructions or add them to the repo.

Enjoy — after deploy, the app should be available on the URL Streamlit Cloud provides.
# Tourrealtime