// app/docs/[framework]/[slug]/page.js
import { getDocContent } from "../lib/docContent";
import { getDocsNav } from "../lib/docNav";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import { extractMarkdownHeadings } from "@/lib/markdownUtils";
import DocToc from "./DocToc";
import FeedbackWidget from "./FeedbackWidget";

export default async function DocSubPage({ params }) {
  const { framework, slug } = await params;

  const nav = await getDocsNav();
  const frameworkNav = nav.find((n) => n.framework === framework);
  const matchingItem = frameworkNav?.subItems.find(
    (item) => item.slug === slug,
  );

  if (!matchingItem) notFound();

  const content = await getDocContent(framework, matchingItem.path);
  if (!content) notFound();
  const headings = extractMarkdownHeadings(content.body);
  return (
    <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3">
        <div className="text-sm text-slate-500 mb-4">
          <Link href="/documentation" className="hover:text-indigo-600">
            Documentation
          </Link>
          <span className="mx-2">/</span>
          <span className="capitalize">{framework}</span>
          <span className="mx-2">/</span>
          <span className="text-slate-700">{content.title}</span>
        </div>
        <article className="prose prose-slate max-w-none ">
          <h1 className="capitalize">{content.title}</h1>
          <div className="max-h-[400px] overflow-y-auto">
            <ReactMarkdown rehypePlugins={[rehypeHighlight, rehypeSlug]}>
              {content.body}
            </ReactMarkdown>
          </div>
        </article>
        <FeedbackWidget framework={framework} slug={slug} />
      </div>
      <aside className="lg:col-span-1">
        <DocToc headings={headings} />
      </aside>
    </div>
  );
}
