"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ChevronRight, Info, Activity, Zap } from "lucide-react";
import Link from "next/link";

// Types
interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
      home: {
        front_default: string;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }[];
  species: {
    url: string;
  };
}

interface PokemonSpecies {
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    };
  }[];
  evolution_chain: {
    url: string;
  };
  genera: {
    genus: string;
    language: {
      name: string;
    };
  }[];
}

interface EvolutionChain {
  chain: {
    species: {
      name: string;
      url: string;
    };
    evolves_to: {
      species: {
        name: string;
        url: string;
      };
      evolves_to: {
        species: {
          name: string;
          url: string;
        };
      }[];
    }[];
  };
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

const PokemonDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [evolutions, setEvolutions] = useState<string[]>([]);
  const [evolutionDetails, setEvolutionDetails] = useState<{id: number, name: string, image: string}[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("about");

  const mainType = pokemon?.types[0]?.type.name || "normal";
  const bgColor = typeColors[mainType] || "bg-gray-300";

  // Fetch Pokemon data and species info
  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        setLoading(true);
        
        // Fetch Pokemon details
        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!pokemonResponse.ok) {
          throw new Error(`Pokemon not found with ID: ${id}`);
        }
        const pokemonData: PokemonDetail = await pokemonResponse.json();
        setPokemon(pokemonData);
        
        // Fetch species data
        const speciesResponse = await fetch(pokemonData.species.url);
        const speciesData: PokemonSpecies = await speciesResponse.json();
        setSpecies(speciesData);
        
        // Fetch evolution chain
        if (speciesData.evolution_chain) {
          const evolutionResponse = await fetch(speciesData.evolution_chain.url);
          const evolutionData: EvolutionChain = await evolutionResponse.json();
          
          // Process evolution chain
          const evoChain: string[] = [];
          const currentEvo = evolutionData.chain;
          
          // Add first form
          evoChain.push(currentEvo.species.name);
          
          // Add second form if it exists
          if (currentEvo.evolves_to.length > 0) {
            currentEvo.evolves_to.forEach(evo => {
              evoChain.push(evo.species.name);
              
              // Add third form if it exists
              if (evo.evolves_to.length > 0) {
                evo.evolves_to.forEach(finalEvo => {
                  evoChain.push(finalEvo.species.name);
                });
              }
            });
          }
          
          setEvolutions(evoChain);
          
          // Fetch details for each evolution
          const evoDetailsPromises = evoChain.map(async (evoName) => {
            const evoResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${evoName}`);
            const evoData = await evoResponse.json();
            return {
              id: evoData.id,
              name: evoData.name,
              image: evoData.sprites.other["official-artwork"].front_default
            };
          });
          
          const evoDetails = await Promise.all(evoDetailsPromises);
          setEvolutionDetails(evoDetails);
        }
        
        setError(null);
      } catch (err) {
        setError(`Error loading Pokemon: ${err instanceof Error ? err.message : String(err)}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchPokemonData();
    }
  }, [id]);

  // Get English description
  const getEnglishDescription = () => {
    if (!species) return "No description available.";
    
    const englishEntry = species.flavor_text_entries.find(
      entry => entry.language.name === "en"
    );
    
    return englishEntry 
      ? englishEntry.flavor_text.replace(/\f/g, ' ') 
      : "No English description available.";
  };

  // Format stat name for display
  const formatStatName = (statName: string): string => {
    const statMap: Record<string, string> = {
      "hp": "HP",
      "attack": "Attack",
      "defense": "Defense",
      "special-attack": "Sp. Atk",
      "special-defense": "Sp. Def",
      "speed": "Speed"
    };
    
    return statMap[statName] || statName;
  };

  // Calculate stat bar width based on value
  const calculateStatBarWidth = (value: number): string => {
    // Max stat value is around 255, but most are below 150
    const percentage = Math.min(100, (value / 150) * 100);
    return `${percentage}%`;
  };

