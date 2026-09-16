import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "./components/ReduxProvider";

export const metadata: Metadata = {
  title: "SupportHub | AI-Powered Customer Support",
  description: "AI-powered customer support and ticket management platform.",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
