import { useEffect, useState } from "react";
import "./App.css";
import MovieCard from "./components/MovieCard";
import useDebounce from "./hooks/useDebounce";

const API_KEY = "58322430";

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const query = debouncedSearch || "avengers";
    setLoading(true);
    setError(null);

    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.Response === "False") {
          setError(data.Error);
          setMovies([]);
        } else {
          setMovies(data.Search);
        }
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [debouncedSearch]);

  function handleChange(e) {
    setSearch(e.target.value);
  }

  return (
    <div className="w-full min-h-6xl bg-zinc-50 px-10 items-center flex flex-col py-6">
      <h2 className="text-3xl font-bold">Movies</h2>
      <input
        value={search}
        placeholder="Enter movie"
        onChange={handleChange}
        className="w-full h-full border border-zinc-50 shadow m-2 p-4 rounded-lg "
      />
      <ul className="grid lg:grid-cols-4 grid-cols-2 gap-4">
        {loading && (
          <p className="col-span-4 text-center text-slate-500">Loading...</p>
        )}

        {error && !loading && (
          <p className="col-span-4 text-center text-rose-600">
            {typeof error === "string"
              ? error
              : "Something went wrong. Try again."}
          </p>
        )}

        {!loading && !error && movies.length === 0 && search && (
          <p className="col-span-4 text-center text-slate-400">
            No movies found.
          </p>
        )}

        {!loading &&
          !error &&
          movies.map((movie) => (
            <li key={movie.imdbID}>
              <MovieCard
                title={movie.Title}
                year={movie.Year}
                type={movie.Type}
                poster={movie.Poster}
              />
            </li>
          ))}
      </ul>
    </div>
  );
}

export default App;
