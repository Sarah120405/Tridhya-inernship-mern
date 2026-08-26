import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  borrowBook,
  returnBook,
  fetchActiveBorrowRecords,
  clearMessage,
} from "../store/slice/borrowSlice";
import { fetchBooks } from "../store/slice/bookSlice";
import { fetchMembers } from "../store/slice/memberSlice";
import Modal from "../components/Modal";

import {
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiUser,
  FiX,
} from "react-icons/fi";
import { MetricCard } from "../components/MetricCard";
import { useSearch } from "../hooks/useSearch";
import { useAutoDismiss } from "../hooks/useAutoDismiss";

export default function BorrowRecords() {
  const { loading, error, message, activeBorrowRecords } = useSelector(
    (state) => state.borrowSlice,
  );

  const { items: books } = useSelector((state) => state.bookSlice);
  const { members } = useSelector((state) => state.memberSlice);

  const dispatch = useDispatch();

  const [borrowFormActive, setBorrowFormActive] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [returningId, setReturningId] = useState(null);
  useEffect(() => {
    dispatch(fetchActiveBorrowRecords());
    dispatch(fetchBooks());
    dispatch(fetchMembers());
  }, [dispatch]);

  const availableBooks = useMemo(() => {
    return books.filter((book) => book.copies_available > 0);
  }, [books]);

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(
    activeBorrowRecords,
    ["title", "member_name"],
  );
  useAutoDismiss(message, () => dispatch(clearMessage()));

  function openBorrowModal() {
    setSelectedBookId("");
    setSelectedMemberId("");
    setBorrowFormActive(true);
  }

  function closeBorrowModal() {
    setBorrowFormActive(false);
    setSelectedBookId("");
    setSelectedMemberId("");
  }

  async function handleBorrow(e) {
    e.preventDefault();

    if (!selectedBookId || !selectedMemberId) return;

    const resultAction = await dispatch(
      borrowBook({
        bookId: selectedBookId,
        memberId: selectedMemberId,
      }),
    );

    if (borrowBook.fulfilled.match(resultAction)) {
      await dispatch(fetchActiveBorrowRecords());
      await dispatch(fetchBooks());
      setBorrowFormActive(false);
      setSelectedBookId("");
      setSelectedMemberId("");
    }
  }

  async function handleReturn(recordId) {
    const confirmed = window.confirm(
      "Are you sure you want to mark this book as returned?",
    );

    if (!confirmed) return;

    setReturningId(recordId);

    const resultAction = await dispatch(returnBook(recordId));

    if (returnBook.fulfilled.match(resultAction)) {
      await dispatch(fetchActiveBorrowRecords());
    }

    setReturningId(null);
  }

  return (
    <div className="min-h-full bg-[#FAF9FC] p-2">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#29252F]">
            Borrow Records
          </h1>

          <p className="mt-1 text-sm text-[#6F6878]">
            Manage active book loans and keep track of borrowed books.
          </p>
        </div>

        <button
          onClick={openBorrowModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8B5CF6] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#7C4FE0] hover:shadow-md"
        >
          <FiPlus size={17} />
          New Borrow Record
        </button>
      </div>

      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          icon={<FiBookOpen />}
          title="Active Borrows"
          value={activeBorrowRecords.length}
          icon_2={<FiBookOpen />}
        />
        <MetricCard
          icon={<FiCheckCircle />}
          title="Active Books"
          value={availableBooks.length}
          icon_2={<FiCheckCircle />}
        />
        <MetricCard
          icon={<FiUser />}
          title="Registered Members"
          value={members.length}
          icon_2={<FiUser />}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E8E1EF] bg-white shadow-[0_2px_8px_rgba(63,45,82,0.04)]">
        <div className="flex flex-col gap-4 border-b border-[#E8E1EF] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#29252F]">
              Active Borrow Records
            </h2>

            <p className="mt-1 text-sm text-[#6F6878]">
              Books that are currently borrowed by members.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <FiSearch
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B94A3]"
            />

            <input
              type="text"
              placeholder="Search book or member..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-[#E8E1EF] bg-[#FAF9FC] py-2.5 pl-10 pr-4 text-sm text-[#29252F] outline-none transition placeholder:text-[#A7A0AD] focus:border-[#C4B5FD] focus:bg-white focus:ring-2 focus:ring-[#EDE9FE]"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center gap-3">
            <FiRefreshCw size={24} className="animate-spin text-[#8B5CF6]" />

            <p className="text-sm text-[#6F6878]">Loading borrow records...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EDE9FE] text-[#8B5CF6]">
              <FiBookOpen size={24} />
            </div>

            <h3 className="text-base font-semibold text-[#29252F]">
              {searchTerm ? "No matching records" : "No active borrow records"}
            </h3>

            <p className="mt-1 max-w-sm text-sm text-[#6F6878]">
              {searchTerm
                ? "Try searching with a different book title or member name."
                : "All books are currently available. Create a new borrow record when a member borrows a book."}
            </p>

            {!searchTerm && (
              <button
                onClick={openBorrowModal}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#8B5CF6] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#7C4FE0]"
              >
                <FiPlus size={16} />
                Create Borrow Record
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full min-w-[700px]">
              <thead className="sticky top-0 bg-[#FAF9FC] z-10">
                <tr className="border-b border-[#E8E1EF] bg-[#FAF9FC] text-left">
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[#8A8291]">
                    Book
                  </th>

                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[#8A8291]">
                    Member
                  </th>

                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[#8A8291]">
                    Borrowed
                  </th>

                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[#8A8291]">
                    Copies Available
                  </th>

                  <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-[#8A8291]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F0EBF3]">
                {filteredItems.map((record) => (
                  <tr key={record.id} className="transition hover:bg-[#FCFAFF]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EDE9FE] text-[#8B5CF6]">
                          <FiBookOpen size={18} />
                        </div>

                        <div>
                          <p className="font-medium text-[#29252F]">
                            {record.title}
                          </p>

                          <p className="text-xs text-[#8A8291]">
                            Book ID: {record.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FCE7F3] text-sm font-semibold text-[#D65A91]">
                          {record.member_name?.charAt(0).toUpperCase()}
                        </div>

                        <span className="text-sm font-medium text-[#4A4451]">
                          {record.member_name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-[#6F6878]">
                        <FiCalendar size={15} />

                        {new Date(record.borrowed_at).toLocaleDateString(
                          undefined,
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          record.copies_available > 0
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        {record.copies_available}{" "}
                        {record.copies_available === 1 ? "copy" : "copies"} left
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleReturn(record.id)}
                        disabled={returningId === record.id}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#E8E1EF] bg-white px-3 py-2 text-sm font-medium text-[#6D3FD3] transition hover:border-[#C4B5FD] hover:bg-[#EDE9FE] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {returningId === record.id ? (
                          <>
                            <FiRefreshCw size={14} className="animate-spin" />
                            Returning...
                          </>
                        ) : (
                          <>
                            <FiCheckCircle size={14} />
                            Return
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {message && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <FiCheckCircle size={17} />
          {message}
        </div>
      )}

      {error && !borrowFormActive && (
        <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </div>
      )}

      {borrowFormActive && (
        <Modal title="Borrow Book" onClose={closeBorrowModal}>
          <form type="submit" className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#4A4451]">
                Member
              </label>

              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full rounded-xl border border-[#E8E1EF] bg-white px-3 py-2.5 text-sm text-[#29252F] outline-none transition focus:border-[#C4B5FD] focus:ring-2 focus:ring-[#EDE9FE]"
              >
                <option value="">Select a member</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#4A4451]">
                Book
              </label>

              <select
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                className="w-full rounded-xl border border-[#E8E1EF] bg-white px-3 py-2.5 text-sm text-[#29252F] outline-none transition focus:border-[#C4B5FD] focus:ring-2 focus:ring-[#EDE9FE]"
              >
                <option value="">Select a book</option>
                {availableBooks.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} — {book.copies_available} available
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2.5 text-sm text-rose-600">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-[#E8E1EF] pt-4">
              <button
                type="button"
                onClick={closeBorrowModal}
                className="inline-flex items-center gap-2 rounded-xl border border-[#E8E1EF] px-4 py-2.5 text-sm font-medium text-[#6F6878] transition hover:bg-[#FAF9FC]"
              >
                <FiX size={16} />
                Cancel
              </button>

              <button
                onClick={handleBorrow}
                disabled={!selectedBookId || !selectedMemberId || loading}
                className="inline-flex items-center gap-2 rounded-xl bg-[#8B5CF6] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#7C4FE0] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <FiRefreshCw size={15} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FiBookOpen size={15} />
                    Borrow Book
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
