"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
export default function CommentSection({ postSlug }) {
  const router = useRouter();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    fetch(`/api/comments?postSlug=${postSlug}`)
      .then((res) => res.json())
      .then(setComments);
  }, [postSlug]);

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postSlug, author, text }),
    });
    const newComment = await res.json();
    setComments((prev) => [...prev, newComment]);
    setText("");
  }

  return (
    <div className="mt-8 border-t border-slate-100 pt-6">
      <button
        onClick={() => router.back()}
        className="text-sm text-slate-500 hover:text-indigo-600 mb-4 inline-flex items-center gap-1"
      >
        ← Back
      </button>
      <h3 className="font-semibold text-slate-800 mb-3">Comments</h3>
      {comments.map((c) => (
        <div key={c.id} className="mb-2 text-sm">
          <strong>{c.author}:</strong> {c.text}
        </div>
      ))}
      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Name"
          className="border rounded px-2 py-1 text-sm"
        />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Comment"
          className="border rounded px-2 py-1 text-sm flex-1"
        />
        <button
          type="submit"
          className="bg-slate-800 text-white px-3 py-1 rounded text-sm"
        >
          Post
        </button>
      </form>
    </div>
  );
}
