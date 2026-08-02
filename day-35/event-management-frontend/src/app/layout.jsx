// app/layout.js
import { AuthProvider } from "./context/AuthContext";
import "./globals.css"; // or whatever your global stylesheet is named

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
