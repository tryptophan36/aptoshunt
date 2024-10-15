/*Since the map was loaded on client side, 
we need to make this component client rendered as well*/
"use client";
import { useState, useEffect, useRef } from "react";
//Map component Component from library
import { GoogleMap, Marker } from "@react-google-maps/api";
import { PoiMarkers } from "./App/mapComponents/PoiMarker";
import { Poi } from "@/utils/mapPointers";
import DropTreasureModal from "./App/mapComponents/DropTreasureModal";

//Map's styling
const defaultMapContainerStyle = {
  width: "100%",
  height: "60vh",
  borderRadius: "15px 0px 0px 15px",
};

//Map options
const defaultMapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: "auto",
  mapTypeId: "roadmap",
};

const MapComponent = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [defaultMapZoom, setDefaultMapZoom] = useState(18);
  const mapRef = useRef<any>(null);
  const [locations, setLocations] = useState<Poi[]>([]); // State to manage locations array

  const centerMapOnLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.panTo(userLocation); // Pan the map to the user's location
      setDefaultMapZoom(18);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error fetching user location:", error);
        },
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng && locations.length == 0) {
      const newMarker = {
        key: `${locations.length + 1}`,
        location: { lat: event.latLng.lat(), lng: event.latLng.lng() },
      };
      console.log(newMarker);
      setLocations([...locations, newMarker]); // Add new marker to locations array
    } else {
      setLocations((prevLocations) => prevLocations.slice(0, -1)); // Remove the last marker
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <div className="w-full flex justify-center items-center align-middle ">
        {userLocation ? (
          <GoogleMap
            mapContainerStyle={defaultMapContainerStyle}
            center={userLocation}
            zoom={defaultMapZoom}
            options={defaultMapOptions}
            onLoad={(map) => {
              mapRef.current = map;
            }}
            onClick={handleMapClick}
          >
            <Marker position={userLocation} label="You are here" />
            <PoiMarkers currentLocation={userLocation} pois={locations} />
          </GoogleMap>
        ) : (
          <p className="absolute left-[50%] top-[50%] text-center">Loading your location...</p>
        )}
      </div>
      <div className="mb-4 w-full mt-5 flex justify-center  ">
        {/* Button to center map on the user's location */}
        <button
          onClick={centerMapOnLocation}
          className="shadow-[0_0_0_3px_#000000_inset] px-6 py-2 bg-transparent border border-black dark:border-white dark:text-white text-black rounded-lg font-bold transform hover:-translate-y-1 transition duration-400"
        >
          Center on My Location
        </button>
      </div>
      <div className="mb-4 w-full mt-2 flex justify-center bg-black">
        {/* Button to undo the last marker */}

        {/* <button onClick={dropAptosToken} className="px-4 mx-auto py-2 bg-black  text-white rounded">
          Drop Your Treasure
        </button> */}
        <DropTreasureModal location={locations} />
      </div>
    </div>
  );
};

export { MapComponent };
