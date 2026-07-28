// app/layout.js
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "DevDocs Hub",
  description: "A living reference for React, Next.js, TypeScript, and Redux",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
