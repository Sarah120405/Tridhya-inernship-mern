// ============================================================
// This file assumes libraryManagement.js is loaded first, and
// assumes you've added getAllMembers() / getAllBorrowingRecords()
// to your Library class, and matchSearch().
// ============================================================

const library = Library.getInstance();
const librarian = new Librarian("Alice", "alice@lib.com", "EMP001");

// ---------- Seed data so the UI has something to render ----------
librarian.addBook(
  library,
  new Book("Harry Potter", "Rowling", "Fantasy", 3, "ISBN001"),
);
librarian.addBook(
  library,
  new Book("Clean Code", "Robert Martin", "Tech", 2, "ISBN002"),
);
librarian.addBook(
  library,
  new Book("Atomic Habits", "James Clear", "Self Help", 5, "ISBN003"),
);

const memberSarah = new Member("Sarah", "sarah@gmail.com");
const memberJohn = new Member("John", "john@gmail.com");
library.registerMember(memberSarah);
library.registerMember(memberJohn);
// ---------- DOM references ----------
const statTotalBooks = document.getElementById("statTotalBooks");
const statTotalMembers = document.getElementById("statTotalMembers");
const statBorrowed = document.getElementById("statBorrowed");
const statOverdue = document.getElementById("statOverdue");
const recentActivityList = document.getElementById("recentActivityList");
const recentActivityCount = document.getElementById("recentActivityCount");

const bookGrid = document.getElementById("bookGrid");
const bookSearchInput = document.getElementById("bookSearchInput");
const bookTypeFilter = document.getElementById("bookTypeFilter");
const addBookForm = document.getElementById("addBookForm");

const memberList = document.getElementById("memberList");
const memberListCount = document.getElementById("memberListCount");
const memberSearchInput = document.getElementById("memberSearchInput");
const memberDetailPanel = document.getElementById("memberDetailPanel");
const addMemberForm = document.getElementById("addMemberForm");

const historyTableBody = document.getElementById("historyTableBody");
const historyStatusFilter = document.getElementById("historyStatusFilter");

const statTopGenre = document.getElementById("statTopGenre");
const statAvgDuration = document.getElementById("statAvgDuration");
const statTotalFines = document.getElementById("statTotalFines");
const statTopMember = document.getElementById("statTopMember");
const genreBreakdown = document.getElementById("genreBreakdown");

let selectedMemberId = null;

// ---------- Small helpers ----------
function isOverdue(record) {
  return !record.returned && new Date() > record.dueDate;
}

function spineColorFor(item) {
  const palette = ["#c9954f", "#5cb885", "#d97757", "#8b7fd1", "#c95f8a"];
  let hash = 0;
  for (const char of item.genre) hash += char.charCodeAt(0);
  return palette[hash % palette.length];
}

function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function calculateFineForRecord(record) {
  if (!record?.member || !record?.book) return 0;
  return record.member.calculateFine(record.book.ISBN);
}

// ============================================================
// DASHBOARD
// ============================================================
function renderDashboard() {
  const allRecords = library.getAllBorrowingRecords();
  const activeRecords = allRecords.filter((r) => !r.returned);
  const overdueRecords = activeRecords.filter(isOverdue);

  statTotalBooks.textContent = library.totalBooks;
  statTotalMembers.textContent = library.totalMembers;
  statBorrowed.textContent = activeRecords.length;
  statOverdue.textContent = overdueRecords.length;

  // Most recent 5 records, newest first
  const recent = [...allRecords]
    .sort((a, b) => b.borrowDate - a.borrowDate)
    .slice(0, 5);

  recentActivityCount.textContent = recent.length;

  if (recent.length === 0) {
    recentActivityList.innerHTML = `<li style="justify-content:center; color:var(--muted);">No activity yet.</li>`;
    return;
  }

  recentActivityList.innerHTML = recent
    .map(
      (r) => `
        <li>
            <span>${r.member.name} borrowed "${r.book.title}"</span>
            <span class="time">${formatDate(r.borrowDate)}</span>
        </li>
    `,
    )
    .join("");
}

