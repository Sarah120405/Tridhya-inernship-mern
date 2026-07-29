import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/blogPosts";
import CommentSection from "@/components/CommentSection";

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-4">{post.title}</h1>
      <p className="text-slate-600 leading-relaxed">{post.body}</p>
      <CommentSection postSlug={post.slug} />
    </article>
  );
}
