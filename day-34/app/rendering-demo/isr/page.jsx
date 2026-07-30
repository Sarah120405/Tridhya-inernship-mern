/* Pages stay static but re-generate in background after a specified time interval
  User -> Cached Page -> 20 sec expired? -> Yes -> Regenerate -> Serve new HTML 
 */
import RenderInfoCard from "../../../components/RenderInfoCard";
import RefreshButton from "../../../components/RefereshButton";
import { formatTimestamp } from "@/utils/formatDate";
import { numberGenerator } from "@/utils/randomNumber";

async function getData() {
  const res = await fetch("https://api.github.com/zen", {
    next: { revalidate: 20 },
  });
  const zenQuote = await res.text();
  return {
    zenQuote,
    timestamp: new Date().toISOString(),
  };
}

export default async function ISRPage() {
  const { zenQuote, timestamp } = await getData();

  return (
    <RenderInfoCard
      badge="Incremental"
      title="ISR — Incremental Static Regeneration"
      description="Regenerates in the background every 20 seconds, or on demand below."
      timestamp={formatTimestamp(timestamp)}
      randomNumber={numberGenerator().randomNumber}
      quote={zenQuote}
    >
      <RefreshButton />
    </RenderInfoCard>
  );
}
