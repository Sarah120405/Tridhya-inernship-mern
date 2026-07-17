import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  extractHeadings,
  getArticleById,
  getRelatedArticles,
} from "../api/posts";
import {
  FiArrowLeft,
  FiBookmark,
  FiClock,
  FiHeart,
  FiMessageCircle,
} from "react-icons/fi";
import { InfoRow } from "../components/InfoRow";
import { useBookmarks } from "../hooks/bookMarkHook";

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [tocItems, setTocItems] = useState([]);
  const [htmlWithIds, setHtmlWithIds] = useState("");
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const naviagate = useNavigate();

  useEffect(() => {
    async function loadArticle() {
      setLoading(true);
      setError(null);
      try {
        const data = await getArticleById(id);
        console.log(data);

        setArticle(data);

        const { tocItems, htmlWithIds } = extractHeadings(data.body_html);
        setTocItems(tocItems);
        setHtmlWithIds(htmlWithIds);

        const relatedArticles = await getRelatedArticles(data.tags[0], data.id);
        setRelated(relatedArticles);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [id]);

  function scrollToHeading(headingId) {
    document.getElementById(headingId)?.scrollIntoView({ behavior: "smooth" });
  }

  function formatDate(isoString) {
    if (!isoString) return null;
    return new Date(isoString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  if (loading)
    return <p className="text-center py-20 text-slate-500">Loading...</p>;
  if (error)
    return <p className="text-center py-20 text-red-500">Error: {error}</p>;
  if (!article) return null;

  return (
    <div className="max-w-6xl mx-auto min-w-0">
      <button
        onClick={() => naviagate(-1)}
        className="text-indigo-600 text-xs font-medium p-2 hover:bg-indigo-100 items-center flex flex-row gap-2"
      >
        <FiArrowLeft />
        <p> Back</p>
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Main content */}
        <div className="lg:col-span-2 min-w-0">
          <div className="flex gap-2 mb-3">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-start justify-between">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {article.title}
            </h1>
            <button
              onClick={() => toggleBookmark(article)}
              className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 text-sm shrink-0 transition ${
                isBookmarked(article.id)
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <FiBookmark /> Bookmark
            </button>
          </div>
          {article.cover_image && (
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-64 object-cover rounded-2xl mb-6"
            />
          )}

          <p className="text-slate-500 mb-4">{article.description}</p>

          <div className="flex items-center gap-4 text-sm text-slate-500 border-b border-slate-100 pb-4 mt-6">
            <img
              src={article.user.profile_image_90}
              alt={article.user.name}
              className="w-9 h-9 rounded-full"
            />
            <div>
              <p className="font-medium text-slate-800">{article.user.name}</p>
              <p className="text-xs">{article.readable_publish_date}</p>
            </div>
            <span className="flex items-center gap-1 ml-auto">
              <FiClock /> {article.reading_time_minutes} min read
            </span>
            <span className="flex items-center gap-1">
              <FiHeart /> {article.public_reactions_count}
            </span>
            <span className="flex items-center gap-1">
              <FiMessageCircle /> {article.comments_count}
            </span>
          </div>

          <div
            className="prose max-w-none text-left prose-headings:scroll-mt-24 prose-headings:text-left prose-pre:overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: htmlWithIds }}
          />
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
          {
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <h3 className="font-semibold text-slate-800 mb-3">
                Article Info
              </h3>
              <div className="flex flex-col gap-2.5 text-sm">
                <InfoRow label="Type" value={article.type_of} />
                <InfoRow label="ID" value={article.id} />
                <InfoRow
                  label="Last Updated"
                  value={formatDate(article.edited_at)}
                />
                <InfoRow
                  label="Reading Time"
                  value={`${article.reading_time_minutes} min`}
                />
                <InfoRow
                  label="Reactions"
                  value={article.public_reactions_count}
                />
                <InfoRow
                  label="Language"
                  value={article.language?.toUpperCase()}
                />
              </div>
            </div>
          }

          {tocItems.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <h3 className="font-semibold text-slate-800 mb-3">
                Table of Contents
              </h3>
              <ul className="flex flex-col gap-2 text-sm">
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToHeading(item.id)}
                      className={`text-left hover:text-indigo-600 text-slate-600 ${item.level === "H3" ? "pl-4" : ""}`}
                    >
                      {item.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {related.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800">
                  Related Articles
                </h3>
              </div>
              <div className="flex flex-col gap-3">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    to={`/articles/${r.id}`}
                    className="flex items-center gap-3 hover:bg-slate-50 rounded-lg p-1"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                      {r.tag_list[0]?.toUpperCase().slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 line-clamp-1">
                        {r.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        {r.reading_time_minutes} min read
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
