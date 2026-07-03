/*  1. Filter: To filter books based on category, price, pages and format 
    2. Reduce: TO find total no of books and their average price on each render
    3. Find: TO find 1 book when that book is clicked and its modal appears
*/
// DOM 
const productGrid = document.getElementById("product-grid");
const pagesFilterChange = document.getElementById("pagesFilter");
const priceFilterChange = document.getElementById("priceFilter");
const categoryFilterChange = document.getElementById("categoryFilter");
const hardCover = document.getElementById("hardCover");
const paperback = document.getElementById("paperback");
const eBook = document.getElementById("e-book");

const clearFilters = document.getElementById("clearFilters");
const applyFilters = document.getElementById("applyFilters");
const currentDetails = document.getElementById("current-details");

//Product Data
const books = [
    {
        title: "Harry Potter",
        category: "Fantasy",
        format: "E-book",
        price: 320,
        rating: "★ 4.5",
        pages: 200,
        coverImg: "./assets/bookCover-04.jpg",
    },
    {
        title: "Da Vinci Code",
        category: "Mystery",
        format: "Paperback",
        price: 280,
        rating: "★ 4.2",
        pages: 300,
        coverImg: "./assets/bookCover-05.png",
    },
    {
        title: "Summer of Love",
        category: "Romance",
        format: "E-book",
        price: 240,
        rating: "★ 4.0",
        pages: 450,
        coverImg: "./assets/bookCover-01.webp",
    },
    {
        title: "Percy Jackson",
        category: "Sci‑Fi",
        format: "Hard Cover",
        price: 360,
        rating: "★ 4.8",
        pages: 520,
        coverImg: "./assets/bookCover-02.webp",
    },
    {
        title: "Chance to Fly",
        category: "Historical",
        format: "Hard Cover",
        price: 499,
        pages: 700,
        rating: "★ 4.9",
        coverImg: "./assets/bookCover-03.webp",
    },
    {
        title: "Six of crows",
        category: "Sci‑Fi",
        format: "E-book",
        price: 430,
        rating: "★ 4.7",
        pages: 640,
        coverImg: "./assets/bookCover-06.webp",
    },
    {
        title: "The great gatsby",
        category: "Historical",
        format: "Hard Cover",
        price: 499,
        pages: 700,
        rating: "★ 4.9",
        coverImg: "./assets/bookCover-07.jpg",
    },
    {
        title: "Beyond the Stars",
        category: "Sci‑Fi",
        format: "E-book",
        price: 430,
        rating: "★ 4.7",
        pages: 640,
        coverImg: "./assets/bookCover-01.webp",
    },
];

function displayBooks(filterdResults = books) {
    if (filterdResults.length === 0) {
        productGrid.innerHTML = `<p style="color: var(--muted); grid-column: 1 / -1;">No books match your filters.</p>`;
        return;
    }
    productGrid.innerHTML = filterdResults.map((b) => `
        <article class="book-card" data-title="${b.title}">
            <div class="book-cover">
                <img src="${b.coverImg}" alt="${b.title} cover">
            </div>
            <div class="content">
                <h2>${b.title}</h2>
                <div class="author">by John Writer</div>
                <div class="genre">${b.category}</div>
                <div class="meta">
                    <span>₹ ${b.price}</span>
                    <span>${b.rating}</span>
                </div>
                <div class="actions">
                    <button class="primary add-to-cart-btn">Add to Cart</button>
                </div>
            </div>
        </article>
    `)
    .join("");
}
function dataDetails(data) {
    if (data.length === 0) {
        currentDetails.textContent = "No books match your filters.";
        return;
    }
    let totalPrice = data.reduce((acc, n) => acc + n.price, 0);
    let avgPrice = (totalPrice / data.length).toFixed(2);
    currentDetails.textContent = `Showing ${data.length} books · Total value ₹${totalPrice} · Avg price ₹${avgPrice}`;
}

/* function formatFilter(format){
    // accept either a single format string or an array of formats
    if (!format) return books;
    if (Array.isArray(format)) {
        return books.filter((book) => format.includes(book.format));
    }
    return books.filter((book) => book.format === format);
} */

/* function applyFormatFilters() {
    const selected = [];
    if (eBook && eBook.checked) selected.push('E-book');
    if (paperback && paperback.checked) selected.push('Paperback');
    if (hardCover && hardCover.checked) selected.push('Hard Cover');

    const results = selected.length ? formatFilter(selected) : books;
    displayBooks(results);
}

// wire checkbox change events (defensive: elements may be null)
if (eBook) eBook.addEventListener('change', applyFormatFilters);
if (paperback) paperback.addEventListener('change', applyFormatFilters);
if (hardCover) hardCover.addEventListener('change', applyFormatFilters); */

