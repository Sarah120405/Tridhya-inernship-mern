export default function MovieCard({ title, year, type, imdbId, poster }) {
  return (
    <>
      <div className="hover:shadow-lg h-full flex flex-col justify-center bg-white border border-zinc-100 p-4 rounded-lg gap-2">
        <div className="">
          <img src={poster} alt={title} />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xl">{title}</span>
          <span className="text-sm">Release Year: {year}</span>
          <span className="text-sm">Type: {type}</span>
        </div>
      </div>
    </>
  );
}
