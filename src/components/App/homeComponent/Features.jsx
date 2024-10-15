import React from "react";

const Features = () => {
  return (
    <div className="flex justify-center">
      <div className="flex  flex-col justify-center items-center align-middle ">
        {/* Feature 1 */}
        <div className="group w-[70%] ">
          <h2 className="text-2xl text-white  group-hover:text-white cursor-pointer transition-colors duration-200">
            Blockchain-Powered Security
          </h2>
          <p className="text-lg text-white group-hover:text-white cursor-pointer transition-colors duration-200  pt-5">
            Aptos ensures that every treasure drop and claim is secure, transparent, and immutable, guaranteeing fair
            play and decentralized control.
          </p>
          <div className="border-t border-gray-300 my-6 "></div>
        </div>

        {/* Feature 2 */}
        <div className="group w-[70%]">
          <h2 className="text-2xl text-white  group-hover:text-white cursor-pointer transition-colors duration-200">
            Geolocation-Based Gameplay
          </h2>
          <p className="text-lg text-white group-hover:text-white cursor-pointer transition-colors duration-200 pt-5">
            Combining real-world locations with Aptos' blockchain, players can claim treasures only when they're near
            the drop, enhancing the hunt's thrill.
          </p>
          <div className="border-t border-gray-300 my-6 "></div>
        </div>

        {/* Feature 3 */}
        <div className="group w-[70%]">
          <h2 className="text-2xl text-white group-hover:text-white cursor-pointer transition-colors duration-200">
            Seamless Wallet Integration
          </h2>
          <p className="text-lg  text-white group-hover:text-white cursor-pointer transition-colors duration-200 pt-5">
            Aptos enables smooth wallet use and fast, low-cost token transactions, making rewards easy to claim and
            trade. Aptos delivers a fast, scalable, and secure treasure hunt experience.
          </p>
          <div className="border-t border-gray-300 my-6 "></div>
        </div>
      </div>
    </div>
  );
};

export default Features;