/* function priceFilter(price){
    // treat price as maximum value for filter
    const max = Number(price);
    const book = books.filter((book) => Number(book.price) <= max);
    return book
} */

/* function pagesFilter(pages){
    if(pages === "Quick Reads"){
        const book = books.filter((book) => book.pages <= 300)
        return book
    }
    else if(pages === "Standard Reads"){
        const book = books.filter((book) => book.pages > 300 && book.pages <= 550)
        return book
    }
    else if(pages === "Epic Reads"){
        const book = books.filter((book) => book.pages > 500 && book.pages <= 700)
        return book
    }
}
 */

function applyAllFilters(){

    let result = books;
 
    // 1. Category
    if (categoryFilterChange.value !== "All Categories") {
        result = result.filter((book) => book.category === categoryFilterChange.value);
    }
 
    // 2. Price (slider value treated as a maximum)
    const max = Number(priceFilterChange.value);
    result = result.filter((book) => book.price <= max);
 
    // 3. Pages
    const pages = pagesFilterChange.value;
    if(pages !== "Beginner"){
        if (pages === "Quick Reads") {
            result = result.filter((book) => book.pages <= 300);
        } else if (pages === "Standard Reads") {
            result = result.filter((book) => book.pages > 300 && book.pages <= 550);
        } else if (pages === "Epic Reads") {
            result = result.filter((book) => book.pages > 550 && book.pages <= 700);
        }
    }
 
    // 4. Format (checkboxes)
    const selectedFormats = [];
    if (eBook.checked) selectedFormats.push("E-book");
    if (paperback.checked) selectedFormats.push("Paperback");
    if (hardCover.checked) selectedFormats.push("Hard Cover");
 
    if (selectedFormats.length > 0) {
        result = result.filter((book) => selectedFormats.includes(book.format));
    }
    dataDetails(result);
 
    return result;
}

function openBookModal(title) {
    // find() returns exactly one matching object (or undefined)
    const book = books.find((b) => b.title === title);
 
    if (!book) return;
 
    modalTitle.textContent = book.title;
    modalCategory.textContent = book.category;
    modalImage.src = book.coverImg;
    modalImage.alt = `${book.title} cover`;
    modalFormat.textContent = book.format;
    modalPages.textContent = `${book.pages}`;
    modalPrice.textContent = `₹ ${book.price}`;
    modalRating.textContent = book.rating;
 
    modalOverlay.classList.remove("hidden");
}
 
function closeBookModal() {
    modalOverlay.classList.add("hidden");
}
 
// One listener on the grid handles clicks on any card, including cards added after re-renders from filtering.
productGrid.addEventListener("click", (event) => {
    // Don't open the modal if "Add to Cart" was clicked
    if (event.target.closest(".add-to-cart-btn")) {
        return;
    }
 
    const card = event.target.closest(".book-card");
    if (!card) return;
 
    openBookModal(card.dataset.title);
});
 
closeModal.addEventListener("click", closeBookModal);
 
// Click outside the modal box (on the dark overlay) also closes it
modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
        closeBookModal();
    }
});
 
// Every control triggers the same combined filter function
[categoryFilterChange, priceFilterChange, pagesFilterChange, eBook, paperback, hardCover]
  .forEach(el => el.addEventListener('change', () => displayBooks(applyAllFilters())));
/* categoryFilterChange.addEventListener('change', () => {
    displayBooks(applyAllFilters());
});
 
priceFilterChange.addEventListener('change', () => {
    displayBooks(applyAllFilters());
});
 
pagesFilterChange.addEventListener('change', () => {
    displayBooks(applyAllFilters());
});
 
eBook.addEventListener('change', () => {
    displayBooks(applyAllFilters());
});
 
paperback.addEventListener('change', () => {
    displayBooks(applyAllFilters());
});
 
hardCover.addEventListener('change', () => {
    displayBooks(applyAllFilters());
});
 
applyFilters.addEventListener('click', () => {
    displayBooks(applyAllFilters());
});
 */ 
clearFilters.addEventListener('click', () => {
    categoryFilterChange.value = "All Categories";
    priceFilterChange.value = priceFilterChange.max;
    pagesFilterChange.selectedIndex = 0;
    eBook.checked = false;
    paperback.checked = false;
    hardCover.checked = false;
    displayBooks();
    dataDetails(books);
});
// Initial render
displayBooks();
dataDetails(books);

