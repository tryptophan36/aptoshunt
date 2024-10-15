import MidDescription from '@/components/App/homeComponent/MidDescription'
import { AuroraBackgroundDemo } from '@/components/example/AuroraBackgroundDemo'
import Header from '@/components/Header'
import React from 'react'

const page = () => {
  return (
    <>
      <div className='bg-black min-h-screen'>
    <Header/>
    <AuroraBackgroundDemo/>
    <MidDescription/>
      </div>
    </>
  )
}

export default page