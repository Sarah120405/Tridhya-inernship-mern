"use server";

export async function recordFeedback(framework, slug, helpful) {
  console.log(
    `Feedback recorded: ${framework}/${slug} — ${helpful ? "👍 helpful" : "👎 not helpful"}`,
  );

  // In a real app, this would write to a database or file.
  // For now, this proves the mechanism: no API route, no fetch() call needed.

  return { success: true };
}
