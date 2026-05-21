// =============================================
// 🔧 CHANGE THIS URL AFTER DEPLOYING TO RENDER
// Example: 'https://insightai-backend.onrender.com'
// =============================================
const BACKEND_URL = 'https://insightai-d5rr.onrender.com';

const tips = [
    "Select text on any page, then click an action below",
    "Use Summarize to condense long articles instantly",
    "Use Suggest Topics to explore related research areas",
    "Your notes are saved locally in the browser",
];

let currentTipIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Restore saved notes
    chrome.storage.local.get(['researchNotes'], (result) => {
        if (result.researchNotes) {
            document.getElementById('notes').value = result.researchNotes;
            updateCharCount(result.researchNotes);
        }
    });

    // Check backend health
    checkBackendStatus();

    // Rotate tips
    rotateTips();

    // Event listeners
    document.getElementById('summarizeBtn').addEventListener('click', () => processText('summarize'));
    document.getElementById('suggestBtn').addEventListener('click', () => processText('suggest'));
    document.getElementById('saveNotesBtn').addEventListener('click', saveNotes);
    document.getElementById('copyBtn').addEventListener('click', copyResult);
    document.getElementById('notes').addEventListener('input', (e) => updateCharCount(e.target.value));
});


/* ===== BACKEND STATUS CHECK ===== */
async function checkBackendStatus() {
    const dot = document.getElementById('statusDot');
    try {
        const res = await fetch(`${BACKEND_URL}/api/research/process`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: 'test', operation: 'summarize' }),
            signal: AbortSignal.timeout(3000)
        });
        // Any response (even error) means backend is up
        dot.classList.add('online');
        dot.title = 'Backend is running';
    } catch {
        dot.classList.add('offline');
        dot.title = 'Backend is not reachable';
    }
}


/* ===== TIP ROTATION ===== */
function rotateTips() {
    const tipEl = document.getElementById('tipText');
    setInterval(() => {
        currentTipIndex = (currentTipIndex + 1) % tips.length;
        tipEl.style.opacity = '0';
        setTimeout(() => {
            tipEl.textContent = tips[currentTipIndex];
            tipEl.style.opacity = '1';
        }, 300);
    }, 4000);

    const tipEl2 = document.getElementById('tipText');
    tipEl2.style.transition = 'opacity 0.3s ease';
}


/* ===== MAIN PROCESS FUNCTION ===== */
async function processText(operation) {
    try {
        showLoading(true);
        hideError();
        hideResults();

        // Get selected text from active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const [{ result }] = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => window.getSelection().toString()
        });

        if (!result || result.trim() === '') {
            showLoading(false);
            showError('Please select some text on the page first, then click the button.');
            return;
        }

        // Disable buttons during request
        setBtnsLoading(true);

        const response = await fetch(`${BACKEND_URL}/api/research/process`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: result, operation })
        });

        const text = await response.text();

        if (!response.ok) {
            showError(text);
            return;
        }

        showResult(text, operation);

    } catch (error) {
        showError('Could not connect to backend. Make sure Spring Boot is running on port 8080.');
    } finally {
        showLoading(false);
        setBtnsLoading(false);
    }
}


/* ===== SAVE NOTES ===== */
async function saveNotes() {
    const notes = document.getElementById('notes').value;
    chrome.storage.local.set({ researchNotes: notes }, () => {
        const toast = document.getElementById('saveStatus');
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 2500);
    });
}


/* ===== COPY RESULT ===== */
function copyResult() {
    const content = document.getElementById('resultContent').textContent;
    navigator.clipboard.writeText(content).then(() => {
        const btn = document.getElementById('copyBtn');
        btn.classList.add('copied');
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy`;
        }, 2000);
    });
}


/* ===== UI HELPERS ===== */
function showLoading(show) {
    document.getElementById('loadingState').classList.toggle('hidden', !show);
}

function showError(message) {
    const el = document.getElementById('errorState');
    document.getElementById('errorText').textContent = message;
    el.classList.remove('hidden');
}

function hideError() {
    document.getElementById('errorState').classList.add('hidden');
}

function showResult(content, operation) {
    const label = operation === 'summarize' ? '📝 Summary' : '🔍 Suggested Topics';
    document.getElementById('resultLabel').textContent = label;

    const contentEl = document.getElementById('resultContent');
    contentEl.textContent = content;  // Safe - no innerHTML

    document.getElementById('results').classList.remove('hidden');
}

function hideResults() {
    document.getElementById('results').classList.add('hidden');
}

function setBtnsLoading(loading) {
    document.getElementById('summarizeBtn').classList.toggle('loading', loading);
    document.getElementById('suggestBtn').classList.toggle('loading', loading);
}

function updateCharCount(text) {
    const count = text.length;
    document.getElementById('charCount').textContent =
        count === 0 ? '0 characters' : `${count.toLocaleString()} character${count === 1 ? '' : 's'}`;
}