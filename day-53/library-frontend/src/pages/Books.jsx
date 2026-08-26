import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteBook,
  fetchBooks,
  fetchBookStatistics,
  fetchMostBorrowedBooks,
  fetchOverdueBooks,
} from "../store/slice/bookSlice";
import { MetricCard } from "../components/MetricCard";
import Modal from "../components/Modal";
import { FiBookOpen, FiEdit, FiTrash } from "react-icons/fi";
import { useState } from "react";
import BookForm from "../components/BookForm";
import { fetchAuthors } from "../store/slice/authorSlice";
import { useSearch } from "../hooks/useSearch";

export default function BooksList() {
  const { items, overdueBooks, mostBorrowed, statistics, loading, error } =
    useSelector((state) => state.bookSlice);

  const { authors } = useSelector((state) => state.authorSlice);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchOverdueBooks());
    dispatch(fetchBookStatistics());
    dispatch(fetchMostBorrowedBooks());
    dispatch(fetchAuthors());
  }, [dispatch]);

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(items, [
    "title",
    "genre",
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  function handleBookSaved() {
    setModalOpen(false);
    setEditingBook(null);
    dispatch(fetchBooks());
  }

  if (loading) return <p>Loading books...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="min-h-full bg-[#FAF9FC] p-2">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-7">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#9A93A3] mb-2">
            <span>Dashboard</span>
            <span>›</span>
            <span className="text-[#6F6878]">Books</span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-[#29252F]">
            Books
          </h1>

          <p className="mt-1 text-sm text-[#6F6878]">
            Manage and organize all books in the library.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingBook(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6C5DD3] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#5949BE] hover:shadow-md"
        >
          <span className="text-lg leading-none">+</span>
          Add New Book
        </button>
      </header>

      {modalOpen && (
        <Modal
          title={editingBook ? "Edit Book" : "Add Book"}
          onClose={() => setModalOpen(false)}
        >
          <BookForm
            existingBook={editingBook}
            authors={authors}
            onSuccess={handleBookSaved}
            onCancel={() => setModalOpen(false)}
          />
        </Modal>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-7">
        <MetricCard
          icon={<FiBookOpen />}
          title="Total Books"
          value={items.length}
          description="All books in library"
          icon_2={<FiBookOpen />}
        />

        <MetricCard
          icon={<FiBookOpen />}
          title="Overdue Books"
          value={overdueBooks.length}
          description="Books past their due date"
          icon_2={<FiBookOpen />}
        />

        <MetricCard
          icon={<FiBookOpen />}
          title="Most Borrowed"
          value={mostBorrowed.length}
          description="Frequently borrowed books"
          icon_2={<FiBookOpen />}
        />
      </div>
      <section className="overflow-hidden rounded-2xl border border-[#E8E1EF] bg-white shadow-[0_2px_8px_rgba(63,45,82,0.05)] mb-6">
        {/* Table header */}
        <div className="flex flex-col gap-3 border-b border-[#E8E1EF] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#29252F]">
              All Books
            </h2>
            <p className="mt-1 text-xs text-[#9A93A3]">
              Browse and manage books in your library.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder="Search books..."
              className="w-full sm:w-56 rounded-xl border border-[#E8E1EF] bg-[#FAF9FC] px-3 py-2 text-sm text-[#29252F] outline-none transition placeholder:text-[#AAA3B2] focus:border-[#8B7CE6] focus:bg-white focus:ring-3 focus:ring-[#8B5CF6]/10"
            />

            <select className="rounded-xl border border-[#E8E1EF] bg-white px-3 py-2 text-sm text-[#6F6878] outline-none focus:border-[#8B7CE6]">
              <option>All Genres</option>
              <option>Fiction</option>
              <option>Fantasy</option>
              <option>Romance</option>
              <option>Science</option>
            </select>
          </div>
        </div>

        {!loading && (
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto scrollbar-none">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="bg-[#FAF7FF] text-left text-[11px] uppercase tracking-wider text-[#8C8395]">
                  <th className="px-5 py-3 font-semibold">Book</th>
                  <th className="px-5 py-3 font-semibold">Author</th>
                  <th className="px-5 py-3 font-semibold">Genre</th>
                  <th className="px-5 py-3 font-semibold">Copies</th>
                  <th className="px-5 py-3 font-semibold">Published Year</th>
                  <th className="px-5 py-3 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((book) => (
                  <tr
                    key={book.id}
                    className="border-b border-[#F0EBF3] last:border-0 transition hover:bg-[#FCFAFF]"
                  >
                    {/* Book */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-[#29252F]">
                          {book.title}
                        </p>

                        <p className="mt-0.5 text-xs text-[#9A93A3]">
                          Book ID: #{book.id}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-[#6F6878]">
                        {book.Author?.name || "Unknown"}
                      </span>
                    </td>

                    {/* Genre */}
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-[#EDE9FE] px-2.5 py-1 text-xs font-medium text-[#6C5DD3]">
                        {book.genre}
                      </span>
                    </td>

                    {/* Copies */}
                    <td className="px-5 py-4">
                      <span
                        className={`font-medium ${
                          book.copies_available === 0
                            ? "text-[#DC6477]"
                            : book.copies_available <= 2
                              ? "text-[#E5A23C]"
                              : "text-[#34A879]"
                        }`}
                      >
                        {book.copies_available}
                      </span>
                    </td>

                    {/* Year */}
                    <td className="px-5 py-4 text-[#6F6878]">
                      {book.published_year}
                    </td>
                    <td className="px-5 py-4 flex gap-3">
                      <button
                        onClick={() => {
                          setEditingBook(book);
                          setModalOpen(true);
                        }}
                      >
                        <FiEdit />
                      </button>
                      <button onClick={() => dispatch(deleteBook(book.id))}>
                        <FiTrash />
                      </button>
                    </td>
                  </tr>
                ))}

                {items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <FiBookOpen className="mx-auto mb-2 text-2xl text-[#C9C1D0]" />

                      <p className="text-sm font-medium text-[#6F6878]">
                        No books found
                      </p>

                      <p className="mt-1 text-xs text-[#9A93A3]">
                        Try changing your search or filters.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-2 h-full">
        {/* Overdue Books */}
        <section className="rounded-2xl border border-[#E8E1EF] bg-white p-5 shadow-[0_2px_8px_rgba(63,45,82,0.05)]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-[#29252F]">
                Overdue Books
              </h3>
              <p className="mt-1 text-xs text-[#9A93A3]">
                Books that need to be returned.
              </p>
            </div>
            <div className="rounded-xl bg-[#FCEBED] p-2.5 text-[#DC6477]">
              <FiBookOpen />
            </div>
          </div>
          {overdueBooks.length === 0 ? (
            <div className="rounded-xl bg-[#E8F7F0] px-4 py-5 text-center">
              <p className="text-sm font-medium text-[#277E5B]">
                No overdue books
              </p>
              <p className="mt-1 text-xs text-[#6F8F81]">
                Everything is currently on track.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {overdueBooks.map((record) => (
                <div
                  key={`${record.title}-${record.member_name}`}
                  className="flex items-center justify-between gap-4 border-b border-[#F0EBF3] py-3 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#29252F]">
                      {record.title}
                    </p>

                    <p className="mt-0.5 text-xs text-[#9A93A3]">
                      Borrowed by {record.member_name}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-[#FCEBED] px-2.5 py-1 text-xs font-medium text-[#DC6477]">
                    {record.days_borrowed} days
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Most Borrowed */}
        <section className="rounded-2xl border border-[#E8E1EF] bg-white p-5 shadow-[0_2px_8px_rgba(63,45,82,0.05)]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-[#29252F]">
                Most Borrowed Books
              </h2>

              <p className="mt-1 text-xs text-[#9A93A3]">
                Your library's most popular books.
              </p>
            </div>

            <div className="rounded-xl bg-[#EDE9FE] p-2.5 text-[#6C5DD3]">
              <FiBookOpen />
            </div>
          </div>

          {mostBorrowed.length === 0 ? (
            <div className="rounded-xl bg-[#FAF7FF] px-4 py-5 text-center">
              <p className="text-sm text-[#9A93A3]">No borrow data yet.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {mostBorrowed.map((book, index) => (
                <div
                  key={book.title}
                  className="flex items-center justify-between border-b border-[#F0EBF3] py-3 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EDE9FE] text-xs font-semibold text-[#6C5DD3]">
                      {index + 1}
                    </span>

                    <span className="text-sm font-medium text-[#29252F]">
                      {book.title}
                    </span>
                  </div>

                  <span className="text-xs font-medium text-[#6F6878]">
                    {book.times_borrowed} borrows
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Book Statistics */}
      <section className="mt-5 rounded-2xl border border-[#E8E1EF] bg-white p-5 shadow-[0_2px_8px_rgba(63,45,82,0.05)]">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-[#29252F]">
            Book Statistics
          </h2>

          <p className="mt-1 text-xs text-[#9A93A3]">
            Borrowing performance across your library.
          </p>
        </div>

        {statistics.length === 0 ? (
          <p className="rounded-xl bg-[#FAF7FF] px-4 py-6 text-center text-sm text-[#9A93A3]">
            No statistics available.
          </p>
        ) : (
          <div className="overflow-x-auto max-h-[300px] overflow-y-auto scrollbar-none">
            <table className="w-full min-w-[650px] text-sm">
              <thead>
                <tr className="border-b border-[#E8E1EF] text-left text-[11px] uppercase tracking-wider text-[#8C8395]">
                  <th className="py-3 font-semibold">Title</th>
                  <th className="py-3 font-semibold">Author</th>
                  <th className="py-3 font-semibold">Total Borrows</th>
                  <th className="py-3 font-semibold">Copies Available</th>
                </tr>
              </thead>
              <tbody>
                {statistics.map((book) => (
                  <tr
                    key={book.id}
                    className="border-b border-[#F0EBF3] last:border-0 hover:bg-[#FCFAFF]"
                  >
                    <td className="py-3 font-medium text-[#29252F]">
                      {book.title}
                    </td>

                    <td className="py-3 text-[#6F6878]">{book.author_name}</td>

                    <td className="py-3 text-[#6F6878]">
                      {book.total_borrows}
                    </td>

                    <td className="py-3">
                      <span
                        className={`font-medium ${
                          book.copies_available === 0
                            ? "text-[#DC6477]"
                            : "text-[#34A879]"
                        }`}
                      >
                        {book.copies_available}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
