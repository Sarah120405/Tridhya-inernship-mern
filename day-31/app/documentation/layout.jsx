// app/documentation/layout.js
import Sidebar from "@/components/Sidebar";
import { getDocsNav } from "../../lib/docNav";

export default async function DocumentationLayout({ children }) {
  const nav = await getDocsNav();

  return (
    <div className="flex">
      <Sidebar nav={nav} />
      <div className="flex-1 px-8 py-6">{children}</div>
    </div>
  );
}
