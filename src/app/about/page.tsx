"use client";

import React from "react";
import Link from "next/link";
import { Github, ExternalLink, Code, Database, Layout, MessageSquare } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header section */}
      <div className="bg-gradient-to-r from-indigo-800 to-purple-800 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">About PokéDex</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            A modern Pokémon encyclopedia built with Next.js, Tailwind CSS, and the PokéAPI.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
          <p className="text-gray-700 mb-6">
            This PokéDex application was built as a modern, responsive web application 
            that provides detailed information about Pokémon. It showcases modern web 
            development techniques and best practices, including React hooks, 
            server-side and client-side rendering, responsive design, and API integration.
          </p>
          
          {/* Tech stack */}
          <h3 className="text-xl font-bold mb-3">Technology Stack</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-2">
                <Layout className="w-5 h-5 text-indigo-600 mr-2" />
                <h4 className="font-bold text-lg">Frontend</h4>
              </div>
              <ul className="text-gray-700 space-y-1">
                <li>• Next.js (React framework)</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• Lucide React icons</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-2">
                <Database className="w-5 h-5 text-indigo-600 mr-2" />
                <h4 className="font-bold text-lg">Data</h4>
              </div>
              <ul className="text-gray-700 space-y-1">
                <li>• PokéAPI</li>
                <li>• Client-side data fetching</li>
                <li>• React state management</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-2">
                <Code className="w-5 h-5 text-indigo-600 mr-2" />
                <h4 className="font-bold text-lg">Features</h4>
              </div>
              <ul className="text-gray-700 space-y-1">
                <li>• Responsive design</li>
                <li>• Search functionality</li>
                <li>• Filtering by type</li>
                <li>• Detailed Pokémon views</li>
              </ul>
            </div>
          </div>
          
          {/* Features */}
          <h3 className="text-xl font-bold mb-3">Key Features</h3>
          <ul className="list-disc pl-5 text-gray-700 mb-6 space-y-2">
            <li>Browse all Pokémon with pagination</li>
            <li>Search for specific Pokémon by name or number</li>
            <li>Filter Pokémon by their elemental types</li>
            <li>View detailed information about each Pokémon</li>
            <li>Responsive design that works on mobile, tablet, and desktop</li>
            <li>Beautiful UI with animations and transitions</li>
          </ul>
          
          {/* API information */}
          <h3 className="text-xl font-bold mb-3">About PokéAPI</h3>
          <p className="text-gray-700 mb-4">
            This application uses the <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">PokéAPI</a>, 
            which is a RESTful API providing an extensive database of Pokémon information. 
            The API is free to use and provides data about Pokémon, their moves, abilities, types, and more.
          </p>
        </div>
        
        {/* Developer section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Development Notes</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3">Project Structure</h3>
            <p className="text-gray-700">
              This application follows the Next.js App Router structure, with pages organized by routes and components 
              separated by functionality. The UI is built with Tailwind CSS for styling and uses client-side 
              rendering for data fetching from the PokéAPI.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3">Future Enhancements</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Add user authentication for favorites</li>
              <li>Implement team building functionality</li>
              <li>Add move lists and abilities details</li>
              <li>Create comparison tools between Pokémon</li>
              <li>Add evolution chains visualization</li>
            </ul>
          </div>
          
          <div className="flex justify-center mt-8 space-x-4">
            <Link 
              href="/pokemon" 
              className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-300 shadow-md flex items-center"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Explore Pokémon
            </Link>
            
            <Link 
              href="/types" 
              className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-300 shadow-md flex items-center"
            >
              <Database className="w-5 h-5 mr-2" />
              Browse Types
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;