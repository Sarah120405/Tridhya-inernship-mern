import { PAYMENT_METHOD_LABELS } from "../utils/constants";

export function getTopExpenses(transactions, limit = 5) {
  return [...transactions]
    .filter((t) => t.type === "expense")
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}

export function getPaymentMethodBreakdown(transactions) {
  const expenses = transactions.filter((t) => t.type === "expense");

  const totals = {};
  expenses.forEach((t) => {
    totals[t.paymentMethod] = (totals[t.paymentMethod] || 0) + t.amount;
  });

  return Object.entries(totals).map(([method, amount]) => ({
    name: PAYMENT_METHOD_LABELS[method] || method,
    value: amount,
  }));
}
