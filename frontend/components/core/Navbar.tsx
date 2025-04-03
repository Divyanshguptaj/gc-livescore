"use client"
import Link from "next/link";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import logo from '@/public/logo_gc.png'

export const Navbar: React.FunctionComponent = () => {
  return (
    <div className="w-full h-[10%] bg-black text-white">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo Section */}
        <div className="flex items-center">
            <Image src={logo} width={50} height={50} alt="Grand Championship Logo" />
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          {[
            "LiveScore",
            "Schedule",
            "Archives",
            "News",
            "Series",
            "Teams",
            "Videos",
            "Rankings",
            "More",
          ].map((item) => (
            <Link key={item} href='/' className="hover:text-yellow-400 transition">
              {item}
            </Link>
          ))}
        </div>

        {/* Extra Actions */}
        <div className="flex items-center space-x-4">
          <Link href="/teams" className="text-yellow-400 font-semibold hover:text-yellow-500">
            Cricbuzz Plus
          </Link>
          <Link href="/">
            <FaSearch className="text-xl hover:text-yellow-400 transition" />
          </Link>
          <Link href="/profile">
            <CgProfile className="text-2xl hover:text-yellow-400 transition" />
          </Link>
        </div>
      </div>

      {/* Match Status Bar */}
      {/* <div className="bg-gray-800 text-sm flex flex-wrap justify-between px-6 py-2">
        <div className="font-bold">MATCHES</div>
        {[
          "MPvsBEN-Stumps",
          "SLvsAUR-Preview",
          "WIvsBAN-Preview",
          "INDvsRSA-IND Won",
          "NZvsENG-ENG Won",
        ].map((match, index) => (
          <div key={index} className="hover:text-yellow-400 transition">
            {match}
          </div>
        ))}
        <div className="font-bold hover:text-yellow-400 cursor-pointer">ALL</div>
      </div> */}

      {/* Additional Spacing Sections (stumps2 and stumps3 placeholders) */}
      {/* <div className="h-2 bg-gray-700"></div>
      <div className="h-6 bg-gray-800 text-center text-white">ALL</div> */}
    </div>
  );
};