// ============================================================
// BOOKS PAGE
// ============================================================
function renderBookGrid(items) {
  if (items.length === 0) {
    bookGrid.innerHTML = `<p style="color:var(--muted);">No items match your search.</p>`;
    return;
  }

  bookGrid.innerHTML = items
    .map((item) => {
      const isAvailable = item.copies > 0;

      return `
                <article class="book-card">
                    <div class="book-spine" style="background:${spineColorFor(item)}"></div>
                    <div class="book-card-body">
                        <h4>${item.title}</h4>
                          <p class="byline">by ${item.author}</p>
                          <p class="byline">${item.genre}</p>
                        
                        <div class="meta-row">
                            <span>ISBN ${item.ISBN}</span>
                            <span class="badge ${isAvailable ? "available" : "unavailable"}">
                                ${isAvailable ? `${item.copies} available` : "Unavailable"}
                            </span>
                        </div>
                        <button class="inner-btn borrow-btn ${isAvailable ? "" : "disabled"}" data-isbn="${item.ISBN}" data-title="${item.title}" id="borrowBtn" ${isAvailable ? "" : "disabled"}>${isAvailable ? "Borrow" : "Unavailable"}</button>
                    </div>
                </article>
            `;
    })
    .join("");
}

bookGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".borrow-btn");

  if (!btn) return;

  openBorrowModal(btn.dataset.title, btn.dataset.isbn);
});

function getFilteredBooks() {
  const query = bookSearchInput.value.trim();
  const genreFilter = bookTypeFilter.value;

  let items = query ? library.searchBooks(query) : library.displayBooks();

  if (genreFilter !== "all") {
    items = items.filter((item) => item.genre === genreFilter);
  }

  return items;
}

bookSearchInput.addEventListener("input", () =>
  renderBookGrid(getFilteredBooks()),
);
bookTypeFilter.addEventListener("change", () =>
  renderBookGrid(getFilteredBooks()),
);

addBookForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.getElementById("bookTitle").value.trim();
  const author = document.getElementById("bookAuthor").value.trim();
  const genre = document.getElementById("bookGenre").value.trim();
  const copies = Number(document.getElementById("bookCopies").value);
  const ISBN = document.getElementById("bookISBN").value.trim();

  const newBook = new Book(title, author, genre, copies, ISBN);
  let res = librarian.addBook(library, newBook);

  if (!res) {
    alert(res);
    return;
  }
  addBookForm.reset();
  document.getElementById("addBookModal").classList.add("hidden");

  renderBookGrid(getFilteredBooks());
  renderDashboard();
});

function openBorrowModal(title, isbn) {
  document.getElementById("borrowBookTitle").value = title;
  document.getElementById("borrowBookISBN").value = isbn;

  const today = new Date();

  const due = new Date();
  due.setDate(today.getDate() + 14);

  document.getElementById("borrowDate").value = today
    .toISOString()
    .split("T")[0];

  document.getElementById("dueDate").value = due.toISOString().split("T")[0];

  populateMemberDropdown();

  openModal("borrowBookModal");
}

function populateMemberDropdown() {
  const select = document.getElementById("borrowMember");

  select.innerHTML = `<option value="">Choose Member</option>`;

  library.getAllMembers().forEach((member) => {
    const option = document.createElement("option");

    option.value = member.itemId;
    option.textContent = member.name;

    select.appendChild(option);
  });
}
document.getElementById("borrowBookForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const memberId = document.getElementById("borrowMember").value;

  const isbn = document.getElementById("borrowBookISBN").value;

  const member = library.getAllMembers().find((m) => m.itemId == memberId);

  const result = library.borrowBook(member, isbn);

  alert(result);

  closeModal("borrowBookModal");

  renderBookGrid(getFilteredBooks());
  renderDashboard();
  renderHistoryTable();
});

