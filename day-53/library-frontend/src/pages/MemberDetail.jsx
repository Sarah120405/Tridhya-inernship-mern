import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMemberById,
  fetchMembersBorrowSummary,
} from "../store/slice/memberSlice";
import {
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiMail,
} from "react-icons/fi";

export default function MemberDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { memberById, loading, error, membersBorrowSummary } = useSelector(
    (state) => state.memberSlice,
  );

  useEffect(() => {
    dispatch(fetchMemberById(id));
    dispatch(fetchMembersBorrowSummary(id));
  }, [dispatch, id]);

  const borrowRecords = memberById.BorrowedRecords || [];

  if (loading) return <p>Loading authors...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="min-h-full bg-[#FAF9FC] p-2">
      <div className="flex items-center gap-2 text-xs text-[#9A93A3] mb-4">
        <Link to="/members" className="hover:text-[#6C5DD3]">
          Members
        </Link>
        <span>›</span>
        <span className="text-[#6F6878]">{memberById.name}</span>
      </div>

      <section className="rounded-2xl border border-[#E8E1EF] bg-white p-6 shadow-[0_2px_8px_rgba(63,45,82,0.05)] mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-[#EDE9FE] text-xl font-semibold text-[#6C5DD3]">
              {memberById.name?.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-[#29252F]">
                  {memberById.name}
                </h1>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-600">
                  Member
                </span>
              </div>

              <div className="mt-3 flex flex-col gap-2 text-sm text-[#6F6878] sm:flex-row sm:gap-5">
                <span className="flex items-center gap-2">
                  <FiMail size={15} className="text-[#9B94A3]" />
                  {memberById.email}
                </span>

                <span className="flex items-center gap-2">
                  <FiCalendar size={15} className="text-[#9B94A3]" />
                  Member since{" "}
                  {new Date(memberById.join_date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start justify-end gap-2 sm:items-end">
            <div className="flex items-center gap-2 rounded-xl bg-[#FAF7FF] px-3 py-2">
              <FiBookOpen size={15} className="text-[#8B5CF6]" />

              <span className="text-sm font-medium text-[#6D3FD3]">
                {membersBorrowSummary.total_borrows}{" "}
                {membersBorrowSummary.total_borrows === 1 ? "book" : "books"}{" "}
                borrowed
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-[#FCEBED] px-3 py-2">
              <FiClock size={15} className="text-[#DC6477]" />

              <span className="text-sm font-medium text-[#C65367]">
                {membersBorrowSummary.active_borrows} currently borrowed
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="overflow-hidden rounded-2xl border border-[#E8E1EF] bg-white shadow-[0_2px_8px_rgba(63,45,82,0.04)]">
        <div className="border-b border-[#E8E1EF] p-5">
          <h2 className="font-semibold text-[#29252F]">Borrowing History</h2>
          <p className="mt-1 text-sm text-[#8A8291]">
            Books borrowed by {memberById.name}.
          </p>
        </div>
        <div className="divide-y divide-[#EEE8F1]">
          {borrowRecords.map((record) => (
            <div
              key={record.id}
              className="group flex flex-col gap-4 p-5 transition hover:bg-[#FCFAFF] sm:flex-row sm:items-center"
            >
              <div className=" flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F3EEFF] text-[#8B5CF6]">
                <FiBookOpen size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-[#8A8291]">
                  {record.Book?.title}
                </h3>
                <p className="mt-1 text-sm text-[#8A8291]">
                  {record.Book?.genre}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-5 text-sm sm:flex sm:items-center">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-[#A29AA9]">
                    Borrowed
                  </p>

                  <p className="mt-1 font-medium text-[#4A4451]">
                    {new Date(record.borrowed_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-[#A29AA9]">
                    Returned
                  </p>

                  <p className="mt-1 font-medium text-[#4A4451]">
                    {record.return_date
                      ? new Date(record.return_date).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )
                      : "—"}
                  </p>
                </div>
                <div className="sm:w-28 sm:text-right">
                  {record.returned ? (
                    <span className=" inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600">
                      <FiCheckCircle size={13} />
                      Returned
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FCEBED] px-3 py-1.5 text-xs font-medium text-[#DC6477] ">
                      <FiClock size={13} />
                      Borrowed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
