import type { Metadata } from "next";
import "./globals.css";
import { Provider } from "react-redux";
import store from "./store/store";

export const metadata: Metadata = {
  title: "SupportHub | AI-Powered Customer Support",
  description: "AI-powered customer support and ticket management platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider store={store}>
        <body className="antialiased">{children}</body>
      </Provider>
    </html>
  );
}