// MEMBERS PAGE
function renderMemberList(members) {
  memberListCount.textContent = members.length;

  if (members.length === 0) {
    memberList.innerHTML = `<li style="color:var(--muted);">No members found.</li>`;
    return;
  }

  memberList.innerHTML = members
    .map(
      (member) => `
        <li class="member-row ${member.itemId === selectedMemberId ? "active" : ""}" data-member-id="${member.itemId}">
            <div class="member-avatar">${initials(member.name)}</div>
            <div>
                <p class="name">${member.name}</p>
                <p class="sub">${member.borrowedCount}/3 borrowed · ${member.canBorrow ? "Can borrow" : "Limit reached"}</p>
            </div>
        </li>
    `,
    )
    .join("");
}

memberList.addEventListener("click", (event) => {
  const row = event.target.closest(".member-row");
  if (!row) return;

  const memberId = Number(row.dataset.memberId);
  selectedMemberId = memberId;

  const member = library.getAllMembers().find((m) => m.itemId === memberId);
  if (!member) return;

  renderMemberList(getFilteredMembers());
  renderMemberDetail(member);
});

function renderMemberDetail(member) {
  const borrowed = member.getBorrowedBooks();
  const history = member.getBorrowingHistory();

  const borrowedRows = borrowed.length
    ? borrowed
        .map(
          (r) => `
            <li>
                <span class="detail-item-title">${r.book.title}</span>
                <span class="sub">Due ${formatDate(r.dueDate)}</span>
                <button class="inner-btn return-btn" data-isbn="${r.book.ISBN}">Return</button>
            </li>
        `,
        )
        .join("")
    : `<li class="empty-state-row">No books currently borrowed.</li>`;

  const memberDetails = member.getDetails();
  const recentHistory = [...history].slice(-3);
  const borrowHistory = recentHistory.length
    ? recentHistory
        .map((r) => {
          return `<li>
            <span class="detail-item-title">${r.book.title}</span>
            <span class="sub">Returned at ${formatDate(r.returnDate)}</span>
          </li>`;
        })
        .join("")
    : `<li class="empty-state-row">No recent history yet.</li>`;

  memberDetailPanel.innerHTML = `
        <div class="member-detail-card">
          <div class="member-detail-header">
            <h4 class="member-detail-name">${memberDetails.name}</h4>
            <p class="member-detail-email">${memberDetails.email}</p>
            <p class="member-detail-status">
              ${member.borrowedCount}/3 currently borrowed ·
              ${member.canBorrow ? "Can borrow more" : "Borrowing limit reached"}
            </p>
          </div>

          <div class="detail-section">
            <div class="detail-section-header">
              <p class="detail-section-title">Currently Borrowed</p>
            </div>
            <ul class="activity-list detail-list">${borrowedRows}</ul>
          </div>

          <div class="detail-section">
            <div class="detail-section-header">
              <p class="detail-section-title">Recent History</p>
              <span class="count-pill">${history.length}</span>
            </div>
            <ul class="activity-list detail-list">${borrowHistory}</ul>
          </div>
        </div>
      `;
}

memberDetailPanel.addEventListener("click", (e) => {
  const btn = e.target.closest(".return-btn");

  if (!btn) return;
  const memberId = library
    .getAllMembers()
    .find((member) => member.itemId === selectedMemberId);
  if (!memberId) {
    console.log("No member id");
    return;
  }
  const res = library.returnBook(memberId, btn.dataset.isbn);
  renderMemberList(getFilteredMembers());
  renderMemberDetail(memberId);
  renderBookGrid(getFilteredBooks());
  renderDashboard();
  alert(res);
});
function getFilteredMembers() {
  const term = memberSearchInput.value.trim().toLowerCase();
  const all = library.getAllMembers();
  return term ? all.filter((m) => m.name.toLowerCase().includes(term)) : all;
}

memberSearchInput.addEventListener("input", () =>
  renderMemberList(getFilteredMembers()),
);

addMemberForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("memberName").value.trim();
  const email = document.getElementById("memberEmail").value.trim();

  library.registerMember(new Member(name, email));

  addMemberForm.reset();
  document.getElementById("addMemberModal").classList.add("hidden");

  renderMemberList(getFilteredMembers());
  renderDashboard();
});

