const user = {
  name: "Sarah",

  greet() {
    console.log(`Hello ${this.name}`);
  },
};

const debounced = debounce(user.greet, 500);
debounced();

const itemList = document.getElementById("item-list");
const searchInput = document.getElementById("search");

// THis is a trailing debounce as it waits for 300ms before resopnding
function trailingDebounce(fn, delay) {
  let timer = null; // closes over timer

  return function (...args) {
    // Cancel previous timer every time event fires
    clearTimeout(timer);

    // Start new timer
    timer = setTimeout(() => {
      fn.apply(this, args); // only runs after delay ms of silence
    }, delay);
  };
}

function leadingDebounce(fn, delay) {
  let timer;

  return function (...args) {
    if (!timer) {
      fn.apply(this, args);
    }

    clearTimeout(timer);

    timer = setTimeout(() => {
      timer = null;
    }, delay);
  };
}

function searchAPI(query) {
  console.log(`Searching for: ${query}`);
  const filter = query.toLowerCase();
  Array.from(itemList.children).forEach((item) => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(filter) ? "" : "none";
  });
}

const debouncedSearch = trailingDebounce(searchAPI, 300);
// const debouncedSearch = leadingDebounce(searchAPI, 300);

searchInput.addEventListener("input", (e) => {
  debouncedSearch(e.target.value);
});

// Without debounce — typing "harry" fires 5 API calls
// With debounce  — typing "harry" fires 1 API call
