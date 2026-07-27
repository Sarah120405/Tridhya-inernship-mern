// import { getCurrentMonthTransactions } from "./dashboardStats";

export function getBudgetProgress(transactions, budgets) {
  const currentMonthExpenses = transactions.filter((t) => {
    const now = new Date();
    const d = new Date(t.date);
    return (
      t.type === "expense" &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });

  return budgets.map((budget) => {
    const spent = currentMonthExpenses
      .filter((t) => t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);

    const percentUsed =
      budget.monthlyLimit > 0
        ? Math.round((spent / budget.monthlyLimit) * 100)
        : 0;
    const remaining = budget.monthlyLimit - spent;
    const isOverBudget = spent > budget.monthlyLimit;

    return {
      ...budget,
      spent,
      remaining,
      percentUsed,
      isOverBudget,
    };
  });
}

export function getDailySpendingTrend(transactions) {
  const now = new Date();
  const currentMonthExpenses = transactions.filter((t) => {
    const d = new Date(t.date);
    return (
      t.type === "expense" &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });

  const sorted = [...currentMonthExpenses].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  let runningTotal = 0;
  return sorted.map((t) => {
    runningTotal += t.amount;
    return {
      date: new Date(t.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      cumulativeSpend: runningTotal,
    };
  });
}

export function getBudgetSummary(budgetProgress) {
  const totalBudget = budgetProgress.reduce(
    (sum, b) => sum + b.monthlyLimit,
    0,
  );
  const totalSpent = budgetProgress.reduce((sum, b) => sum + b.spent, 0);
  const remaining = totalBudget - totalSpent;
  const overBudgetCategories = budgetProgress.filter((b) => b.isOverBudget);

  return {
    totalBudget,
    totalSpent,
    remaining,
    overBudgetCount: overBudgetCategories.length,
    overBudgetCategories: overBudgetCategories.map((b) => b.category),
  };
}

export function getCategoryInsights(transactions, budgetProgress) {
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

  function spentInMonth(category, month, year) {
    return transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          t.category === category &&
          isInMonth(t.date, month, year),
      )
      .reduce((sum, t) => sum + t.amount, 0);
  }

  const insights = [];

  budgetProgress.forEach((b) => {
    if (b.isOverBudget) {
      insights.push({
        type: "warning",
        message: `${b.category} exceeded budget`,
      });
      return;
    }

    const currentSpend = spentInMonth(b.category, currentMonth, currentYear);
    const lastSpend = spentInMonth(b.category, lastMonth, lastMonthYear);

    if (lastSpend > 0) {
      const percentChange = Math.round(
        ((currentSpend - lastSpend) / lastSpend) * 100,
      );
      if (percentChange <= -5) {
        insights.push({
          type: "positive",
          message: `${b.category} spending decreased ${Math.abs(percentChange)}%`,
        });
      } else if (percentChange >= 5) {
        insights.push({
          type: "warning",
          message: `${b.category} spending increased ${percentChange}%`,
        });
      } else {
        insights.push({
          type: "positive",
          message: `${b.category} stayed within budget`,
        });
      }
    } else {
      insights.push({
        type: "positive",
        message: `${b.category} stayed within budget`,
      });
    }
  });

  return insights;
}
