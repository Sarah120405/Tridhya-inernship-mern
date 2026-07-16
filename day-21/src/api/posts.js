// api/posts.js
const API_BASE = "https://dev.to/api/";

export async function getAllArticles() {
  const res = await fetch(`${API_BASE}/articles?per_page=4`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

/* export async function getPostById(id) {
  const res = await fetch(`${API_BASE}/posts/${id}`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

export async function getCommentsForPost(id) {
  const res = await fetch(`${API_BASE}/posts/${id}/comments`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}
 */
