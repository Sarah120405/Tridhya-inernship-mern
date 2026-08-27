import { FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function PageHeader({
  breadcrumb = true,
  icon,
  title,
  description,
  action,
}) {
  return (
    <header className="flex flex-col gap-2 mb-7">
      {breadcrumb && (
        <div className="flex items-center gap-2 text-xs text-[#9A93A3]">
          <Link to="/">Dashboard</Link>
          <span>›</span>
          <span className="text-[#6F6878]">{title}</span>
        </div>
      )}

      <div className="flex items-center gap-2 justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDE9FE] text-[#8B5CF6]">
            {icon}
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#29252F]">
              {title}
            </h1>

            <p className="mt-0.5 text-sm text-[#6F6878]">{description}</p>
          </div>
        </div>
        {action}
      </div>
    </header>
  );
}
