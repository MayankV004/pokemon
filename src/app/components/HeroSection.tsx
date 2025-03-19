"use client";
import React, { useState, FormEvent } from "react";
import { Search } from "lucide-react";

interface HeroSectionProps {
  onSearch: (searchTerm: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-yellow-500 rounded-full opacity-10 blur-3xl"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="text-center space-y-8">
          {/* Hero title with animation */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 animate-text-shimmer">
            Discover the World of Pokémon
          </h1>
          
          {/* Hero subtitle */}
          <p className="max-w-2xl mx-auto text-lg text-gray-300 leading-relaxed">
            Explore the complete Pokédex with detailed information on every Pokémon, 
            their types, abilities, evolutions, and more.
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSearch} className="relative group">
              {/* Glowing effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 blur group-focus-within:opacity-100 transition duration-300"></div>
              
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search Pokémon by name or number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-4 pl-5 pr-12 rounded-full bg-gray-900 text-white border-none ring-0 focus:ring-0 focus:outline-none placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="absolute right-1 p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition duration-300"
                >
                  <Search className="w-5 h-5 text-white" />
                </button>
              </div>
            </form>
          </div>

          {/* Quick links */}
          <div className="pt-6">
            <div className="flex flex-wrap justify-center gap-3">
              {["Fire", "Water", "Grass", "Electric", "Psychic"].map((type) => (
                <div
                  key={type}
                  className="px-4 py-2 rounded-full bg-gray-800 bg-opacity-50 hover:bg-opacity-70 text-white text-sm font-medium cursor-pointer transition duration-200"
                >
                  {type}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          className="relative block w-full h-12 md:h-16"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="#111827"
            opacity="0.8"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            fill="#111827"
            opacity="0.5"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            fill="#111827"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;