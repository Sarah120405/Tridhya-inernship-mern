import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MetricCard } from "../components/MetricCard";
import Modal from "../components/Modal";
import {
  FiBookOpen,
  FiEdit,
  FiTrash,
  FiUser,
  FiTrendingUp,
  FiAward,
  FiAlertCircle,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";
import {
  fetchAuthors,
  fetchMostBookBorrowedAuthors,
  fetchNoBookBorrowedAuthors,
  fetchProfilicAuthors,
} from "../store/slice/authorSlice";
import { Link } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";
import EntityForm from "../components/EntityForm";

export default function AuthorList() {
  const {
    authors,
    loading,
    error,
    profilicAuthors,
    noBookBorrowedAuthors,
    mostBookBorrowedAuthors,
  } = useSelector((state) => state.authorSlice);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAuthors());
    dispatch(fetchProfilicAuthors());
    dispatch(fetchMostBookBorrowedAuthors());
    dispatch(fetchNoBookBorrowedAuthors());
  }, [dispatch]);

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(authors, [
    "name",
  ]);
  const [modalOpen, setModalOpen] = useState(false);

  function handleAuthorSaved() {
    setModalOpen(false);
    dispatch(fetchAuthors());
  }

  if (loading) return <p>Loading authors...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="min-h-full bg-[#FAF9FC] p-2">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-7">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#9A93A3] mb-2">
            <span>Dashboard</span>
            <span>›</span>
            <span className="text-[#6F6878]">Authors</span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-[#29252F]">
            Author
          </h1>

          <p className="mt-1 text-sm text-[#6F6878]">
            Manage and organize all Authors in the library.
          </p>
        </div>

        <button
          onClick={() => {
            setModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6C5DD3] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#5949BE] hover:shadow-md"
        >
          <span className="text-lg leading-none">+</span>
          Add New Author
        </button>
      </header>

      {modalOpen && (
        <Modal title="Add Author" onClose={() => setModalOpen(false)}>
          <EntityForm
            entityType="author"
            onSuccess={handleAuthorSaved}
            onCancel={() => setModalOpen(false)}
          />
        </Modal>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-7">
        <MetricCard
          icon={<FiUser />}
          title="Total Authors"
          value={authors.length}
          description="All Authors in library"
          icon_2={<FiUser />}
        />

        <MetricCard
          icon={<FiBookOpen />}
          title="Profilic Authors"
          value={profilicAuthors.length}
          description=""
          icon_2={<FiBookOpen />}
        />

        <MetricCard
          icon={<FiBookOpen />}
          title="Most Borrowed Authors"
          value={mostBookBorrowedAuthors.length}
          description="Frequently borrowed books of authors"
          icon_2={<FiBookOpen />}
        />
      </div>
      <section className="overflow-hidden rounded-2xl border border-[#E8E1EF] bg-white shadow-[0_2px_8px_rgba(63,45,82,0.05)] mb-6">
        <div className="flex flex-col gap-3 border-b border-[#E8E1EF] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#29252F]">
              All Authors
            </h2>
            <p className="mt-1 text-xs text-[#9A93A3]">
              Browse and manage authors in your library.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search authors..."
              className="w-full sm:w-56 rounded-xl border border-[#E8E1EF] bg-[#FAF9FC] px-3 py-2 text-sm text-[#29252F] outline-none transition placeholder:text-[#AAA3B2] focus:border-[#8B7CE6] focus:bg-white focus:ring-3 focus:ring-[#8B5CF6]/10"
            />
          </div>
        </div>

        {!loading && (
          <div className="flex gap-5 overflow-x-auto p-2 scrollbar-none">
            {filteredItems.map((author) => (
              <div
                key={author.id}
                className="w-[85%] shrink-0 sm:w-[45%] lg:w-[30%] xl:w-[23%] rounded-2xl border border-[#E8E1EF] bg-white p-5 shadow-[0_2px_8px_rgba(63,45,82,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(63,45,82,0.10)]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#EDE9FE] to-[#F3E8FF] text-xl font-semibold text-[#6D3FD3]">
                    {author.name?.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-[#29252F]">
                      {author.name}
                    </h3>

                    <span className="mt-1 inline-flex rounded-full bg-[#EDE9FE] px-2.5 py-1 text-xs font-medium text-[#6D3FD3]">
                      {author.book_count}{" "}
                      {author.book_count === 1 ? "book" : "books"}
                    </span>
                  </div>
                </div>

                <p className="mt-5 line-clamp-3 min-h-[66px] text-sm leading-5 text-[#6F6878]">
                  {author.bio || "No biography available for this author."}
                </p>

                <div className="my-4 h-px bg-[#E8E1EF]" />

                <Link
                  to={`/author/${author.id}`}
                  className="mt-auto flex items-center justify-between rounded-xl bg-[#FAF9FC] px-4 py-2.5 text-sm font-medium text-[#6D3FD3] transition-all duration-200 hover:bg-[#EDE9FE]"
                >
                  <span>View Profile</span>

                  <FiArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-2 h-full">
        <section className="rounded-2xl border border-[#E8E1EF] bg-white p-5 shadow-[0_2px_8px_rgba(63,45,82,0.05)]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-[#29252F]">
                Most Borrowed Authors
              </h3>
              <p className="mt-1 text-xs text-[#9A93A3]">
                Authors whose books are borrowed most often.
              </p>
            </div>
            <div className="rounded-xl bg-[#FCEBED] p-2.5 text-[#DC6477]">
              <FiTrendingUp />
            </div>
          </div>
          {mostBookBorrowedAuthors.length === 0 ? (
            <div className="rounded-xl bg-[#E8F7F0] px-4 py-5 text-center">
              <p className="text-sm font-medium text-[#277E5B]">
                No borrow data yet
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {mostBookBorrowedAuthors.map((record) => (
                <div
                  key={record.author_name}
                  className="flex items-center justify-between gap-4 border-b border-[#F0EBF3] py-3 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#29252F]">
                      {record.author_name}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#FCEBED] px-2.5 py-1 text-xs font-medium text-[#DC6477]">
                    {record.borrow_count}{" "}
                    {record.borrow_count === 1 ? "borrow" : "borrows"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-[#E8E1EF] bg-white p-5 shadow-[0_2px_8px_rgba(63,45,82,0.05)]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-[#29252F]">
                No Borrowed Books
              </h3>
              <p className="mt-1 text-xs text-[#9A93A3]">
                Authors whose books have never been borrowed.
              </p>
            </div>
            <div className="rounded-xl bg-[#FFF3E0] p-2.5 text-[#E0900B]">
              <FiAlertCircle />
            </div>
          </div>
          {noBookBorrowedAuthors.length === 0 ? (
            <div className="rounded-xl bg-[#E8F7F0] px-4 py-5 text-center">
              <p className="text-sm font-medium text-[#277E5B]">
                Every author has been borrowed
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {noBookBorrowedAuthors.map((author) => (
                <div
                  key={author.id}
                  className="rounded-xl border border-[#F0EBF3] px-4 py-3"
                >
                  <p className="text-sm font-medium text-[#29252F]">
                    {author.name}
                  </p>
                  <p className="mt-0.5 text-xs text-[#9A93A3] line-clamp-1">
                    {author.bio}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