  // Get stat bar color based on value
  const getStatBarColor = (value: number): string => {
    if (value < 50) return "bg-red-500";
    if (value < 80) return "bg-yellow-500";
    if (value < 120) return "bg-green-500";
    return "bg-blue-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-300 h-32 w-32 mb-4"></div>
          <div className="h-6 bg-gray-300 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-64"></div>
        </div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="mb-6">{error || "Failed to load Pokémon data"}</p>
          <button 
            onClick={() => router.push('/pokemon')}
            className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Return to Pokémon List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <Link href="/pokemon" className="inline-flex items-center text-gray-600 hover:text-indigo-600 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          <span>Back to Pokémon List</span>
        </Link>
      </div>
      
      {/* Top section with image and basic info */}
      <div className={`${bgColor} py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Pokemon image */}
            <div className="relative w-64 h-64">
              <Image
                src={pokemon.sprites.other["official-artwork"].front_default || '/pokeball.png'}
                alt={pokemon.name}
                layout="fill"
                objectFit="contain"
                className="drop-shadow-xl"
              />
            </div>
            
            {/* Basic info */}
            <div className="text-white flex-1">
              <div className="mb-4">
                <span className="text-white/70 font-mono text-xl">#{pokemon.id.toString().padStart(3, '0')}</span>
                <h1 className="text-4xl md:text-5xl font-bold capitalize mb-2">{pokemon.name}</h1>
                <p className="text-lg text-white/80">
                  {species?.genera.find(g => g.language.name === "en")?.genus || "Pokémon"}
                </p>
              </div>
              
              {/* Types */}
              <div className="flex gap-3 mb-6">
                {pokemon.types.map((typeObj, index) => (
                  <span 
                    key={index} 
                    className="bg-white/20 backdrop-blur-sm text-white px-4 py-1 rounded-full capitalize font-medium"
                  >
                    {typeObj.type.name}
                  </span>
                ))}
              </div>
              
              {/* Physical attributes */}
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-white/70 mb-1">Height</p>
                  <p className="text-xl font-semibold">{(pokemon.height / 10).toFixed(1)} m</p>
                </div>
                <div className="text-center">
                  <p className="text-white/70 mb-1">Weight</p>
                  <p className="text-xl font-semibold">{(pokemon.weight / 10).toFixed(1)} kg</p>
                </div>
                <div className="text-center">
                  <p className="text-white/70 mb-1">Base Exp</p>
                  <p className="text-xl font-semibold">{pokemon.base_experience}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Details tabs and content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Tabs */}
          <div className="flex border-b">
            <button 
              onClick={() => setActiveTab("about")}
              className={`px-6 py-4 text-lg font-medium ${activeTab === "about" ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
            >
              <span className="flex items-center">
                <Info size={18} className="mr-2" />
                About
              </span>
            </button>
            <button 
              onClick={() => setActiveTab("stats")}
              className={`px-6 py-4 text-lg font-medium ${activeTab === "stats" ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
            >
              <span className="flex items-center">
                <Activity size={18} className="mr-2" />
                Stats
              </span>
            </button>
            <button 
              onClick={() => setActiveTab("evolution")}
              className={`px-6 py-4 text-lg font-medium ${activeTab === "evolution" ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
            >
              <span className="flex items-center">
                <Zap size={18} className="mr-2" />
                Evolution
              </span>
            </button>
          </div>
          
          {/* Tab content */}
          <div className="p-6">
            {/* About tab */}
            {activeTab === "about" && (
              <div>
                <h3 className="text-2xl font-semibold mb-4">Description</h3>
                <p className="text-gray-700 mb-8">{getEnglishDescription()}</p>
                
                <h3 className="text-2xl font-semibold mb-4">Abilities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {pokemon.abilities.map((ability, index) => (
                    <div key={index} className="bg-gray-100 rounded-lg p-4">
                      <div className="flex items-center">
                        <span className="capitalize font-medium mr-2">{ability.ability.name.replace('-', ' ')}</span>
                        {ability.is_hidden && (
                          <span className="text-xs bg-gray-600 text-white px-2 py-0.5 rounded">Hidden</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Stats tab */}
            {activeTab === "stats" && (
              <div>
                <h3 className="text-2xl font-semibold mb-6">Base Stats</h3>
                <div className="space-y-4">
                  {pokemon.stats.map((stat, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700 font-medium">{formatStatName(stat.stat.name)}</span>
                        <span className="text-gray-700 font-medium">{stat.base_stat}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${getStatBarColor(stat.base_stat)}`} 
                          style={{ width: calculateStatBarWidth(stat.base_stat) }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Evolution tab */}
            {activeTab === "evolution" && (
              <div>
                <h3 className="text-2xl font-semibold mb-6">Evolution Chain</h3>
                
                {evolutionDetails.length > 0 ? (
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
                    {evolutionDetails.map((evo, index) => (
                      <React.Fragment key={evo.id}>
                        <Link href={`/pokemon/${evo.id}`} className="group">
                          <div className={`
                            text-center p-4 rounded-lg 
                            ${pokemon.id === evo.id ? 'bg-indigo-100 ring-2 ring-indigo-500' : 'hover:bg-gray-100'}
                            transition-all duration-200
                          `}>
                            <div className="relative w-24 h-24 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                              <Image
                                src={evo.image || '/pokeball.png'}
                                alt={evo.name}
                                layout="fill"
                                objectFit="contain"
                              />
                            </div>
                            <p className="capitalize font-medium">{evo.name}</p>
                            <p className="text-sm text-gray-500">#{evo.id.toString().padStart(3, '0')}</p>
                          </div>
                        </Link>
                        
                        {/* Arrow between evolutions */}
                        {index < evolutionDetails.length - 1 && (
                          <div className="md:flex items-center justify-center hidden">
                            <ChevronRight size={24} className="text-gray-400" />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">No evolution data available.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailPage;