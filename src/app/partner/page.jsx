'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import Link from "next/link";
import { MapPin, ArrowLeft, Package, Navigation, CheckCircle } from "lucide-react";
import { fetchParcels, acceptParcelRequest } from "@/app/actions";

const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-200/50 animate-pulse rounded-2xl min-h-[300px]" />
});

export default function PartnerPage() {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);

  // In a real app, we would use geolocation to center the map and filter parcels.
  // Here we just fetch all pending parcels for the demo.
  const loadParcels = async () => {
    setLoading(true);
    const data = await fetchParcels();
    setParcels(data.filter(p => p.status === 'pending')); // Only show pending
    setLoading(false);
  };

  useEffect(() => {
    loadParcels();
  }, []);

  const handleAccept = async (id) => {
    await acceptParcelRequest(id);
    await loadParcels(); // Refresh list
    alert("Parcel Accepted! Customer has been notified.");
  };

  return (
    <main className="min-h-screen p-4 md:p-8 relative overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto z-10 relative">
        <header className="flex justify-between items-center mb-8">
            <Link href="/" className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:opacity-75 transition">
                <ArrowLeft size={20} />
                <span className="font-semibold">Back</span>
            </Link>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                Partner Dashboard
            </h1>
            <div className="w-8" />
        </header>

        <div className="grid md:grid-cols-2 gap-8">
            {/* Left Panel: List */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Nearby Parcels</h2>
                    <button onClick={loadParcels} className="text-sm text-blue-600 hover:underline">Refresh</button>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading parcels...</div>
                ) : parcels.length === 0 ? (
                    <GlassCard className="text-center py-10">
                        <p className="text-gray-500">No pending parcels found.</p>
                    </GlassCard>
                ) : (
                    <div className="space-y-4">
                        {parcels.map(parcel => (
                            <GlassCard key={parcel.id} className="p-4 hover:bg-white/50 border-l-4 border-l-green-500 transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <Package size={18} className="text-gray-500" />
                                        <h3 className="font-semibold">Parcel #{parcel.id}</h3>
                                        <span className="text-xs text-gray-500">({parcel.weight} kg)</span>
                                    </div>
                                    <div className="font-bold text-green-600">
                                        ₹{parcel.price}
                                    </div>
                                </div>
                                
                                <div className="pl-6 text-sm text-gray-600 space-y-2 my-3">
                                    <div className="flex items-start gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5" />
                                        <div>
                                            <p className="font-medium">Pickup</p>
                                            <p className="text-xs text-gray-500">Lat: {parcel.pickup.lat.toFixed(3)}, Lng: {parcel.pickup.lng.toFixed(3)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5" />
                                        <div>
                                            <p className="font-medium">Drop</p>
                                            <p className="text-xs text-gray-500">Lat: {parcel.drop.lat.toFixed(3)}, Lng: {parcel.drop.lng.toFixed(3)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                                    <span className="text-xs font-mono text-gray-500">Dist: {parcel.distance} km</span>
                                    <GlassButton 
                                        className="px-6 py-2 h-auto text-sm bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleAccept(parcel.id)}
                                    >
                                        Accept Request
                                    </GlassButton>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                )}
            </div>

            {/* Right Panel: Map */}
            <div className="hidden md:block h-[600px]">
                <Map 
                    zoom={7} 
                    center={[10.5, 76.2]} 
                    markers={parcels.flatMap(p => [
                        { position: p.pickup, popup: `Pickup #${p.id} (₹${p.price})` },
                        { position: p.drop, popup: `Drop #${p.id}` }
                    ])} 
                />
            </div>
        </div>
      </div>
    </main>
  );
}