/*Server side rendering - renders or fetches data from server at every rendering 
  Browser -> Server -> Fetch API -> Generate HTML -> Browser 
  Here I have created a basic server which is sending timestamp
 */

import { formatTimestamp } from "@/utils/formatDate";
import RenderInfoCard from "@/components/RenderInfoCard";
import { numberGenerator } from "@/utils/randomNumber";

async function getTimestamp() {
  const res = await fetch("http://localhost:3000/api/timestamp", {
    cache: "no-store",
  });
  const data = await res.json();
  return data.datetime;
}

export default async function SSRPage() {
  const timestamp = await getTimestamp();

  return (
    <RenderInfoCard
      badge="Dynamic"
      title="SSR - Server Side Rendering"
      description="Renders on every single request"
      timestamp={formatTimestamp(timestamp)}
      randomNumber={numberGenerator().randomNumber}
    />
  );
}
