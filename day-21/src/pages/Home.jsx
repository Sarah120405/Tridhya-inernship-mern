import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllArticles } from "../api/posts";
import PosterImage from "../assets/home-poster.jpg";
import { FiArrowRight } from "react-icons/fi";

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

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getAllArticles()
      .then((data) => setArticles(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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

  const trending = [...articles]
    .sort((a, b) => b.public_reactions_count - a.public_reactions_count)
    .slice(0, 3);

  if (loading)
    return <p className="text-center py-20 text-slate-500">Loading...</p>;
  if (error)
    return <p className="text-center py-20 text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-6xl mx-auto">
      <section className="bg-indigo-50 rounded-2xl p-10 mb-10 text-left relative overflow-hidden flex items-center justify-between ">
        <div>
          <span className="relative inline-block bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full mb-4">
            Welcome Back!
          </span>
          <h1 className="text-4xl tracking-tight relative font-bold text-slate-900 mb-3">
            Discover. Learn. Get Inspired.
          </h1>
          <p className="text-slate-600 relative max-w-md mb-6">
            Explore insightful articles on technology, development, design, and
            more.
          </p>
          <Link
            to="/articles"
            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Explore Articles →
          </Link>
        </div>
        <div className="hidden md:block shrink-0">
          <img
            src={PosterImage}
            alt="Illustration of a laptop, coffee, and books"
            className="w-full max-w-xs h-auto"
          />
        </div>
      </section>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800">
          Featured Articles
        </h2>
        <Link
          to="/articles"
          className="text-indigo-600 text-sm font-medium hover:underline items-center flex flex-row gap-2"
        >
          <p>View all articles</p>
          <FiArrowRight />
        </Link>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.slice(0, 3).map((article) => (
          <li
            key={article.id}
            className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition"
          >
            <Link
              to={`/articles/${article.id}`}
              className="flex flex-col h-full"
            >
              <div
                className="h-40 flex items-center justify-center relative"
                style={{ backgroundColor: colorForTag(article.tag_list[0]) }}
              >
                {article.cover_image ? (
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-3xl font-bold">
                    {article.tag_list[0]?.toUpperCase()}
                  </span>
                )}
                <span className="absolute top-3 left-3 bg-white/90 text-slate-700 text-xs font-medium px-2 py-1 rounded-full">
                  {article.tag_list[0]}
                </span>
                <span className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  {article.reading_time_minutes} min read
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h4 className="font-semibold text-slate-800 mb-1 line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">
                  {article.description}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={article.user.profile_image_90}
                      alt={article.user.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span>{article.user.name}</span>
                  </div>
                  <span>{article.readable_publish_date}</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between mb-4 mt-10">
        <h2 className="text-xl font-semibold text-slate-800">
          Popular Categories
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-10">
        {Object.entries(categoryCounts)
          .slice(0, 12)
          .map(([category, count]) => (
            <div
              key={category}
              className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition cursor-pointer"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: colorForTag(category) }}
              >
                {category.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-slate-700 capitalize">
                {category}
              </span>
              <span className="text-xs text-slate-400">{count} Articles</span>
            </div>
          ))}
      </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Trending Now</h2>
      </div>
      <div className="border border-slate-200 rounded-xl overflow-hidden mb-10">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Article</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Reactions</th>
            </tr>
          </thead>
          <tbody>
            {trending.map((article) => (
              <tr
                key={article.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-4 py-3">
                  <Link
                    to={`/articles/${article.id}`}
                    className="flex items-center gap-3 font-medium text-slate-800 hover:text-indigo-600"
                  >
                    <div
                      className="w-16 h-16 shrink-0 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: colorForTag(article.tag_list[0]),
                      }}
                    >
                      {article.cover_image ? (
                        <img
                          src={article.cover_image}
                          alt={article.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-white text-xs font-bold text-center px-1">
                          {article.tag_list[0]?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <p className="line-clamp-2">{article.title}</p>
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {article.user.name}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium">
                    {article.public_reactions_count} reactions
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;
