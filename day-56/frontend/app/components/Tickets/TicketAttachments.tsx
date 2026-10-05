export default function TicketAttachments({
  attachments,
}: {
  attachments: string[];
}) {
  return (
    <>
      {attachments.map((attachment, index) => {
        // Supports either a string path or an object with a URL/path.
        const fileName =
          attachment.split("/").pop() || `Attachment ${index + 1}`;

        const extension = fileName.split(".").pop()?.toLowerCase();

        const isImage = ["jpg", "jpeg", "png", "webp", "gif"].includes(
          extension || "",
        );

        const isPdf = extension === "pdf";

        return (
          <div key={`${attachment}-${index}`} className="w-64 shrink-0">
            {isImage ? (
              <a
                href={attachment}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-lg border border-blue-100"
              >
                <img
                  src={attachment}
                  alt={fileName}
                  className="h-48 w-full object-cover transition hover:scale-[1.02]"
                />
              </a>
            ) : (
              <a
                href={attachment}
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
