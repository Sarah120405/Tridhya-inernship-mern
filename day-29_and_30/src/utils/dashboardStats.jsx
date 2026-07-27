// Given an array of transactions, return:

import { useSelector } from "react-redux";

// { totalIncome, totalExpenses, netBalance, transactionCount }
export function getSummaryStats(transactions) {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, i) => acc + i.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, n) => acc + n.amount, 0);
  const netBalance = totalIncome - totalExpenses;
  const transactionCount = transactions.length;
  return { totalIncome, totalExpenses, netBalance, transactionCount };
}

// Given transactions, group expenses by category and sum amounts:
// [{ name: "Food", value: 4200 }, { name: "Transport", value: 1500 }, ...]
export function getCategoryBreakdown(transactions) {
  const expenses = transactions.filter((t) => t.type === "expense");
  const total = {};
  expenses.forEach((t) => {
    total[t.category] = (total[t.category] || 0) + t.amount;
  });

  return Object.entries(total).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));
}

// Given transactions, group by month and sum income/expenses separately:
// [{ month: "Jan", income: 5000, expenses: 3200 }, ...]
export function getMonthlyComparison(transactions) {
  const monthTotals = {};

  transactions.forEach((t) => {
    const month = new Date(t.date).toLocaleString("default", {
      month: "short",
    });

    if (!monthTotals[month]) {
      monthTotals[month] = { income: 0, expenses: 0 };
    }

    if (t.type === "income") {
      monthTotals[month].income += t.amount;
    } else {
      monthTotals[month].expenses += t.amount;
    }
  });

  return Object.entries(monthTotals).map(([month, totals]) => ({
    month,
    income: totals.income,
    expenses: totals.expenses,
  }));
}

export function getMonthOverMonthTrend(transactions) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const lastMonthDate = new Date(currentYear, currentMonth - 1);
  const lastMonth = lastMonthDate.getMonth();
  const lastMonthYear = lastMonthDate.getFullYear();

  function isInMonth(dateStr, month, year) {
    const d = new Date(dateStr);
    return d.getMonth() === month && d.getFullYear() === year;
  }

  const currentMonthTx = transactions.filter((t) =>
    isInMonth(t.date, currentMonth, currentYear),
  );
  const lastMonthTx = transactions.filter((t) =>
    isInMonth(t.date, lastMonth, lastMonthYear),
  );

  function sumByType(txList, type) {
    return txList
      .filter((t) => t.type === type)
      .reduce((acc, t) => acc + t.amount, 0);
  }

  function percentChange(current, previous) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  const currentIncome = sumByType(currentMonthTx, "income");
  const lastIncome = sumByType(lastMonthTx, "income");
  const currentExpenses = sumByType(currentMonthTx, "expense");
  const lastExpenses = sumByType(lastMonthTx, "expense");

  const currentBalance = currentIncome - currentExpenses;
  const lastBalance = lastIncome - lastExpenses;
  return {
    income: percentChange(currentIncome, lastIncome),
    expenses: percentChange(currentExpenses, lastExpenses),
    balance: percentChange(currentBalance, lastBalance),
    transactionCount: percentChange(currentMonthTx.length, lastMonthTx.length),
  };
}
export function getRecentTransactions(transactions, limit = 5) {
  const recentTransaction = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
  console.log(recentTransaction);

  return recentTransaction;
}

export function getTopCategories(transactions, limit = 5) {
  const breakdown = getCategoryBreakdown(transactions); // reuse what you already built
  const total = breakdown.reduce((sum, c) => sum + c.value, 0);

  return breakdown
    .sort((a, b) => b.value - a.value)
    .slice(0, limit)
    .map((c) => ({
      ...c,
      percentage: total > 0 ? Math.round((c.value / total) * 100) : 0,
    }));
}
