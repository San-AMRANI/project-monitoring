// Vite loads variables from .env automatically
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

const randomBtn = document.getElementById("random-btn");
const allBtn = document.getElementById("all-btn");
const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const errorMessage = document.getElementById("error-message");
const quotesList = document.getElementById("quotes-list");
const quoteCount = document.getElementById("quote-count");
const healthIndicator = document.getElementById("health-indicator");

const setError = (message) => {
  if (!message) {
    errorMessage.classList.add("hidden");
    errorMessage.textContent = "";
    return;
  }
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
};

const setQuote = (quote) => {
  if (!quote) return;
  quoteText.textContent = quote.text;
  quoteAuthor.textContent = `— ${quote.author}`;
};

const renderList = (items) => {
  quotesList.innerHTML = "";
  if (!items || items.length === 0) {
    quotesList.innerHTML = `<p class="text-sm text-slate-400">No quotes available.</p>`;
    quoteCount.textContent = "0 items";
    return;
  }

  quoteCount.textContent = `${items.length} item${items.length === 1 ? "" : "s"}`;

  const fragment = document.createDocumentFragment();
  items.forEach((q) => {
    const card = document.createElement("article");
    card.className = "rounded-xl border border-slate-800 bg-ink-900/80 p-4 text-sm text-slate-100";
    card.innerHTML = `
      <p class="leading-relaxed text-slate-50">${q.text}</p>
      <p class="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">— ${q.author}</p>
    `;
    fragment.appendChild(card);
  });
  quotesList.appendChild(fragment);
};

const fetchJson = async (path) => {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }
  return response.json();
};

const loadHealth = async () => {
  try {
    const data = await fetchJson(`/health`);
    healthIndicator.textContent = data?.status || "ok";
    healthIndicator.classList.remove("text-rose-400");
    healthIndicator.classList.add("text-emerald-300");
  } catch (error) {
    healthIndicator.textContent = "offline";
    healthIndicator.classList.add("text-rose-400");
  }
};

const loadRandom = async () => {
  setError("");
  try {
    const data = await fetchJson(`/quotes/random`);
    setQuote(data);
  } catch (error) {
    setError("Could not fetch a random quote. Is the backend running on 3000?");
  }
};

const loadAll = async () => {
  setError("");
  try {
    const data = await fetchJson(`/quotes`);
    renderList(data.quotes);
  } catch (error) {
    setError("Could not fetch the list of quotes. Try again once the backend is up.");
  }
};

randomBtn.addEventListener("click", loadRandom);
allBtn.addEventListener("click", loadAll);

loadHealth();

// Export helpers to enable unit testing without a browser bundler.
export { setError, setQuote, renderList, fetchJson, loadHealth, loadRandom, loadAll };
