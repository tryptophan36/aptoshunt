"use client";
import React,{useState} from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Aptos,Network,AptosConfig } from "@aptos-labs/ts-sdk";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import { saveTreasureLocation } from "@/lib/firebase";
import { Poi } from "@/utils/mapPointers";
export default function SignupFormDemo({locations}:{locations:Poi[]}) {
  const [dropAmount,setDropAmount]=useState<number|undefined>()
  const [claimsAllowed,setClaimsAllowed]=useState<number|undefined>()
  const { account, signAndSubmitTransaction } = useWallet();
  const aptosConfig = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(aptosConfig);

  const dropAptosToken = async () => {
    if(!account || locations.length==0) return;
    else{
      const lattitude=locations[0].location.lat;
      const longitude=locations[0].location.lng;
      const contractLattitude=Math.round(lattitude*1000)
      const contractLongitude=Math.round(longitude*1000)
      const dropToken = async ( totalAmount:number|undefined, claimsAllowed:number|undefined, latitude:number, longitude:number) => {
        const transaction:InputTransactionData = {
          data:{
            function: '0x7d596052c4ac93a0d3ed076be21f61bba656d624fcbc5eea1d25941030f50a4f::treasure_token::drop_token', // Update with actual module address
          functionArguments: [
            totalAmount, 
            claimsAllowed, 
            contractLattitude, 
            contractLongitude
          ],
          }
        };
      
        const response = await signAndSubmitTransaction(transaction);
        console.log(response,"------->response")
        // wait for transaction
        const txnResponse=await aptos.waitForTransaction({transactionHash:response.hash});
        if(txnResponse){
         saveTreasureLocation(lattitude,longitude,account.address).then((response)=>{
          console.log(response,"-------------------------------->")
         })
        }
        console.log(txnResponse,"------>")
        // return txnResponse;
      };
      dropToken(dropAmount,claimsAllowed,lattitude,longitude)
    } 
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dropAptosToken()
    console.log("Form submitted");
  };

  const saveDataToFireBase = ()=>{
    const lattitude=locations[0].location.lat;
      const longitude=locations[0].location.lng;
    saveTreasureLocation(lattitude,longitude,account?.address).then((response)=>{
      console.log(response,"-------------------------------->")
     })
  }

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Drop Your Treasure
      </h2>
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">Lattitude</Label>
            <Input id="firstname" disabled placeholder={`${locations[0]?.location.lat}`} type="text" />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Longitude</Label>
            <Input id="lastname" disabled placeholder={`${locations[0]?.location.lng}`} type="text" />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="">Amount</Label>
          <Input onChange={(e)=>{setDropAmount(Number(e.target.value))}} id="amount" placeholder="" type="number" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label  htmlFor="password">Available claims</Label>
          <Input onChange={(e)=>{setClaimsAllowed(Number(e.target.value))}} id="password" placeholder="" type="number" />
        </LabelInputContainer>
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Drop &rarr;
          <BottomGradient />
        </button>
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          onClick={saveDataToFireBase}
        >
          Drop &rarr;
          <BottomGradient />
        </button>
        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
