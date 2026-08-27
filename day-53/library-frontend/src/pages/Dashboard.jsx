import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiBookOpen,
  FiUsers,
  FiAward,
  FiTrendingUp,
  FiClock,
  FiUser,
  FiHome,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MetricCard } from "../components/MetricCard";
import { fetchBooks, fetchOverdueBooks } from "../store/slice/bookSlice";
import { fetchAuthors, fetchProfilicAuthors } from "../store/slice/authorSlice";
import { fetchMembers, fetchActiveMembers } from "../store/slice/memberSlice";
import {
  fetchActiveBorrowRecords,
  fetchBorrowingTrends,
} from "../store/slice/borrowSlice";
import PageHeader from "../components/PageHeader";

export default function Dashboard() {
  const dispatch = useDispatch();

  const { items: books, overdueBooks } = useSelector(
    (state) => state.bookSlice,
  );
  const { authors, profilicAuthors } = useSelector(
    (state) => state.authorSlice,
  );
  const { members, activeMembers } = useSelector((state) => state.memberSlice);
  const { activeBorrowRecords, borrowingTrends } = useSelector(
    (state) => state.borrowSlice,
  );

  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchOverdueBooks());
    dispatch(fetchAuthors());
    dispatch(fetchProfilicAuthors());
    dispatch(fetchMembers());
    dispatch(fetchActiveMembers());
    dispatch(fetchActiveBorrowRecords());
    dispatch(fetchBorrowingTrends());
  }, [dispatch]);

  return (
    <div className="min-h-full bg-[#FAF9FC] p-2">
      <PageHeader
        breadcrumb={false}
        icon={<FiHome />}
        title="Dashboard"
        description="An overview of your library's activity."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-7">
        <MetricCard
          icon={<FiBookOpen />}
          title="Total Books"
          value={books.length}
          icon_2={<FiBookOpen />}
        />
        <MetricCard
          icon={<FiUsers />}
          title="Total Members"
          value={members.length}
          description={`${activeMembers.length} active`}
          icon_2={<FiUser />}
        />
        <MetricCard
          icon={<FiClock />}
          title="Active Borrows"
          value={activeBorrowRecords.length}
          icon_2={<FiClock />}
        />
        <MetricCard
          icon={<FiTrendingUp />}
          title="Overdue Books"
          value={overdueBooks.length}
          icon_2={<FiTrendingUp />}
        />
      </div>

      <section className="rounded-2xl border border-[#E8E1EF] bg-white p-6 shadow-[0_2px_8px_rgba(63,45,82,0.05)] mb-7">
        <h2 className="text-base font-semibold text-[#29252F] mb-4">
          Borrowing Trends
        </h2>
        {borrowingTrends.length === 0 ? (
          <p className="text-sm text-[#9A93A3] text-center py-8">
            No borrowing data yet.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={borrowingTrends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(v) => [`${v} borrows`, "Borrows"]} />
              <Line
                type="monotone"
                dataKey="total_borrows"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </section>

      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
        <section className="rounded-2xl h-full border border-[#E8E1EF] bg-white p-5 shadow-[0_2px_8px_rgba(63,45,82,0.05)]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-[#29252F]">
                Prolific Authors
              </h3>
              <p className="mt-1 text-xs text-[#9A93A3]">
                Authors with 2 or more published books.
              </p>
            </div>
            <div className="rounded-xl bg-[#EDE9FE] p-2.5 text-[#6C5DD3]">
              <FiAward />
            </div>
          </div>
          {profilicAuthors.length === 0 ? (
            <p className="rounded-xl bg-[#FAF7FF] px-4 py-6 text-center text-sm text-[#9A93A3]">
              No prolific authors yet.
            </p>
          ) : (
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto scrollbar-none">
              {profilicAuthors.map((author) => (
                <div
                  key={author.id}
                  className="flex items-center justify-between rounded-xl border border-violet-100 px-4 py-3"
                >
                  <span className="font-medium text-slate-800">
                    {author.name}
                  </span>
                  <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
                    {author.book_count}{" "}
                    {author.book_count === 1 ? "book" : "books"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl h-full border border-[#E8E1EF] bg-white p-5 shadow-[0_2px_8px_rgba(63,45,82,0.05)]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-[#29252F]">
                Overdue Books
              </h3>
              <p className="mt-1 text-xs text-[#9A93A3]">
                Books borrowed more than 14 days ago, not yet returned.
              </p>
            </div>
            <div className="rounded-xl bg-[#FCEBED] p-2.5 text-[#DC6477]">
              <FiClock />
            </div>
          </div>
          {overdueBooks.length === 0 ? (
            <div className="rounded-xl bg-[#E8F7F0] px-4 py-5 text-center">
              <p className="text-sm font-medium text-[#277E5B]">
                Nothing overdue right now
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto scrollbar-none">
              {overdueBooks.map((record) => (
                <div
                  key={`${record.title}-${record.member_name}`}
                  className="flex items-center justify-between text-sm border-b border-[#F0EBF3] pb-2"
                >
                  <span className="text-[#29252F]">
                    {record.title} — {record.member_name}
                  </span>
                  <span className="text-[#DC6477] font-medium">
                    {record.days_borrowed} days
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
