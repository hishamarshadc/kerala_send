'use client';

import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { Package, Car, MapPin } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-400/30 rounded-full blur-[100px]" />

      <div className="z-10 text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400">
          Kerala Parcel Connect
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-200">
          Fast, affordable delivery through trusted travelers.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl z-10">
        <GlassCard className="flex flex-col items-center text-center p-10 hover:scale-105">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600">
            <Package size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-3">Send a Parcel</h2>
          <p className="mb-8 text-gray-600 dark:text-gray-300">
            Cheaper & faster than couriers. Send gifts, documents, or items home.
          </p>
          <Link href="/customer" className="w-full">
            <GlassButton className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Send Now
            </GlassButton>
          </Link>
        </GlassCard>

        <GlassCard className="flex flex-col items-center text-center p-10 hover:scale-105">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
            <Car size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-3">Traveling Soon?</h2>
          <p className="mb-8 text-gray-600 dark:text-gray-300">
            Earn money by carrying parcels on your route. 
            <span className="block text-sm mt-2 opacity-75">Verified IDs only.</span>
          </p>
          <Link href="/partner" className="w-full">
            <GlassButton className="w-full bg-green-600 hover:bg-green-700 text-white shadow-green-500/30">
              List Your Trip
            </GlassButton>
          </Link>
        </GlassCard>
      </div>

      <footer className="absolute bottom-6 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <MapPin size={16} />
          <span>Made for Kerala</span>
        </div>
      </footer>
    </main>
  );
}
