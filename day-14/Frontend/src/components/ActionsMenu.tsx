import { useState, useRef, useEffect } from "react";

interface ActionsMenuProps {
  onDelete: () => void;
  onUpdateStatus: () => void;
}

export default function ActionsMenu({
  onDelete,
  onUpdateStatus,
}: ActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="actions-menu" ref={menuRef}>
      <button
        className="actions-trigger"
        onClick={() => setOpen((prev) => !prev)}
      >
        ⋮
      </button>
      {open && (
        <div className="actions-dropdown">
          <button
            onClick={() => {
              onUpdateStatus();
              setOpen(false);
            }}
          >
            Update Status
          </button>
          <button
            className="danger"
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
