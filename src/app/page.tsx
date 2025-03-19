"use client"

import { useRouter } from "next/navigation";
import { Suspense } from "react";
import HeroSection from "./components/HeroSection";
import PokemonCardSection from "./components/PokemonCardSection";

export default function Home() {
  const router = useRouter();
  
  const handleSearch = (searchTerm: string) => {
    router.push(`/pokemon?q=${encodeURIComponent(searchTerm)}`);
  };
  
  return (
    <>
      <Suspense fallback={<div>Loading hero section...</div>}>
        <HeroSection onSearch={handleSearch} />
      </Suspense>
      <Suspense fallback={<div>Loading Pokémon cards...</div>}>
        <PokemonCardSection />
      </Suspense>
    </>
  );
}