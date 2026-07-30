// app/documentation/react/[slug]/page.jsx
import DocSubPage from "@/components/DocSubPage";
import { getDocsNav } from "../../../../lib/docNav";

export async function generateStaticParams() {
  const nav = await getDocsNav();

  return nav.flatMap((entry) =>
    entry.subItems.map((item) => ({
      framework: entry.framework,
      slug: item.slug,
    })),
  );
}
export default async function ReactSubPage({ params }) {
  return <DocSubPage params={params} />;
}
