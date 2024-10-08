import { MapProvider } from "../../providers/map-provider.tsx";
import { MapComponent } from "@/components/Map.tsx";
export default function Home() {

  return (
    <MapProvider>
      <main>
        <MapComponent/>
      </main>
    </MapProvider>
  );
}