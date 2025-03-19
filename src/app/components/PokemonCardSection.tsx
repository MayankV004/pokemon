"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Types
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

interface PokemonListResponse {
  count: number;
  results: {
    name: string;
    url: string;
  }[];
}

// Type background colors mapped to Pokémon types
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

// Pokemon Card Component
const PokemonCard: React.FC<{ pokemon: Pokemon }> = ({ pokemon }) => {
  const mainType = pokemon.types[0]?.type.name || "normal";
  const bgColor = typeColors[mainType] || "bg-gray-300";

  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <div className={`rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl group`}>
        <div className={`${bgColor} p-4 relative h-48 flex items-center justify-center`}>
          {/* Decorative Pokéball background */}
          <div className="absolute opacity-10 w-40 h-40 rounded-full border-8 border-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute opacity-10 w-12 h-12 rounded-full bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          
          {pokemon.sprites.other["official-artwork"].front_default && (
            <div className="relative w-32 h-32 transform group-hover:scale-110 transition-transform duration-300">
              <Image
                src={pokemon.sprites.other["official-artwork"].front_default}
                alt={pokemon.name}
                layout="fill"
                objectFit="contain"
                className="drop-shadow-lg"
              />
            </div>
          )}
        </div>
        
        <div className="bg-white px-4 py-5">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold capitalize">{pokemon.name}</h3>
            <span className="text-sm font-mono text-gray-500">#{pokemon.id.toString().padStart(3, '0')}</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {pokemon.types.map((typeObj, index) => {
              const typeName = typeObj.type.name;
              const typeBg = typeColors[typeName] || "bg-gray-300";
              return (
                <span 
                  key={index} 
                  className={`${typeBg} text-white text-xs px-3 py-1 rounded-full capitalize`}
                >
                  {typeName}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </Link>
  );
};

// Loading Skeleton for Pokemon Cards
const PokemonCardSkeleton = () => {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg animate-pulse">
      <div className="bg-gray-300 p-4 h-48"></div>
      <div className="bg-white px-4 py-5">
        <div className="flex justify-between items-center mb-2">
          <div className="h-5 bg-gray-300 rounded w-2/3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-300 rounded-full w-16"></div>
          <div className="h-6 bg-gray-300 rounded-full w-16"></div>
        </div>
      </div>
    </div>
  );
};

// Main Pokemon Card Section Component
const PokemonCardSection = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const limit = 20;
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get('q')?.toLowerCase() || '';

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        
        // If there's a search query, search for that specific pokemon
        if (searchQuery) {
          try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchQuery}`);
            if (response.ok) {
              const data = await response.json();
              setPokemonList([data]);
            } else {
              // If not found by direct name, we could implement a more complex search here
              setError(`No Pokémon found matching "${searchQuery}"`);
              setPokemonList([]);
            }
          } catch (err) {
            setError(`Error searching for Pokémon: ${err instanceof Error ? err.message : String(err)}`);
            setPokemonList([]);
          }
        } else {
          // Get a list of pokemon
          const listResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
          const listData: PokemonListResponse = await listResponse.json();
          
          // Fetch detailed data for each pokemon
          const pokemonDetailsPromises = listData.results.map(async (pokemon) => {
            const detailResponse = await fetch(pokemon.url);
            return await detailResponse.json();
          });
          
          const pokemonDetails = await Promise.all(pokemonDetailsPromises);
          setPokemonList(pokemonDetails);
        }
        
        setError(null);
      } catch (err) {
        setError(`Failed to fetch Pokémon: ${err instanceof Error ? err.message : String(err)}`);
        setPokemonList([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPokemon();
  }, [offset, searchQuery]);

  const loadMore = () => {
    setOffset(prevOffset => prevOffset + limit);
  };
  
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {searchQuery 
              ? `Search Results for "${searchQuery}"` 
              : "Explore Pokémon"}
          </h2>
          <p className="text-gray-600">
            {searchQuery 
              ? `Showing Pokémon matching your search.` 
              : `Discover amazing Pokémon from various regions.`}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
            <button 
              onClick={() => router.push('/pokemon')}
              className="mt-2 text-blue-600 hover:underline"
            >
              Return to all Pokémon
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            // Display skeletons while loading
            [...Array(8)].map((_, index) => (
              <PokemonCardSkeleton key={index} />
            ))
          ) : (
            // Display pokemon cards
            pokemonList.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))
          )}
        </div>
        
        {!searchQuery && !loading && !error && (
          <div className="mt-12 text-center">
            <button
              onClick={loadMore}
              className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-300 shadow-md"
            >
              Load More Pokémon
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PokemonCardSection;