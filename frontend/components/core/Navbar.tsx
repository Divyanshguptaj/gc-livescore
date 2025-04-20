"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import logo from '@/public/logo_gc.png';
import { jwtDecode } from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice"; // Make sure path is correct

type DecodedToken = {
  email: string;
  id: string;
  role: string;
  exp: number;
};

export const Navbar: React.FunctionComponent = () => {
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);

  const navLinks = [
    { title: "Live", href: "/user/live" },
    { title: "Tournaments", href: "/user/tournaments" },
    { title: "Schedule", href: "/user/schedule" },
    { title: "News", href: "/user/news" },
    { title: "Teams", href: "/user/teams" },
    { title: "Videos", href: "/user/videos" },
  ];

  const adminLinks = [
    { title: "Add Tournament", href: "/admin/addTournament" },
    { title: "Add Match", href: "/admin/addMatches" },
    { title: "Update Match", href: "/admin/updateMatch" },
    { title: "Add Teams", href: "/admin/addTeams" },
    { title: "Add Players", href: "/admin/addPlayers" },
    { title: "Add News", href: "/admin/addNews" },
    { title: "Create Team", href: "/admin/createTeam" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(JSON.parse(token));
        dispatch(setUser(decoded));
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [dispatch]);

  return (
    <div className="w-full bg-black text-white border-b border-gray-700">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center">
          <Image src={logo} width={50} height={50} alt="Grand Championship Logo" />
          <p className="text-white text-2xl font-bold ml-3">Grand Championship</p>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex space-x-6">
          {navLinks.map(({ title, href }) => (
            <Link key={title} href={href} className="hover:text-yellow-400 transition">
              {title}
            </Link>
          ))}

          {/* Admin Dropdown */}
          {user?.role === "admin" && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="hover:text-yellow-400 transition"
              >
                Admin Panel ▾
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 bg-neutral-800 border border-gray-600 rounded shadow-md z-10 w-48">
                  {adminLinks.map(({ title, href }) => (
                    <Link
                      key={title}
                      href={href}
                      className="block px-4 py-2 text-sm text-white hover:bg-yellow-500 hover:text-black transition"
                      onClick={() => setShowDropdown(false)}
                    >
                      {title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Link href="/">
            <FaSearch className="text-xl hover:text-yellow-400 transition" />
          </Link>

          {user ? (
            <Link href="/profile">
              <CgProfile className="text-2xl hover:text-yellow-400 transition" />
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-md transition"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm px-3 py-1 border border-yellow-400 hover:bg-yellow-400 text-yellow-400 hover:text-black rounded-md transition"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
