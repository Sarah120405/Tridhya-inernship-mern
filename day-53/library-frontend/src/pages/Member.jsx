import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchActiveMembers, fetchMembers } from "../store/slice/memberSlice";
import {
  FiArrowRight,
  FiBookOpen,
  FiEdit,
  FiPlus,
  FiSearch,
  FiUser,
  FiUserCheck,
  FiUsers,
  FiUserX,
  FiX,
} from "react-icons/fi";
import { useSearch } from "../hooks/useSearch";
import { MetricCard } from "../components/MetricCard";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import EntityForm from "../components/EntityForm";
import PageHeader from "../components/PageHeader";
export default function MemberList() {
  const { members, loading, error, activeMembers } = useSelector(
    (state) => state.memberSlice,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchMembers());
    dispatch(fetchActiveMembers());
  }, [dispatch]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  function handleMemberSaved() {
    setModalOpen(false);
    setEditing(null);
    dispatch(fetchMembers());
  }

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(members, [
    "name",
    "email",
  ]);

  return (
    <div className="min-h-full bg-[#FAF9FC] p-2">
      <PageHeader
        icon={<FiUsers />}
        title="Members"
        description=" Manage library members and monitor their borrowing activity."
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8B5CF6] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#7C4FE0] hover:shadow-md"
          >
            <FiPlus size={17} />
            Add New Member
          </button>
        }
      />
      {modalOpen && (
        <Modal
          title={editing ? "Edit Member" : "Add Member"}
          onClose={() => setModalOpen(false)}
        >
          <EntityForm
            entityType="member"
            existingEntity={editing || null}
            onSuccess={handleMemberSaved}
            onCancel={() => setModalOpen(false)}
          />
        </Modal>
      )}
      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          icon={<FiUser />}
          title="Total Members"
          value={members.length}
          icon_2={<FiUser />}
        />
        <MetricCard
          icon={<FiUserCheck />}
          title="Active Members"
          value={activeMembers.length}
          icon_2={<FiUserCheck />}
        />
        <MetricCard
          icon={<FiUserX />}
          title="Inactive Members"
          value={members.length - activeMembers.length}
          icon_2={<FiUserX />}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E8E1EF] bg-white shadow-[0_2px_8px_rgba(63,45,82,0.04)]">
        <div className="flex flex-col gap-4 border-b border-[#E8E1EF] p-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-[#29252F]">Member Directory</h2>

            <p className="mt-1 text-xs text-[#8A8291]">
              View members and their current borrowing activity.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <FiSearch
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B94A3]"
            />

            <input
              type="text"
              placeholder="Search member using name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-[#E8E1EF] bg-[#FAF9FC] py-2.5 pl-10 pr-4 text-sm text-[#29252F] outline-none transition placeholder:text-[#A7A0AD] focus:border-[#C4B5FD] focus:bg-white focus:ring-2 focus:ring-[#EDE9FE]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B94A3] transition hover:text-[#5F5868]"
                aria-label="Clear search"
              >
                <FiX size={15} />
              </button>
            )}
          </div>
        </div>

        {!loading && (
          <div className="divide-y divide-[#EEE8F1] max-h-[400px] overflow-y-auto scrollbar-none">
            {filteredItems.map((member) => (
              <div
                key={member.id}
                className="flex flex-row items-center gap-5 px-5 py-3 transition hover:bg-[#FCFAFF]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-lg font-semibold text-[#8B5CF6]">
                  {member.name?.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[#29252F] truncate">
                      {member.name}
                    </h3>
                    <span
                      className={`hidden rounded-full px-2 py-0.5 text-[10px] font-medium sm:inline-flex ${
                        activeMembers.some((active) => active.id === member.id)
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {activeMembers.some((active) => active.id === member.id)
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#8A8291]">{member.email}</p>
                </div>

                {/* Join date */}
                <div className="hidden min-w-[130px] sm:block">
                  <p className="text-[11px] uppercase tracking-wide text-[#9B94A3]">
                    Member since
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#4A4451]">
                    {new Date(member.join_date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-[#FAF7FF] px-3 py-2 sm:min-w-[125px]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EDE9FE] text-[#8B5CF6]">
                    <FiBookOpen size={15} />
                  </div>
                  <div className="">
                    <p className="text-xs text-[#8A8291]">Books borrowed</p>
                    <p className="font-semibold text-[#8B5CF6]">
                      {member.borrow_count}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <button
                    onClick={() => {
                      setEditing(member);
                      setModalOpen(true);
                    }}
                    className="flex gap-2 items-center text-sm font-medium text-[#8B5CF6] hover:text-[#6D3FD3]"
                  >
                    Edit
                    <FiEdit
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </button>
                  <Link
                    to={`/members/${member.id}`}
                    className="flex gap-2 items-center text-sm font-medium text-[#8B5CF6] hover:text-[#6D3FD3]"
                  >
                    View
                    <FiArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        {loading && (
          <div className="divide-y divide-[#EEE8F1]">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center gap-5 px-5 py-5 sm:px-6"
              >
                <div className="h-12 w-12 animate-pulse rounded-full bg-[#F0ECF5]" />

                <div className="flex-1">
                  <div className="mb-2 h-4 w-32 animate-pulse rounded bg-[#F0ECF5]" />
                  <div className="h-3 w-48 animate-pulse rounded bg-[#F5F2F8]" />
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <FiUserX size={20} />
            </div>

            <h3 className="font-semibold text-[#29252F]">
              Unable to load members
            </h3>

            <p className="mt-1 max-w-sm text-sm text-[#8A8291]">{error}</p>

            <button
              onClick={() => {
                dispatch(fetchMembers());
                dispatch(fetchActiveMembers());
              }}
              className="mt-4 rounded-lg border border-[#E8E1EF] px-4 py-2 text-sm font-medium text-[#6D3FD3] transition hover:bg-[#FAF7FF]"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
