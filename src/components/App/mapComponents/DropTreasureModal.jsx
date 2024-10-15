import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import SignupFormDemo from '@/components/example/signup-form-demo'
  
const DropTreasureModal = ({location}) => {
  return (
    <>
    <Dialog>
  <DialogTrigger className='border p-2'>
  <button className="p-[3px] relative">
  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
  <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
    Drop Your Treasure
  </div>
</button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
    </DialogHeader>
      <SignupFormDemo locations={location}/>
  </DialogContent>
</Dialog>

    </>
  )
}

export default DropTreasureModal