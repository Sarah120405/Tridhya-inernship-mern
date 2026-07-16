import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getAllArticles } from "../api/posts";
import { FiSearch, FiBookmark, FiMessageCircle, FiHeart } from "react-icons/fi";

const TAG_COLORS = [
  "#4F46E5", // indigo
  "#F59E0B", // amber
  "#10B981", // emerald
  "#EC4899", // pink
  "#8B5CF6", // violet
  "#EF4444", // red
  "#0EA5E9", // sky
  "#14B8A6", // teal
];

function colorForTag(tag) {
  if (!tag) return TAG_COLORS[0]; // fallback for missing/undefined tag

  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % TAG_COLORS.length;
  return TAG_COLORS[index];
}

export default function Article() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const activeTab = searchParams.get("sort") || "Latest";
  const page = Number(searchParams.get("page")) || 1;
  const perPage = 5;

  useEffect(() => {
    setLoading(true);
    setError(null);
    getAllArticles()
      .then((data) => setArticles(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const visibleArticles = articles; // placeholder — replace with filtered/sorted/paginated result

  function getCategoryCounts(articles) {
    const counts = {};
    articles.forEach((article) => {
      const tags = Array.isArray(article?.tag_list) ? article.tag_list : [];
      tags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return counts;
  }

  const categoryCounts = getCategoryCounts(articles);
  const SORT_TABS = [
    "All Articles",
    "Latest",
    "Most Popular",
    "Most Comented",
    "Top Rated",
  ];

  const selectedCategories = searchParams.get("categories")
    ? searchParams.get("categories").split(",")
    : [];

  function toggleCategory(tag) {
    const params = new URLSearchParams(searchParams);
    const current = selectedCategories.includes(tag)
      ? selectedCategories.filter((t) => t !== tag)
      : [...selectedCategories, tag];

    if (current.length > 0) {
      params.set("categories", current.join(","));
    } else {
      params.delete("categories");
    }
    setSearchParams(params);
  }
  if (loading)
    return <p className="text-center py-20 text-slate-500">Loading...</p>;
  if (error)
    return <p className="text-center py-20 text-red-500">Error: {error}</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 max-w-7xl mx-auto">
      {/* Main column */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        <div className="flex flex-col items-start ">
          <h1 className="text-4xl font-bold text-slate-900">All Articles</h1>
          <p className="text-sm text-slate-500">
            Discover our latest insights, tutorials, and stories.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {SORT_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set("sort", tab);
                  setSearchParams(params);
                }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Article list */}
        <div className="flex flex-col gap-3">
          {visibleArticles.map((article) => (
            <Link
              to={`/articles/${article.id}`}
              key={article.id}
              className="flex gap-4 bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition"
            >
              <div
                className="w-32 h-24 shrink-0 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colorForTag(article.tag_list[0]) }}
              >
                {article.cover_image ? (
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-white text-lg font-bold">
                    {article.tag_list[0]?.toUpperCase()}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full mb-1">
                  {article.tag_list[0]}
                </span>
                <h3 className="font-semibold text-slate-800 line-clamp-1">
                  {article.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-1">
                  {article.description}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                  <img
                    src={article.user.profile_image_90}
                    alt={article.user.name}
                    className="w-5 h-5 rounded-full"
                  />
                  <span>{article.user.name}</span>
                  <span>·</span>
                  <span>{article.readable_publish_date}</span>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between shrink-0 text-xs text-slate-500">
                <span className="bg-slate-100 px-2 py-1 rounded-full">
                  {article.reading_time_minutes} min read
                </span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <FiHeart /> {article.public_reactions_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiMessageCircle /> {article.comments_count}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination — placeholder, you'll wire actual page count */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {/* buttons go here, using `page` and setSearchParams to update ?page= */}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="flex flex-col gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <h3 className="font-semibold text-slate-800 mb-3">Filter</h3>
          {/* map over categoryCounts here, checkbox per tag */}
          <div className="p-4">
            <h3 className="font-semibold text-slate-800 mb-3">Categories</h3>
            <div className="flex flex-col gap-2">
              {Object.entries(categoryCounts).map(([tag, count]) => (
                <label
                  key={tag}
                  className="flex items-center justify-between text-sm cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(tag)}
                      onChange={() => toggleCategory(tag)}
                    />
                    <span className="capitalize text-slate-700">{tag}</span>
                  </span>
                  <span className="text-slate-400 text-xs">{count}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
