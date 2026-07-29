import Link from "next/link";
import { blogPosts } from "@/lib/blogPosts";

export default function BlogPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Blog</h1>
      <div className="flex flex-col gap-4">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-xl border border-slate-200 p-4 hover:shadow-md transition"
          >
            <h2 className="font-semibold text-slate-800">{post.title}</h2>
            <p className="text-sm text-slate-500 mt-1">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
