$Model = "qwen2.5-coder:7b-instruct"
$Port = 5173

Write-Host "==> Checking Ollama..."
if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
    if (Get-Command winget -ErrorAction SilentlyContinue) {
        Write-Host "==> Installing Ollama via winget..."
        winget install --id Ollama.Ollama -e --accept-package-agreements --accept-source-agreements
    } else {
        Write-Host "ERROR: winget not found. Please install Ollama manually: https://ollama.ai/download"
        exit 1
    }
}

Write-Host "==> Starting Ollama..."
$running = Get-Process | Where-Object { $_.ProcessName -like "ollama*" } | Measure-Object
if ($running.Count -eq 0) {
    Start-Process -NoNewWindow -FilePath "powershell" -ArgumentList "-Command", "ollama serve" -WindowStyle Minimized
    Start-Sleep -Seconds 3
}

Write-Host "==> Pulling model $Model..."
ollama pull $Model

Write-Host "==> Starting web server..."
Start-Process -NoNewWindow -FilePath "python" -ArgumentList "-m", "http.server", "$Port"

Start-Sleep -Seconds 2
Start-Process "http://localhost:$Port"
Write-Host "✅ Ready!"