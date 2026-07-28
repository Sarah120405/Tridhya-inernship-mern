// app/documentation/layout.js
import Sidebar from "@/components/Sidebar";

export default function DocumentationLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 px-8 py-6">{children}</div>
    </div>
  );
}
