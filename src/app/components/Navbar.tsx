"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-indigo-900 to-purple-900 text-white shadow-lg border-b-2 border-purple-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
              <div className="relative bg-gray-900 rounded-full p-1.5">
                <Image src="/pokeball.png" alt="pokeball" width={7} height={7} className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <Link href="/" className="flex items-center">
              <span className="ml-3 text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-yellow-400">
                Poké<span className="text-blue-400">Dex</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/" label="Home" />
            <NavLink href="/pokemon" label="Pokémon" />
            <NavLink href="/types" label="Types" />
            <NavLink href="/about" label="About" />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-100 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900 rounded-b-lg">
          <MobileNavLink href="/" label="Home" onClick={toggleMenu} />
          <MobileNavLink href="/pokemon" label="Pokémon" onClick={toggleMenu} />
          <MobileNavLink href="/types" label="Types" onClick={toggleMenu} />
          <MobileNavLink href="/about" label="About" onClick={toggleMenu} />
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ href, label }: { href: string; label: string }) => {
  return (
    <Link 
      href={href} 
      className="relative font-medium text-gray-100 hover:text-white px-3 py-2 group"
    >
      {label}
      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-pink-500 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
    </Link>
  );
};

const MobileNavLink = ({ href, label, onClick }: { href: string; label: string; onClick: () => void }) => {
  return (
    <Link 
      href={href} 
      className="block px-3 py-2 rounded-md text-base font-medium text-gray-100 hover:bg-purple-800 hover:text-white transition duration-200"
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

export default Navbar;