// Handles switching between sidebar pages and opening/closing modals.
// This file intentionally does NOT touch your Library/Book/Member classes —
// that wiring is the actual learning task for this exercise.

const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const targetPage = item.dataset.page;

    navItems.forEach((nav) => nav.classList.remove("active"));
    item.classList.add("active");

    pages.forEach((page) => {
      page.classList.toggle("active", page.id === `page-${targetPage}`);
    });
  });
});

// Modal open/close
const openAddBookBtn = document.getElementById("openAddBookBtn");
const openAddMemberBtn = document.getElementById("openAddMemberBtn");
const closeButtons = document.querySelectorAll("[data-close-modal]");

function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
}

function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}

openAddBookBtn.addEventListener("click", () => openModal("addBookModal"));
openAddMemberBtn.addEventListener("click", () => openModal("addMemberModal"));

closeButtons.forEach((btn) => {
  btn.addEventListener("click", () => closeModal(btn.dataset.closeModal));
});

// Click outside modal box closes it
document.querySelectorAll(".modal-overlay").forEach((overlay) => {
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      overlay.classList.add("hidden");
    }
  });
});
