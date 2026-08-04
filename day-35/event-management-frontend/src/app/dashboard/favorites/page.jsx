"use client";
import { useState, useEffect } from "react";
import { MapPin, Users, Heart } from "lucide-react";

export default function MyFavoritesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [toggleFav, setToggleFav] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/favorite/", {
          credentials: "include",
        });
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json();
        setFavorites(data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [toggleFav]);

  async function handleFavoriteClick(eventId) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/favorite/${eventId}`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();
      console.log(data);
      setToggleFav(data.favorited);
    } catch (err) {
      console.error("Error in favorites:", err);
    }
  }

  return (
    <div className="bg-zinc-50 min-h-screen">
      <header className="relative overflow-hidden bg-gradient-to-r from-purple-100 to-indigo-50 px-4 py-10">
        <h1 className="text-3xl font-bold text-zinc-900">My Favorites</h1>
        <p className="text-zinc-500 mt-1">
          View and manage your favorite events.
        </p>
        <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-purple-200/40 blur-3xl" />
      </header>

      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-zinc-500">
            {loading
              ? "Loading favorites..."
              : `${favorites.length} Favorites Found`}
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border overflow-hidden animate-pulse"
              >
                <div className="h-36 bg-zinc-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-zinc-200 rounded w-3/4" />
                  <div className="h-3 bg-zinc-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500">
            Couldn't load favorites — {error.message}
          </p>
        )}

        {!loading && !error && favorites.length === 0 && (
          <p className="text-sm text-zinc-400">No favorites found yet.</p>
        )}

        {!loading && !error && favorites.length > 0 && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {favorites.map((event) => {
              const dateObj = new Date(event.event.date);
              const day = dateObj.getDate();
              const month = dateObj
                .toLocaleString("en-US", { month: "short" })
                .toUpperCase();

              return (
                <li key={event.event._id}>
                  <div className="block rounded-2xl border bg-white overflow-hidden hover:shadow-md transition">
                    <div className="p-4 relative">
                      <h3 className="font-semibold text-sm leading-snug">
                        {event.event.title}
                      </h3>
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          handleFavoriteClick(event.event._id);
                        }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full shadow bg-white px-2 py-1 flex items-center justify-center"
                        aria-label="Save event"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 fill-current text-pink-500`}
                        />
                      </button>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col items-start">
                          <p className="flex items-center gap-1 text-xs text-zinc-400 mt-1">
                            <MapPin className="w-3 h-3" />
                            {event.event.location}
                          </p>
                          {event.event.capacity && (
                            <p className="flex items-center gap-1 text-xs text-zinc-400 mt-1">
                              <Users className="w-3 h-3" /> Capacity:
                              {event.event.capacity}
                            </p>
                          )}
                        </div>
                        <div className="text-center leading-none">
                          <div className="text-sm font-bold">{day}</div>
                          <div className="text-[10px] text-zinc-500">
                            {month}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
