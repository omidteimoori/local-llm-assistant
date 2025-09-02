// local-llm-assistant
// MIT License
// Copyright (c) 2025 Omid Teimoori

const OLLAMA_HOST = 'http://127.0.0.1:11434';
const MODEL = 'qwen2.5-coder:7b-instruct';
let temperature = 0.2;

const SYSTEM_PROMPT =
  "I am a precise instructor for JavaScript, SQL, and HTML only. " +
  "If a question is outside these domains, I will say I can’t help. " +
  "I prefer short steps, correct code blocks, and I mention differences between engines (browsers/DBs) when relevant.";

marked.setOptions({
  gfm: true,
  highlight: (code, lang) => {
    if (window.hljs) {
      if (lang && window.hljs.getLanguage(lang)) {
        return window.hljs.highlight(code, { language: lang }).value;
      }
      return window.hljs.highlightAuto(code).value;
    }
    return code;
  }
});

const $ = (id) => document.getElementById(id);
const questionEl = $('question');
const answerEl = $('answer');
const introBoxEl = $('intro-box');
const tempInput = $('temp');
const tempValue = $('temp-value');
let controller = null;

async function checkOllama() {
  const el = document.getElementById('ollama-status');
  if (!el) return;
  try {
    const r = await fetch('http://127.0.0.1:11434/api/tags', { method: 'GET' });
    if (!r.ok) throw new Error(String(r.status));
    el.textContent = 'Ollama: ✅ connected';
  } catch (e) {
    el.textContent = 'Ollama: ❌ not reachable';
  }
}
checkOllama();
setInterval(checkOllama, 4000);

// Hide intro on focus/type
questionEl.addEventListener('focus', () => introBoxEl.classList.add('hidden'));
questionEl.addEventListener('input', () => {
  if (questionEl.value.trim()) introBoxEl.classList.add('hidden');
  else introBoxEl.classList.remove('hidden');
});

// Temperature
tempInput.addEventListener('input', () => {
  temperature = parseFloat(tempInput.value);
  tempValue.textContent = temperature.toFixed(1);
});

function addCopyButtons() {
  answerEl.querySelectorAll('pre').forEach(pre => {
    if (pre.querySelector('.copy-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code')?.innerText || '';
      try {
        await navigator.clipboard.writeText(code);
        btn.classList.add('copied');
        btn.textContent = 'Copied';
        setTimeout(() => { btn.classList.remove('copied'); btn.textContent = 'Copy'; }, 1200);
      } catch {
        btn.textContent = 'Copy failed';
        setTimeout(() => { btn.textContent = 'Copy'; }, 1200);
      }
    });
    pre.appendChild(btn);
  });
}

function renderMarkdown(md) {
  const fenceCount = (md.match(/```/g) || []).length;
  if (fenceCount % 2 === 1) md += '\n```';
  if (!md.endsWith('\n')) md += '\n';
  answerEl.innerHTML = marked.parse(md);
  if (window.hljs) {
    if (typeof window.hljs.highlightAll === 'function') {
      window.hljs.highlightAll();
    } else {
      answerEl.querySelectorAll('pre code').forEach(block => window.hljs.highlightElement(block));
    }
  }
  addCopyButtons();
}

async function ask() {
  const q = questionEl.value.trim();
  if (!q) { questionEl.focus(); return; }
  answerEl.innerHTML = '';
  controller = new AbortController();

  const body = {
    model: MODEL,
    stream: false,
    options: { temperature },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: q }
    ]
  };

  try {
    const res = await fetch(`${OLLAMA_HOST}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`HTTP ${res.status}: ${txt}`);
    }
    const data = await res.json();
    const content = data?.message?.content || data?.response || '';
    renderMarkdown(content || '**No content returned from model.**');
  } catch (err) {
    if (err.name !== 'AbortError') {
      renderMarkdown(`**Error:** ${err.message}`);
    }
  } finally {
    controller = null;
  }
}

$('ask').addEventListener('click', ask);
$('stop').addEventListener('click', () => controller?.abort());
$('clear').addEventListener('click', () => {
  questionEl.value = '';
  answerEl.innerHTML = '';
  introBoxEl.classList.remove('hidden');
  questionEl.focus();
});
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') ask();
});