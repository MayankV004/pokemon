"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


// Type colors from your existing code
const typeColors: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-blue-200",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-300",
  psychic: "bg-pink-500",
  bug: "bg-green-400",
  rock: "bg-yellow-700",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-700",
  dark: "bg-gray-700",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
};

interface Type {
  name: string;
  url: string;
}

const TypesPage = () => {
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://pokeapi.co/api/v2/type");
        const data = await response.json();
        
        // Filter out unknown and shadow types which aren't main game types
        const filteredTypes = data.results.filter(
          (type: Type) => type.name !== "unknown" && type.name !== "shadow"
        );
        
        setTypes(filteredTypes);
      } catch (error) {
        console.error("Failed to fetch types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTypes();
  }, []);

  const handleTypeClick = (typeName: string) => {
    router.push(`/types/${typeName}`);
  };

  // Type icons mapping (you would need actual SVGs/images for these)
  const getTypeIcon = (typeName: string) => {
    const icons: Record<string, React.ReactNode> = {
      fire: "🔥",
      water: "💧",
      grass: "🌿",
      electric: "⚡",
      ice: "❄️",
      fighting: "👊",
      poison: "☠️",
      ground: "🏔️",
      flying: "🦅",
      psychic: "🔮",
      bug: "🐛",
      rock: "🪨",
      ghost: "👻",
      dragon: "🐉",
      dark: "🌑",
      steel: "⚙️",
      fairy: "✨",
      normal: "⭐",
    };
    
    return icons[typeName] || "❓";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header section */}
      <div className="bg-gradient-to-r from-indigo-800 to-purple-800 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Pokémon Types</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Explore Pokémon by their elemental types. Each type has unique strengths and weaknesses in battle.
          </p>
        </div>
      </div>

      {/* Types grid */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(18)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse h-32 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {types.map((type) => (
              <div
                key={type.name}
                className={`${typeColors[type.name] || "bg-gray-300"} rounded-lg shadow-lg overflow-hidden transform transition hover:scale-105 cursor-pointer`}
                onClick={() => handleTypeClick(type.name)}
              >
                <div className="p-6 text-center text-white">
                  <div className="text-3xl mb-2">{getTypeIcon(type.name)}</div>
                  <h3 className="text-xl font-bold capitalize">{type.name}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TypesPage;