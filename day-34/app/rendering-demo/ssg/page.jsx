/* Generated once, at build time. Hence often used for static pages */

import RenderInfoCard from "../../../components/RenderInfoCard";
import { formatTimestamp } from "@/utils/formatDate";

function getData() {
  return {
    randomNumber: Math.floor(Math.random() * 1000000),
    timestamp: new Date().toISOString(),
  };
}

export default function SSGPage() {
  const { randomNumber, timestamp } = getData();

  return (
    <RenderInfoCard
      badge="Static"
      title="SSG — Static Site Generation"
      description="Generated once, at build time. Reload as many times as you like — nothing here will ever change."
      timestamp={formatTimestamp(timestamp)}
      randomNumber={randomNumber}
    />
  );
}
