#!/usr/bin/env bash
set -euo pipefail

MODEL="qwen2.5-coder:7b-instruct"
PORT=5173

echo "==> Checking Ollama..."
if ! command -v ollama >/dev/null 2>&1; then
  if command -v brew >/dev/null 2>&1; then
    echo "==> Installing Ollama via Homebrew..."
    brew install ollama
  else
    echo "ERROR: Homebrew not found. Please install Ollama manually: https://ollama.ai/download"
    exit 1
  fi
fi

echo "==> Starting Ollama..."
if ! pgrep -f "ollama serve" >/dev/null; then
  (nohup ollama serve >/tmp/ollama.log 2>&1 &) && sleep 2
fi

echo "==> Pulling model $MODEL..."
ollama pull "$MODEL"

echo "==> Starting web server on http://localhost:$PORT..."
cd "$(dirname "$0")"
cd ..
( python3 -m http.server "$PORT" >/tmp/local-llm-web.log 2>&1 & )

sleep 2
open "http://localhost:$PORT"
echo "✅ Ready!"