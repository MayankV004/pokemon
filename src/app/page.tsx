"use client"

import { useRouter } from "next/navigation";
import HeroSection from "./components/HeroSection";
import PokemonCardSection from "./components/PokemonCardSection";

export default function Home() {
  const router = useRouter();
  
  const handleSearch = (searchTerm: string) => {
    router.push(`/pokemon?q=${encodeURIComponent(searchTerm)}`);
  };
  
  return (
    <>
      <HeroSection onSearch={handleSearch} />
      <PokemonCardSection />
    </>
  );
}