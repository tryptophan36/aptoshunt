"use client"
import { Poi } from "@/utils/mapPointers";
import { Marker } from "@react-google-maps/api";
import { useState } from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Aptos,Network,AptosConfig, InputViewFunctionData } from "@aptos-labs/ts-sdk";
import { InputTransactionData,  useWallet } from "@aptos-labs/wallet-adapter-react";
import { ToastContainer, toast } from 'react-toastify';
// Custom icon setup for markers (Pin equivalent)
const customMarkerIcon = {
  path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z",
  fillColor: "#FBBC04", // Custom fill color (Yellow in this case)
  fillOpacity: 1,
  strokeWeight: 2,
  strokeColor: "#000", // Custom border color
  scale: 1.5, // Scaling the icon size
};


export const PoiMarkers = (props: { pois: Poi[],currentLocation:any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [eligible,setEligible] = useState(false)
  const { account, signAndSubmitTransaction } = useWallet();
  const aptosConfig = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(aptosConfig);
  const[claimsLeft,setClaimsLeft]=useState<any>()
  const [amount,setAmount]=useState<any>()
  const closeModal = () => {
    setIsOpen(false);
  };

  const EARTH_RADIUS = 6371000; // Earth's radius in meters

  // Helper function to convert degrees to radians
  const degreesToRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };
  
  // Function to calculate distance using Haversine formula
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = EARTH_RADIUS * c; // Distance in meters
    return distance;
  };
  
  // Function to check if eligible for claim
  const isEligibleForClaim = (
    currentLat: number,
    currentLon: number,
    dropLat: number,
    dropLon: number
  ) => {
    const distance = calculateDistance(currentLat, currentLon, dropLat, dropLon);
     if(distance <= 150)
      {
        console.log(distance)
        setEligible(true)
        
      }else{
        setEligible(false)
      } // Eligible if distance is less than or equal to 150 meters
  };
  
  const claimAptosToken = async (pois:any) => {
    if(!account ) {
      console.log(account, pois.location)
      return;
    }
    else{
      const lattitude=pois.location.lat;
      const longitude=pois.location.lng;
      const contractLattitude=Math.round(lattitude*1000)
      const contractLongitude=Math.round(longitude*1000)
      console.log(contractLattitude,contractLongitude)
      const claimToken = async ( lattitude:number, longitude:number) => {
        // const transaction = {
        //   type: 'entry_function_payload',
        //   function: '0xe1601771384dfb2ac6d2788eb96b449eef1ff97a20677c2b644eeab77e73c4bf::treasure_token::claim_token',
        //   type_arguments: [],
        //   arguments: [latitude, longitude],
        // };
        console.log(pois)
        const transaction:InputTransactionData = {
          data:{
          function: '0x7d596052c4ac93a0d3ed076be21f61bba656d624fcbc5eea1d25941030f50a4f::treasure_token::claim_token', // Update with actual module address
          functionArguments: [
            "0x4bcc4659c742a6fa6c29b75ce56d42fccc3d5e60e0f321c0d8e80f1b133f67e7",
            lattitude, 
            longitude
          ],
          }
        };

        const response = await signAndSubmitTransaction(transaction);
        const txnResponse=await aptos.waitForTransaction({transactionHash:response.hash});
        if(txnResponse.success){
          toast.success("Token Successfully Claimed",{
            position: "top-right",
  autoClose: 5000,
          })
        }
        console.log(txnResponse,"------>") 
      };
      claimToken(contractLattitude,contractLongitude)
    } 
  };

  const viewDropInfo = async ( lattitude:number, longitude:number) => {
    
    const contractLattitude=Math.round(lattitude*1000)
      const contractLongitude=Math.round(longitude*1000)
    if (!account) return [];
    // change this to be your module account address
    const moduleAddress = "0x7d596052c4ac93a0d3ed076be21f61bba656d624fcbc5eea1d25941030f50a4f";
    try {
     
      const payload: InputViewFunctionData = {
        function: `${moduleAddress}::treasure_token::view_drop_info`,
        functionArguments: [
          contractLattitude,
          contractLongitude
        ]
      };

      const response = await aptos.view({
        payload: payload
        
      });
      console.log(response.at(0))
      if(response){
        setClaimsLeft(response.at(0))
        setAmount(response.at(1))
      }
    } catch (e: any) {
      console.error("Error fetching TodoList resource:", e);
      
    }
  };

  return (
    <>
      {props.pois.map((poi: Poi) => (
        <>
        <Marker
          onClick={()=>{
            viewDropInfo(poi.location.lat,poi.location.lng)
            isEligibleForClaim(poi.location.lat,poi.location.lng,props?.currentLocation.lat,props?.currentLocation.lng)
            setIsOpen(true)
          }}
          key={poi.key}
          position={poi.location}
          icon={customMarkerIcon} // Use the custom marker icon here
        />
        {isOpen && (
       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
       <div className="bg-black flex flex-col gap-y-3 rounded-lg shadow-lg max-w-md w-full p-6">
         <h2 className="text-xl font-semibold mb-4">Claim Your Treasure</h2>
         <div>
           <Label htmlFor="firstname">Eligibility</Label>
           <Input
             className="mt-1 placeholder:text-yellow-400"
             id="firstname"
             disabled
             placeholder={`${eligible ? "Claim Your Treasure" : "Please move closer"}`}
             type="text"
           />
         </div>
         <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
           <div>
             <Label htmlFor="firstname">Latitude</Label>
             <Input
               className="mt-1 text-white placeholder:text-gray-300"
               id="firstname"
               disabled
               placeholder={`${poi.location.lat}`}
               type="text"
             />
           </div>
           <div>
             <Label htmlFor="lastname">Longitude</Label>
             <Input
               className="mt-1 placeholder:text-gray-300"
               id="lastname"
               disabled
               placeholder={`${poi.location.lng}`}
               type="text"
             />
           </div>
         </div>
         <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
           <div>
             <Label htmlFor="firstname">Amount</Label>
             <Input
               className="mt-1 placeholder:text-gray-300"
               id="firstname"
               disabled
               placeholder={`${(amount*(10**-8))|| "Fetching..."} Apt`}
               type="text"
             />
           </div>
           <div>
             <Label htmlFor="lastname">Claims Left</Label>
             <Input
               className="mt-1 placeholder:text-gray-300"
               id="lastname"
               disabled
               placeholder={`${claimsLeft || "Fetching..."}`}
               type="text"
             />
           </div>
         </div>
         <div className="flex gap-3">
           <button
             onClick={closeModal}
             className="bg-sky-500 hover:bg-sky-700 px-4 py-2 rounded-md "
           >
             Close
           </button>
     
           <button
             onClick={() => claimAptosToken(poi)}
             disabled={!eligible}
             className={`${
               eligible
                 ? "bg-sky-500 hover:bg-sky-700"
                 : "bg-blue-500 opacity-50 cursor-not-allowed"
             } px-4 py-2 rounded-md`}
           >
             Claim
           </button>
         </div>
       </div>
       
     </div>
     
      )}
      
        </>
      )
    )
      
      
      }
      
    </>
  );
};