// ============================================================
// BORROWING HISTORY PAGE
// ============================================================
function renderHistoryTable() {
  const filter = historyStatusFilter.value;
  let records = library.getAllBorrowingRecords();

  if (filter === "active") {
    records = records.filter((r) => !r.returned);
  } else if (filter === "returned") {
    records = records.filter((r) => r.returned);
  } else if (filter === "overdue") {
    records = records.filter(isOverdue);
  }

  if (records.length === 0) {
    historyTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--muted);">No records match this filter.</td></tr>`;
    return;
  }

  historyTableBody.innerHTML = records
    .map((r) => {
      let statusClass = "returned";
      let statusText = "Returned";
      if (!r.returned) {
        statusClass = isOverdue(r) ? "overdue" : "active";
        statusText = isOverdue(r) ? "Overdue" : "Borrowed";
      }

      const fine = calculateFineForRecord(r);

      return `
                <tr>
                    <td>${r.member.name}</td>
                    <td>${r.book.title}</td>
                    <td>${formatDate(r.borrowDate)}</td>
                    <td>${formatDate(r.dueDate)}</td>
                    <td><span class="status-tag ${statusClass}">${statusText}</span></td>
                    <td>${fine > 0 ? `₹${fine}` : "—"}</td>
                </tr>
            `;
    })
    .join("");
}

historyStatusFilter.addEventListener("change", renderHistoryTable);

// ============================================================
// STATISTICS PAGE
// ============================================================
function renderStatistics() {
  const members = library.getAllMembers();
  const allRecords = library.getAllBorrowingRecords();

  // Most borrowed genre — counts how many borrow records touched each genre
  const genreCounts = {};
  allRecords.forEach((r) => {
    const genre = r.book.genre;
    if (!genre) return; // skip magazines, which have no genre
    genreCounts[genre] = (genreCounts[genre] || 0) + 1;
  });

  const genreEntries = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
  statTopGenre.textContent = genreEntries.length ? genreEntries[0][0] : "—";

  const maxCount = genreEntries.length ? genreEntries[0][1] : 1;
  genreBreakdown.innerHTML = genreEntries.length
    ? genreEntries
        .map(
          ([genre, count]) => `
            <div class="breakdown-row">
                <span>${genre}</span>
                <div class="breakdown-bar-track">
                    <div class="breakdown-bar-fill" style="width:${(count / maxCount) * 100}%"></div>
                </div>
                <span>${count}</span>
            </div>
        `,
        )
        .join("")
    : `<p style="color:var(--muted);">No borrowing activity yet.</p>`;

  // Total fines across all borrowing records, including active overdue loans
  let totalFines = 0;
  allRecords.forEach((record) => {
    totalFines += calculateFineForRecord(record);
  });
  statTotalFines.textContent = `₹${totalFines}`;

  // Most active member = highest (currently borrowed + history) count
  let topMember = null;
  let topScore = -1;
  members.forEach((member) => {
    const score = member.borrowedCount + member.getBorrowingHistory().length;
    if (score > topScore) {
      topScore = score;
      topMember = member;
    }
  });
  statTopMember.textContent = topMember ? topMember.name : "—";

  // Show how many members currently have at least one active borrow.
  const activeBorrowers = new Set(
    allRecords.filter((r) => !r.returned).map((r) => r.member.itemId),
  );

  statAvgDuration.textContent = activeBorrowers.size;
}

// ============================================================
// Re-render the relevant page whenever its nav item is clicked,
// so data is always fresh instead of computed once on load.
// ============================================================
document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    const page = item.dataset.page;
    if (page === "dashboard") renderDashboard();
    if (page === "books") renderBookGrid(getFilteredBooks());
    if (page === "members") renderMemberList(getFilteredMembers());
    if (page === "history") renderHistoryTable();
    if (page === "statistics") renderStatistics();
  });
});

// ---------- Initial render ----------
renderDashboard();
renderBookGrid(getFilteredBooks());
renderMemberList(getFilteredMembers());
renderHistoryTable();
renderStatistics();
