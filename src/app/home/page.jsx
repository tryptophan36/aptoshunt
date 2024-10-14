"use client"
import { MapProvider } from "../../providers/map-provider.tsx";
import { MapComponent } from "@/components/Map.tsx";
import Header from "@/components/Header.jsx";
export default function Home() {

  return (
    <MapProvider>
      <main>
      <Header/>
        <MapComponent/>
      </main>
    </MapProvider>
  );
}