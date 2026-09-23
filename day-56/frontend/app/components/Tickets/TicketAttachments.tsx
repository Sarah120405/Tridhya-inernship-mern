export default function TicketAttachments({ attachments }) {
  return (
    <>
      {attachments.map((attachment, index) => {
        // Supports either a string path or an object with a URL/path.
        const filePath =
          typeof attachment === "string"
            ? attachment
            : typeof attachment === "object" &&
                attachment !== null &&
                "url" in attachment
              ? String(attachment.url)
              : typeof attachment === "object" &&
                  attachment !== null &&
                  "path" in attachment
                ? String(attachment.path)
                : "";

        if (!filePath) return null;

        // Normalize Windows backslashes to forward slashes
        const normalizedPath = filePath.replace(/\\/g, "/");

        // Get only the filename, not the full disk path
        const fileName =
          normalizedPath.split("/").pop() || `Attachment ${index + 1}`;

        // Build a URL to the Express static uploads route
        const fileUrl = `http://localhost:5000/uploads/${encodeURIComponent(fileName)}`;

        const extension = fileName.split(".").pop()?.toLowerCase();

        const isImage = ["jpg", "jpeg", "png", "webp", "gif"].includes(
          extension || "",
        );

        const isPdf = extension === "pdf";

        return (
          <div key={`${filePath}-${index}`} className="w-64 shrink-0">
            {isImage ? (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-lg border border-blue-100"
              >
                <img
                  src={fileUrl}
                  alt={fileName}
                  className="h-48 w-full object-cover transition hover:scale-[1.02]"
                />
              </a>
            ) : (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-blue-100 p-3 transition hover:bg-blue-50/40"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700">
                  {isPdf ? "PDF" : "FILE"}
                </span>
                <span className="text-xs text-slate-500">Open attachment</span>
              </a>
            )}
          </div>
        );
      })}
    </>
  );
}
