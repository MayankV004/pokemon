"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

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

interface PokemonBase {
  name: string;
  url: string;
}

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
}

interface TypeDetails {
  name: string;
  pokemon: {
    pokemon: PokemonBase;
  }[];
  damage_relations: {
    double_damage_from: PokemonBase[];
    double_damage_to: PokemonBase[];
    half_damage_from: PokemonBase[];
    half_damage_to: PokemonBase[];
    no_damage_from: PokemonBase[];
    no_damage_to: PokemonBase[];
  };
}

const TypeDetailPage = () => {
  const params = useParams();
  const typeName = params?.typeName as string;
  
  const [typeDetails, setTypeDetails] = useState<TypeDetails | null>(null);
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPokemon, setLoadingPokemon] = useState(true);

  useEffect(() => {
    const fetchTypeDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
        const data = await response.json();
        setTypeDetails(data);
        
        // Limit to first 20 Pokemon to avoid too many requests
        const limitedPokemon = data.pokemon.slice(0, 20);
        
        const pokemonDetailsPromises = limitedPokemon.map(async (p: { pokemon: PokemonBase }) => {
          const pokemonResponse = await fetch(p.pokemon.url);
          return await pokemonResponse.json();
        });
        
        const pokemonDetails = await Promise.all(pokemonDetailsPromises);
        setPokemonList(pokemonDetails);
        setLoadingPokemon(false);
      } catch (error) {
        console.error(`Failed to fetch type details for ${typeName}:`, error);
      } finally {
        setLoading(false);
      }
    };

    if (typeName) {
      fetchTypeDetails();
    }
  }, [typeName]);

  const PokemonCard = ({ pokemon }: { pokemon: Pokemon }) => {
    const mainType = pokemon.types[0]?.type.name || "normal";
    const bgColor = typeColors[mainType] || "bg-gray-300";

    return (
      <Link href={`/pokemon/${pokemon.id}`}>
        <div className={`rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl group`}>
          <div className={`${bgColor} p-4 relative h-32 flex items-center justify-center`}>
            {pokemon.sprites.other["official-artwork"].front_default && (
              <div className="relative w-24 h-24 transform group-hover:scale-110 transition-transform duration-300">
                <Image
                  src={pokemon.sprites.other["official-artwork"].front_default}
                  alt={pokemon.name}
                  fill
                  sizes="100%"
                  style={{ objectFit: "contain" }}
                  className="drop-shadow-lg"
                />
              </div>
            )}
          </div>
          
          <div className="bg-white px-4 py-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold capitalize">{pokemon.name}</h3>
              <span className="text-xs font-mono text-gray-500">#{pokemon.id.toString().padStart(3, '0')}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!typeDetails) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl text-red-600">Type not found</div>
      </div>
    );
  }

  const bgColor = typeColors[typeName] || "bg-gray-300";

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Type Header */}
      <div className={`${bgColor} py-12 px-4`}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4 capitalize">{typeName} Type</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Explore Pokémon of the {typeName} type and learn about their strengths and weaknesses.
          </p>
        </div>
      </div>

      {/* Type Effectiveness */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Type Effectiveness</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Weakness */}
            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-red-600 mb-2">Weak Against</h3>
              <div className="flex flex-wrap gap-2">
                {typeDetails.damage_relations.double_damage_from.map((type) => (
                  <span 
                    key={type.name} 
                    className={`${typeColors[type.name] || "bg-gray-300"} text-white text-xs px-3 py-1 rounded-full capitalize`}
                  >
                    {type.name}
                  </span>
                ))}
                {typeDetails.damage_relations.double_damage_from.length === 0 && (
                  <span className="text-sm text-gray-500">None</span>
                )}
              </div>
            </div>
            
            {/* Strong Against */}
            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-green-600 mb-2">Strong Against</h3>
              <div className="flex flex-wrap gap-2">
                {typeDetails.damage_relations.double_damage_to.map((type) => (
                  <span 
                    key={type.name} 
                    className={`${typeColors[type.name] || "bg-gray-300"} text-white text-xs px-3 py-1 rounded-full capitalize`}
                  >
                    {type.name}
                  </span>
                ))}
                {typeDetails.damage_relations.double_damage_to.length === 0 && (
                  <span className="text-sm text-gray-500">None</span>
                )}
              </div>
            </div>
            
            {/* Resistant To */}
            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-blue-600 mb-2">Resistant To</h3>
              <div className="flex flex-wrap gap-2">
                {typeDetails.damage_relations.half_damage_from.map((type) => (
                  <span 
                    key={type.name} 
                    className={`${typeColors[type.name] || "bg-gray-300"} text-white text-xs px-3 py-1 rounded-full capitalize`}
                  >
                    {type.name}
                  </span>
                ))}
                {typeDetails.damage_relations.half_damage_from.length === 0 && (
                  <span className="text-sm text-gray-500">None</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pokémon List */}
      <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Pokémon with {typeName} Type</h2>
        
        {loadingPokemon ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse h-48 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {pokemonList.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center text-gray-600">
          <p>Showing the first 20 {typeName}-type Pokémon.</p>
        </div>
      </div>
    </div>
  );
};

export default TypeDetailPage;