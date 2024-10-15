import MidDescription from '@/components/App/homeComponent/MidDescription'
import { AuroraBackgroundDemo } from '@/components/example/AuroraBackgroundDemo'
import { HeroScrollDemo } from '@/components/example/HeroScrollDemo'
import Header from '@/components/Header'
import React from 'react'

const page = () => {
  return (
    <>
      <div className='bg-black '>
    <Header/>
    <AuroraBackgroundDemo/>
    <MidDescription/>
    <HeroScrollDemo/>
      </div>
    </>
  )
}

export default page