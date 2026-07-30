import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/blogPosts";
import CommentSection from "@/components/CommentSection";

export const dynamic = "force-dynamic"; // Give behavior of cache: "no-store"

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) notFound();

  const generatedAt = new Date().toLocaleString();

  return (
    <article className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">{post.title}</h1>
        <p className="text-xs text-slate-400 mt-4">
          Page generated at: {generatedAt}
        </p>
      </div>
      <p className="text-slate-600 leading-relaxed">{post.body}</p>
      <CommentSection postSlug={post.slug} />
    </article>
  );
}
