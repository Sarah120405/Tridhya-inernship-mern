import {
  FiShoppingBag,
  FiHome,
  FiZap,
  FiFilm,
  FiDollarSign,
  FiHeart,
  FiBookOpen,
  FiMoreHorizontal,
  FiCoffee,
} from "react-icons/fi";

export const CATEGORY_ICONS = {
  Food: <FiCoffee />,
  Transport: <FiZap />, // or a car-style icon if you prefer — react-icons/fi has no car icon; consider react-icons/fa's FaCar if you want one, but that reintroduces a second icon set (the ShopEase lesson)
  Rent: <FiHome />,
  Utilities: <FiZap />,
  Entertainment: <FiFilm />,
  Salary: <FiDollarSign />,
  Shopping: <FiShoppingBag />,
  Health: <FiHeart />,
  Education: <FiBookOpen />,
  Other: <FiMoreHorizontal />,
};

export const CATEGORIES = [
  "Food",
  "Transport",
  "Rent",
  "Utilities",
  "Entertainment",
  "Salary",
  "Shopping",
  "Health",
  "Other",
];

export const CATEGORY_PILL_COLORS = {
  Food: "bg-orange-100 text-orange-700",
  Transport: "bg-emerald-100 text-emerald-700",
  Rent: "bg-blue-100 text-blue-700",
  Utilities: "bg-sky-100 text-sky-700",
  Entertainment: "bg-pink-100 text-pink-700",
  Salary: "bg-emerald-100 text-emerald-700",
  Shopping: "bg-purple-100 text-purple-700",
  Health: "bg-rose-100 text-rose-700",
  Other: "bg-slate-100 text-slate-700",
};

export const CATEGORY_BAR_COLORS = {
  Food: "bg-orange-500",
  Transport: "bg-emerald-500",
  Rent: "bg-blue-500",
  Utilities: "bg-purple-500",
  Entertainment: "bg-pink-500",
  Shopping: "bg-cyan-500",
  Health: "bg-rose-500",
  Other: "bg-slate-500",
};

export const PAYMENT_METHOD_LABELS = {
  upi: "UPI",
  creditCard: "Credit Card",
  cash: "Cash",
  debitCard: "Debit Card",
};
