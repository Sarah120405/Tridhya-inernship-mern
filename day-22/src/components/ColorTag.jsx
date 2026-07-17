const TAG_COLORS = [
  "#4F46E5", // indigo
  "#F59E0B", // amber
  "#10B981", // emerald
  "#EC4899", // pink
  "#8B5CF6", // violet
  "#EF4444", // red
  "#0EA5E9", // sky
  "#14B8A6", // teal
];

export default function colorForTag(tag) {
  if (!tag) return TAG_COLORS[0]; // fallback for missing/undefined tag

  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % TAG_COLORS.length;
  return TAG_COLORS[index];
}
