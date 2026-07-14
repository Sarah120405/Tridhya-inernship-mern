import ProfileCard from "./components/ProfileCard";
import Avtar1 from "./assets/avtar-1.webp";
import Avtar2 from "./assets/avtar-2.avif";
import Avtar3 from "./assets/avtar-3.webp";

const profiles = [
  {
    name: "Sarah",
    role: "Full Stack Developer",
    image: Avtar1,
    description: "Passionate developer building modern apps and websites",
    skills: "React, Node, CSS, Express",
    projects: "12",
    followers: "200",
    following: "20",
    variant: "purple",
  },
  {
    name: "Mahek",
    role: "Backend Developer",
    image: Avtar2,
    description: "Focused on building scalable APIs and database systems",
    skills: "Node, Express, SQL, MongoDB",
    projects: "8",
    followers: "150",
    following: "35",
    variant: "blue",
  },
  {
    name: "Aman",
    role: "Frontend Developer",
    image: Avtar3,
    description: "Enjoys crafting beautiful and responsive user interfaces",
    skills: "React, Tailwind, HTML, CSS",
    projects: "15",
    followers: "320",
    following: "50",
    variant: "green",
  },
];

function App() {
  return (
    <>
      <header className="flex flex-row justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">
            Profile Cards
          </h2>
          <p>Profiles showing your skills and talent</p>
        </div>
        <div>
          <button className="bg-[var(--primary)] text-[var(--background)] hover:bg-[var(--primary-dark)] rounded-lg p-2">
            + Add Profile
          </button>
        </div>
      </header>
      <div className="grid grid-cols-3 gap-4 h-full">
        {profiles.map((profile, index) => (
          <ProfileCard key={index} {...profile} />
        ))}
      </div>
    </>
  );
}

export default App;
