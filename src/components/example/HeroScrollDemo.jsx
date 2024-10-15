"use client";
import React from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import contract from './image.png'
import Image from "next/image";
export function HeroScrollDemo() {
  return (
    (<div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white mb-5">
              Unleash the power of <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Aptos Smart Contracts
              </span>
            </h1>
          </>
        }>
        <Image
          src={contract}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full w-full object-left-top"
          draggable={false} />
      </ContainerScroll>
    </div>)
  );
}
