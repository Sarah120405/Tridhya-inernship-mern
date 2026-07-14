import Image from "../assets/hero.png";

const variantStyles = {
  purple: {
    banner: "bg-[var(--primary-light)]",
    role: "text-[var(--primary)]",
    pill: "bg-[var(--primary-light)] text-[var(--primary)]",
    button:
      "bg-[var(--primary)] text-[var(--background)] hover:bg-[var(--primary-dark)]",
  },
  blue: {
    banner: "bg-sky-500",
    role: "text-sky-600",
    pill: "bg-sky-100 text-sky-700",
    button: "bg-sky-500 text-[var(--background)] hover:bg-sky-600",
  },
  green: {
    banner: "bg-emerald-500",
    role: "text-emerald-600",
    pill: "bg-emerald-100 text-emerald-700",
    button: "bg-emerald-500 text-[var(--background)] hover:bg-emerald-600",
  },
};

function ProfileCard({ ...props }) {
  const skills = props.skills.split(",");
  const variant = variantStyles[props.variant] || variantStyles.purple;

  return (
    <>
      <div className="w-full h-full overflow-hidden rounded-3xl bg-white shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
        <div className={`h-32 ${variant.banner}`}></div>
        <div className="-mt-16 mb-4 flex justify-center">
          <img
            src={props.image}
            alt={props.name}
            className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg"
          />
        </div>
        <div className="relative px-6 pb-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-[var(--text-primary)]">
              {props.name}
            </h3>
            <h5 className={`mt-1 font-semibold ${variant.role}`}>
              {props.role}
            </h5>
          </div>
          <div className="mt-4">
            <p className="text-center text-sm leading-6 text-slate-500">
              {props.description}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {skills.map((skill) => (
              <div
                key={skill}
                className={`rounded-full px-6 py-2 text-sm font-medium ${variant.pill}`}
              >
                {skill}
              </div>
            ))}
          </div>
          <hr className="my-6 border-slate-200" />
          <div className="grid grid-cols-3 text-center">
            <div>
              <h4 className="text-xl font-bold text-slate-800">
                {props.projects}
              </h4>
              <p className="text-sm text-slate-500">Projects</p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-800">
                {props.followers}
              </h4>
              <p className="text-sm text-slate-500">Followers</p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-800">
                {props.following}
              </h4>
              <p className="text-sm text-slate-500">Following</p>
            </div>
          </div>
          <div className="grid grid-cols-3 text-center gap-4">
            <button className={`${variant.button} rounded-lg px-2 py-2 `}>
              Follow
            </button>
            <button className={`${variant.button} rounded-lg px-2 py-2`}>
              Message
            </button>
            <button className={`${variant.button} rounded-lg px-2 py-2`}>
              Connect
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileCard;
