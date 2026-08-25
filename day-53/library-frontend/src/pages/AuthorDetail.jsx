import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthorById } from "../store/slice/authorSlice";

export default function AuthorDetail() {
  const { id } = useParams(); // React Router's way of reading a URL param, equivalent to Next.js's params
  const dispatch = useDispatch();
  const { authorById, loading, error } = useSelector(
    (state) => state.authorSlice,
  );

  console.log(authorById);

  useEffect(() => {
    dispatch(fetchAuthorById(id));
  }, [dispatch, id]);

  if (loading) return <p>Loading authors...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="min-h-full bg-[#FAF9FC] p-2">
      <div className="flex items-center gap-2 text-xs text-[#9A93A3] mb-4">
        <Link to="/author" className="hover:text-[#6C5DD3]">
          Authors
        </Link>
        <span>›</span>
        <span className="text-[#6F6878]">{authorById.name}</span>
      </div>

      <section className="rounded-2xl border border-[#E8E1EF] bg-white p-6 shadow-[0_2px_8px_rgba(63,45,82,0.05)] mb-6">
        <div className="flex items-start gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-[#EDE9FE] text-xl font-semibold text-[#6C5DD3]">
            {authorById.name?.charAt(0)}
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold text-[#29252F]">
              {authorById.name}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[#6F6878]">
              {authorById.bio}
            </p>

            <div className="flex items-center gap-5 mt-3">
              <span className="rounded-full bg-[#EDE9FE] px-3 py-1 text-xs font-medium text-[#6C5DD3]">
                {authorById.Books?.length ?? 0}{" "}
                {authorById.Books?.length === 1 ? "book" : "books"}
              </span>
              <span className="rounded-full bg-[#FCEBED] px-3 py-1 text-xs font-medium text-[#DC6477]">
                {authorById.Books?.reduce(
                  (sum, b) => sum + Number(b.borrow_count ?? 0),
                  0,
                )}{" "}
                total borrows
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#E8E1EF] bg-white p-6 shadow-[0_2px_8px_rgba(63,45,82,0.05)]">
        <h2 className="text-base font-semibold text-[#29252F] mb-4">
          Books by {authorById.name}
        </h2>

        {authorById.Books?.length === 0 ? (
          <p className="rounded-xl bg-[#FAF7FF] px-4 py-6 text-center text-sm text-[#9A93A3]">
            No books published yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {authorById.Books?.map((book) => (
              <div
                key={book.id}
                className="flex items-center justify-between rounded-xl border border-[#F0EBF3] px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-[#29252F]">
                    {book.title}
                  </p>
                  <p className="mt-0.5 text-xs text-[#9A93A3]">
                    {book.genre} · {book.published_year}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-[#9A93A3]">
                    {book.copies_available} copies
                  </span>
                  <span className="rounded-full bg-[#FCEBED] px-2.5 py-1 font-medium text-[#DC6477]">
                    {book.borrow_count} borrowed
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
