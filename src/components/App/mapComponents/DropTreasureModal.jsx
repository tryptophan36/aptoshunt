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
  <DialogTrigger className='border p-2'>Drop Your Treasure</DialogTrigger>
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