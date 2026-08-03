// app/admin/page.jsx
import { getAllCommentsAcrossPosts } from "@/lib/commentsDb";

export default function AdminPage() {
  const comments = getAllCommentsAcrossPosts();
  console.log("Admin page sees comments:", comments);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Comment Moderation</h1>
      <div className="flex flex-col gap-3">
        {comments.map((c) => (
          <div key={c.id} className="border rounded-lg p-3 text-sm">
            <p className="font-medium">{c.author}</p>
            <p className="text-slate-600">{c.text}</p>
            <p className="text-xs text-slate-400 mt-1">Post: {c.postSlug}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
