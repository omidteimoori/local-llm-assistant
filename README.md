# local-llm-assistant

A lightweight web front-end for a local LLM running via [Ollama](https://ollama.ai/).  
Designed to answer **JavaScript, SQL, and HTML** questions with precise explanations and code examples.

## Features
- One-click startup scripts for **macOS** and **Windows**.
- Auto-installs Ollama (if missing).
- Auto-pulls and runs the model `qwen2.5-coder:7b-instruct`.
- Clean UI with intro box, temperature control, and copy-code buttons.
- Syntax highlighting using `highlight.js`.
- Fully local — no external API keys required.

---

## Quick Start (macOS & Windows)

### 1. Clone this repo
```sh
git clone <YOUR_REPO_URL>
cd local-llm-assistant
```

### 2. Run on macOS
From Terminal, run:
```sh
chmod +x scripts/run-mac.sh
./scripts/run-mac.sh
```

What it does:
- Installs **Ollama** automatically via Homebrew (if not already installed).  
- Starts `ollama serve` in the background.  
- Pulls the model `qwen2.5-coder:7b-instruct`.  
- Launches the web UI at [http://localhost:5173](http://localhost:5173).

### 3. Run on Windows
Open **PowerShell** and run:
```powershell
.\scripts
un-windows.ps1
```

What it does:
- Installs **Ollama** automatically via `winget` (if not already installed).  
- Starts `ollama serve` in the background.  
- Pulls the model `qwen2.5-coder:7b-instruct`.  
- Launches the web UI at [http://localhost:5173](http://localhost:5173).

---

## Development (Manual Mode)

If you prefer to manage Ollama yourself:

1. Install [Ollama](https://ollama.ai/download).  
2. Start the server and pull the model:
   ```sh
   ollama serve
   ollama pull qwen2.5-coder:7b-instruct
   ```
3. Serve the frontend locally:
   ```sh
   python3 -m http.server 5173
   ```
4. Open [http://localhost:5173](http://localhost:5173).

---

## Project Structure
```
local-llm-assistant/
├── index.html
├── assets/
│   ├── style.css
│   └── app.js
├── vendor/
│   ├── marked.min.js
│   ├── highlight.min.js
│   └── github-dark.min.css
├── favicon.ico
├── scripts/
│   ├── run-mac.sh
│   └── run-windows.ps1
└── README.md
```

---

## License & Credits
MIT License  

Developed by **Omid Teimoori**
