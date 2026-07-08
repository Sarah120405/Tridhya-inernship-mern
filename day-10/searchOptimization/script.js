// Debounce to add a delay before calling api so that user can complete writing
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

// Throttling to limit api calling in scrolls
function throttle(fn, limit) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
}

// COUNTERS
let keystrokes = 0;
let apiCalls = 0;
let scrollEvents = 0;
let handlerRuns = 0;

const keystrokeEl = document.getElementById("keystrokeCount");
const apiCallEl = document.getElementById("apiCallCount");
const callsSavedEl = document.getElementById("callsSaved");
const scrollEventEl = document.getElementById("scrollEventCount");
const handlerCountEl = document.getElementById("handlerCount");
const eventsSkippedEl = document.getElementById("eventsSkipped");

function updateSearchCounters() {
  keystrokeEl.textContent = keystrokes;
  apiCallEl.textContent = apiCalls;
  callsSavedEl.textContent = Math.max(0, keystrokes - apiCalls);
}

function updateScrollCounters() {
  scrollEventEl.textContent = scrollEvents;
  handlerCountEl.textContent = handlerRuns;
  eventsSkippedEl.textContent = Math.max(0, scrollEvents - handlerRuns);
}

// API Fetch
const searchStatus = document.getElementById("searchStatus");
const resultsGrid = document.getElementById("resultsGrid");

async function fetchBooks(query) {
  if (!query.trim()) {
    resultsGrid.innerHTML = "";
    searchStatus.textContent = "Start typing to search…";
    return;
  }

  apiCalls++;
  updateSearchCounters();
  searchStatus.textContent = `Searching for "${query}"…`;

  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`;
    const response = await fetch(url);
    const data = await response.json();

    searchStatus.textContent = `Found ${data.numFound.toLocaleString()} results — showing ${data.docs.length}`;

    renderBooks(data.docs);
  } catch (err) {
    searchStatus.textContent = "Error fetching results";
    console.error(err);
  }
}

function renderBooks(books) {
  if (books.length === 0) {
    resultsGrid.innerHTML = `<p class="loading">No results found.</p>`;
    return;
  }

  resultsGrid.innerHTML = books
    .map((book) => {
      const title = book.title || "Unknown Title";
      const author = book.author_name?.[0] || "Unknown Author";
      const cover = book.cover_i
        ? `<img class="book-cover"
                    src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg"
                    alt="${title}"
                    onerror="this.style.display='none';
                             this.nextElementSibling.style.display='flex'">`
        : "";
      const placeholder = `<div class="book-cover-placeholder"
            style="${book.cover_i ? "display:none" : ""}">📚</div>`;

      return `
            <div class="book-card">
                ${cover}${placeholder}
                <div class="book-info">
                    <p class="book-title">${title}</p>
                    <p class="book-author">${author}</p>
                </div>
            </div>`;
    })
    .join("");
}

// Search input event handler
const searchInput = document.getElementById("searchInput");
const debounceToggle = document.getElementById("debounceToggle");
const debounceLabel = document.getElementById("debounceLabel");

const debouncedFetch = debounce(fetchBooks, 300);

searchInput.addEventListener("input", (e) => {
  keystrokes++;
  updateSearchCounters();

  if (debounceToggle.checked) {
    debouncedFetch(e.target.value);
  } else {
    fetchBooks(e.target.value);
  }
});

debounceToggle.addEventListener("change", () => {
  debounceLabel.textContent = debounceToggle.checked
    ? "Debounce ON (300ms)"
    : "Debounce OFF — every keystroke hits the API";
});

document.getElementById("resetSearchBtn").addEventListener("click", () => {
  keystrokes = 0;
  apiCalls = 0;
  updateSearchCounters();
});

// ============================================================
// SCROLL WIRING
// ============================================================
const scrollBox = document.getElementById("scrollBox");
const progressBar = document.getElementById("progressBar");
const throttleToggle = document.getElementById("throttleToggle");
const throttleLabel = document.getElementById("throttleLabel");

// Fill scroll box with dummy content
const scrollContent = document.getElementById("scrollContent");
scrollContent.innerHTML = Array.from(
  { length: 30 },
  (_, i) =>
    `<p>Paragraph ${i + 1} — scroll down to see the progress bar update.
     Notice the difference in handler execution count when throttle
     is toggled on or off.</p>`,
).join("");

function updateProgress() {
  handlerRuns++;
  updateScrollCounters();

  const { scrollTop, scrollHeight, clientHeight } = scrollBox;
  const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
  progressBar.style.width = `${progress}%`;
}

const throttledProgress = throttle(updateProgress, 200);

scrollBox.addEventListener("scroll", () => {
  scrollEvents++;
  updateScrollCounters();

  if (throttleToggle.checked) {
    throttledProgress();
  } else {
    updateProgress();
  }
});

throttleToggle.addEventListener("change", () => {
  throttleLabel.textContent = throttleToggle.checked
    ? "Throttle ON (200ms)"
    : "Throttle OFF — every scroll event triggers handler";
});

document.getElementById("resetScrollBtn").addEventListener("click", () => {
  scrollEvents = 0;
  handlerRuns = 0;
  updateScrollCounters();
  progressBar.style.width = "0%";
  scrollBox.scrollTop = 0;
});
