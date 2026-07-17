import { Link } from "react-router-dom";
import { useBookmarks } from "../hooks/bookMarkHook";
import { FiBookmark } from "react-icons/fi";
import colorForTag from "../components/ColorTag";

function getBookmarkStats(bookmarks) {
  const totalReadingTime = bookmarks.reduce(
    (sum, b) => sum + (b.reading_time_minutes || 0),
    0,
  );

  const tagCounts = {};
  bookmarks.forEach((b) => {
    (b.tag_list || []).forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const authorCounts = {};
  bookmarks.forEach((b) => {
    const name = b.user?.name;
    if (name) authorCounts[name] = (authorCounts[name] || 0) + 1;
  });
  const topAuthor = Object.entries(authorCounts).sort((a, b) => b[1] - a[1])[0];

  return { totalReadingTime, topTags, topAuthor };
}

export default function Bookmarks() {
  const { bookmarks, toggleBookmark } = useBookmarks();

  const stats = getBookmarkStats(bookmarks);

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <FiBookmark className="text-4xl text-slate-300 mb-3" />
        <h2 className="text-lg font-semibold text-slate-700">
          No bookmarks yet
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">
          Articles you bookmark will show up here.
        </p>
        <Link
          to="/articles"
          className="text-indigo-600 text-sm font-medium hover:underline"
        >
          Browse articles →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 max-w-7xl mx-auto items-stretch">
      <div className="lg:col-span-3 flex flex-col gap-3">
        {bookmarks.map((article) => (
          <div
            key={article.id}
            className="flex gap-4 bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition"
          >
            <Link
              to={`/articles/${article.id}`}
              className="flex gap-4 flex-1 min-w-0"
            >
              <div
                className="w-32 h-24 shrink-0 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colorForTag(article.tag_list?.[0]) }}
              >
                {article.cover_image ? (
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-white text-lg font-bold">
                    {article.tag_list?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 line-clamp-1">
                  {article.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-1">
                  {article.description}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                  <span>{article.user?.name}</span>
                  <span>·</span>
                  <span>{article.readable_publish_date}</span>
                </div>
              </div>
            </Link>
            <button
              onClick={() => toggleBookmark(article)}
              className="shrink-0 text-slate-400 hover:text-red-500 transition"
              aria-label="Remove bookmark"
            >
              <FiBookmark className="fill-current" />
            </button>
          </div>
        ))}
      </div>
      {bookmarks.length > 0 && (
        <aside className="lg:col-span-2 flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h3 className="font-semibold text-slate-800 mb-3">
              Your Reading Stats
            </h3>
            <div className="flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Total saved</span>
                <span className="font-medium text-slate-700">
                  {bookmarks.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Est. reading time</span>
                <span className="font-medium text-slate-700">
                  {stats.totalReadingTime} min
                </span>
              </div>
              {stats?.topAuthor && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Most saved from</span>
                  <span className="font-medium text-slate-700">
                    {stats?.topAuthor[0]}
                  </span>
                </div>
              )}
            </div>
          </div>

          {stats?.topTags.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <h3 className="font-semibold text-slate-800 mb-3">Top Topics</h3>
              <div className="flex flex-col gap-2">
                {stats.topTags.map(([tag, count]) => (
                  <div
                    key={tag}
                    className="flex items-center justify-between text-sm"
                  >
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: colorForTag(tag) }}
                    >
                      {tag}
                    </span>
                    <span className="text-slate-400 text-xs">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      )}
    </div>
  );
}
