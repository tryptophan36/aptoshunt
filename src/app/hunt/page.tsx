"use client";
import { useState, useEffect,useRef } from "react";
//Map component Component from library
import { GoogleMap, Marker } from "@react-google-maps/api";
import { PoiMarkers } from "../../components/App/mapComponents/PoiMarker";
import { Poi } from "@/utils/mapPointers";
import { fetchTreasureLocations } from "@/lib/firebase";
import { MapProvider } from "@/providers/map-provider";
import Header from "@/components/Header";
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

const page = () => {
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [defaultMapZoom,setDefaultMapZoom]=useState(18)
    const mapRef = useRef<any>(null);
    const [locations, setLocations] = useState<Poi[]>([]); // State to manage locations array
    
    const centerMapOnLocation = () => {
      if (userLocation && mapRef.current) {
        mapRef.current.panTo(userLocation); // Pan the map to the user's location
        setDefaultMapZoom(18)
      }
    };
  
    useEffect(() => {
      if (navigator.geolocation) {
        fetchTreasureLocations().then((data) => {
          // Check if the data elements match the desired structure
          const validData = data.filter((item) => {
            return (
              typeof item === 'object' &&
              item !== null &&
              'key' in item &&
              'location' in item &&
              typeof item.location === 'object' &&
              'lat' in item.location &&
              'lng' in item.location &&
              typeof item.location.lat === 'number' &&
              typeof item.location.lng === 'number'
            );
          });
        
          if (validData.length > 0) {
            setLocations(validData); // Only set valid data in the locations array
            console.log(validData);
          } else {
            console.log("No valid treasure locations found.");
          }
        });

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
  


  
  
  return (
    <div>
      <Header/>
      <MapProvider>
  <div className="bg-black min-h-screen">
      <div className="w-full flex justify-center items-center align-middle ">
        {userLocation ? (
          <GoogleMap
            mapContainerStyle={defaultMapContainerStyle}
            center={userLocation}
            zoom={defaultMapZoom}
            options={defaultMapOptions}
            onLoad={(map)=>{mapRef.current=map}}
            
          >
            <Marker  position={userLocation} label="You are here" />
            <PoiMarkers currentLocation={userLocation} pois={locations} />
          </GoogleMap>
        ) : (
          <p className="absolute left-[50%] top-[50%] text-center">Loading your location...</p>
        )}
      </div>
      <div className="mb-4 w-full mt-5 flex justify-center  ">

        {/* Button to center map on the user's location */}
        <button onClick={centerMapOnLocation} className="px-4 mx-auto py-2 bg-blue-500 text-white rounded">
          Center on My Location
        </button>
      </div>
      
    </div>
      </MapProvider>

    </div>
  )
}

export default page