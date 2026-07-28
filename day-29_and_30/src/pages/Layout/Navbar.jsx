import { FiMenu, FiPlus } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { addTransaction } from "../../store/slice/transactionSlice";
import { setBudget } from "../../store/slice/budgetSlice";
import Modal from "../../components/Modal";
import TransactionForm from "../../components/TransactionForm";

import { useState } from "react";
import BudgetForm from "../../components/BudgetForm";

const dummyTransactions = [
  {
    type: "income",
    amount: 80000,
    category: "Salary",
    date: "2026-06-01T00:00:00.000Z",
    paidTo: "Employer",
    note: "",
    paymentMethod: "bankTransfer",
  },
  {
    type: "expense",
    amount: 1200,
    category: "Transport",
    date: "2026-06-03T00:00:00.000Z",
    paidTo: "Uber",
    note: "",
    paymentMethod: "upi",
  },
  {
    type: "expense",
    amount: 3500,
    category: "Shopping",
    date: "2026-06-05T00:00:00.000Z",
    paidTo: "Zara",
    note: "",
    paymentMethod: "creditCard",
  },
  {
    type: "expense",
    amount: 2200,
    category: "Food",
    date: "2026-06-08T00:00:00.000Z",
    paidTo: "Zomato",
    note: "Lunch",
    paymentMethod: "upi",
  },
  {
    type: "expense",
    amount: 1800,
    category: "Utilities",
    date: "2026-06-10T00:00:00.000Z",
    paidTo: "BESCOM",
    note: "Electricity bill",
    paymentMethod: "upi",
  },
  {
    type: "expense",
    amount: 499,
    category: "Entertainment",
    date: "2026-06-12T00:00:00.000Z",
    paidTo: "Netflix",
    note: "Monthly subscription",
    paymentMethod: "creditCard",
  },
  {
    type: "income",
    amount: 15000,
    category: "Salary",
    date: "2026-06-19T00:00:00.000Z",
    paidTo: "Freelance Project",
    note: "Project payment",
    paymentMethod: "bankTransfer",
  },
  {
    type: "expense",
    amount: 4500,
    category: "Food",
    date: "2026-06-20T00:00:00.000Z",
    paidTo: "DMart",
    note: "Groceries",
    paymentMethod: "upi",
  },

  {
    type: "income",
    amount: 80000,
    category: "Salary",
    date: "2026-07-01T00:00:00.000Z",
    paidTo: "Employer",
    note: "",
    paymentMethod: "bankTransfer",
  },
  {
    type: "expense",
    amount: 1200,
    category: "Transport",
    date: "2026-07-04T00:00:00.000Z",
    paidTo: "Indian Oil",
    note: "Fuel",
    paymentMethod: "debitCard",
  },
  {
    type: "expense",
    amount: 2350,
    category: "Food",
    date: "2026-07-06T00:00:00.000Z",
    paidTo: "DMart",
    note: "Groceries",
    paymentMethod: "upi",
  },
  {
    type: "expense",
    amount: 1900,
    category: "Utilities",
    date: "2026-07-09T00:00:00.000Z",
    paidTo: "BESCOM",
    note: "Electricity bill",
    paymentMethod: "upi",
  },
  {
    type: "expense",
    amount: 3450,
    category: "Shopping",
    date: "2026-07-11T00:00:00.000Z",
    paidTo: "Zara",
    note: "Clothing",
    paymentMethod: "creditCard",
  },
  {
    type: "expense",
    amount: 499,
    category: "Entertainment",
    date: "2026-07-14T00:00:00.000Z",
    paidTo: "Netflix",
    note: "Monthly subscription",
    paymentMethod: "creditCard",
  },
  {
    type: "expense",
    amount: 1250,
    category: "Food",
    date: "2026-07-15T00:00:00.000Z",
    paidTo: "Cafe Delhi Heights",
    note: "Dinner with friends",
    paymentMethod: "upi",
  },
  {
    type: "income",
    amount: 20000,
    category: "Salary",
    date: "2026-07-19T00:00:00.000Z",
    paidTo: "Freelance Project",
    note: "Project payment",
    paymentMethod: "bankTransfer",
  },
];
const dummyBudgets = [
  { category: "Food", monthlyLimit: 7000, alertThreshold: 80 },
  { category: "Transport", monthlyLimit: 3000, alertThreshold: 80 },
  { category: "Shopping", monthlyLimit: 5000, alertThreshold: 80 },
  { category: "Utilities", monthlyLimit: 2500, alertThreshold: 90 },
  { category: "Entertainment", monthlyLimit: 800, alertThreshold: 90 },
  { category: "Utilities", monthlyLimit: 1500, alertThreshold: 80 },
  { category: "Shopping", monthlyLimit: 3200, alertThreshold: 80 },
];

function Navbar({ openSidebar, setOpenSidebar }) {
  const dispatch = useDispatch();
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  function handleSeed() {
    dummyTransactions.forEach((t) => dispatch(addTransaction(t)));
    dummyBudgets.forEach((b) => dispatch(setBudget(b)));
  }
  const location = useLocation();
  const isDashboard = location.pathname === "/";
  const isTransaction = location.pathname === "/transactions";

  return (
    <header className="flex items-center justify-between px-6 py-1 bg-white border-b border-slate-200">
      <div className="flex gap-2">
        <button
          className="lg:hidden text-slate-600"
          onClick={() => setOpenSidebar(!openSidebar)}
        >
          <FiMenu size={22} />
        </button>
        {isDashboard ? (
          <div className="flex flex-col items-start">
            <h1 className="text-2xl font-bold text-slate-900">Welcome Sarah</h1>
            <p className="text-xs text-slate-500">
              Here's what's happening with your finances today
            </p>
          </div>
        ) : isTransaction ? (
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Transactions
              </h1>
              <p className="text-xs text-slate-500">
                View and manage all your income and expenses.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Budgets</h1>
              <p className="text-xs text-slate-500">
                Plan, track and manage your monthly budgets.
              </p>
            </div>
          </div>
        )}
      </div>
      {isDashboard ? (
        import.meta.env.DEV && (
          <button
            onClick={handleSeed}
            className="rounded-xl bg-emerald-600 px-3 py-2 text-slate-50 text-sm font-medium shadow-sm transition hover:bg-emerald-700"
          >
            Seed Dummy Data
          </button>
        )
      ) : isTransaction ? (
        <button
          onClick={() => setShowTransactionForm((prev) => !prev)}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-white text-sm font-medium shadow-sm transition hover:bg-emerald-700"
        >
          <FiPlus /> Add Transaction
        </button>
      ) : (
        <button
          onClick={() => setShowBudgetForm((prev) => !prev)}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-white text-sm font-medium shadow-sm transition hover:bg-emerald-700"
        >
          <FiPlus /> New Budget
        </button>
      )}

      {showTransactionForm && (
        <Modal
          title="Add Transaction"
          onClose={() => setShowTransactionForm(false)}
        >
          <TransactionForm onSuccess={() => setShowTransactionForm(false)} />
        </Modal>
      )}
      {showBudgetForm && (
        <Modal title="Create Budget" onClose={() => setShowBudgetForm(false)}>
          <BudgetForm onSuccess={() => setShowBudgetForm(false)} />
        </Modal>
      )}
    </header>
  );
}

export { Navbar };
