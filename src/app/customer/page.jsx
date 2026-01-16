'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassInput } from "@/components/ui/GlassInput";
import { GlassButton } from "@/components/ui/GlassButton";
import Link from "next/link";
import { MapPin, Calendar, Package, ArrowLeft, Info, Bell } from "lucide-react";
import { calculateDistance, calculatePrice } from "@/lib/pricing";
import { submitParcelRequest, fetchNotifications, checkSupabaseConnection, setupDemoData } from "@/app/actions";
import { CheckCircle, XCircle, Loader } from "lucide-react";


const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-200/50 animate-pulse rounded-2xl min-h-[300px]" />
});

function SupaStatusIndicator({ status }) {
    if (status === 'checking') {
        return <div className="flex items-center gap-2 text-gray-500"><Loader className="animate-spin" size={16} /><span>Checking connection...</span></div>;
    }
    if (status === 'initializing') {
        return <div className="flex items-center gap-2 text-gray-500"><Loader className="animate-spin" size={16} /><span>Initializing demo data...</span></div>;
    }
    if (status === 'error') {
        return <div className="flex items-center gap-2 text-red-500"><XCircle size={16} /><span>Connection failed. Please refresh.</span></div>;
    }
    if (status === 'connected') {
        return <div className="flex items-center gap-2 text-green-500"><CheckCircle size={16} /><span>App is live!</span></div>;
    }
    return null;
}

export default function CustomerPage() {
  const [formData, setFormData] = useState({
    date: '',
    weight: '2', // default 2kg
    weightCat: 'light' // light <= 5kg, heavy > 5kg
  });
  
  const [locStatus, setLocStatus] = useState('Select Pickup on Map'); // 'pickup' | 'drop' | 'done'
  const [locations, setLocations] = useState({
    pickup: null, // { lat, lng }
    drop: null
  });

  const [calcResult, setCalcResult] = useState(null); // { distance, price }
  const [submitted, setSubmitted] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [supaStatus, setSupaStatus] = useState('checking'); // 'checking', 'initializing', 'connected', 'error'
  const [demoData, setDemoData] = useState(null); // { customerId, dpId }

  // Check Supabase connection and setup demo data on mount
  useEffect(() => {
    async function initialize() {
      const { error: connError } = await checkSupabaseConnection();
      if (connError) {
        setSupaStatus('error');
        console.error(connError);
        return;
      }
      
      setSupaStatus('initializing');
      try {
        const demoIds = await setupDemoData();
        setDemoData(demoIds);
        setSupaStatus('connected');
      } catch(err) {
        setSupaStatus('error');
        console.error(err);
      }
    }
    initialize();
  }, []);

  // Poll for notifications only if connected
  useEffect(() => {
    if (supaStatus !== 'connected') return;

    const interval = setInterval(async () => {
        const notifs = await fetchNotifications();
        if (notifs.length > notifications.length) {
        }
        setNotifications(notifs);
    }, 3000);
    return () => clearInterval(interval);
  }, [supaStatus, notifications.length]);

  const handleMapClick = (latlng) => {
    if (locStatus === 'Select Pickup on Map') {
      setLocations(prev => ({ ...prev, pickup: latlng }));
      setLocStatus('Select Drop on Map');
    } else if (locStatus === 'Select Drop on Map') {
      setLocations(prev => ({ ...prev, drop: latlng }));
      setLocStatus('Ready');
    }
  };

  // Recalculate when locations or weight change
  useEffect(() => {
    if (locations.pickup && locations.drop) {
      const dist = calculateDistance(
        locations.pickup.lat, 
        locations.pickup.lng, 
        locations.drop.lat, 
        locations.drop.lng
      );
      const weight = parseFloat(formData.weight);
      const price = calculatePrice(dist, weight);
      
      setCalcResult({ distance: dist, price });
    }
  }, [locations, formData.weight]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!locations.pickup || !locations.drop || !demoData) return;

    setSubmitting(true);
    setError(null);

    try {
      await submitParcelRequest({
        customer_id: demoData.customerId,
        pickup: { ...locations.pickup, name: "Selected Location" },
        drop_off: { ...locations.drop, name: "Selected Location" },
        weight: parseFloat(formData.weight),
        date: formData.date,
        price: calcResult.price,
        distance: calcResult.distance
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 relative overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto z-10 relative">
        <header className="flex justify-between items-center mb-8">
            <Link href="/" className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:opacity-75 transition">
                <ArrowLeft size={20} />
                <span className="font-semibold">Back</span>
            </Link>
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    Send a Parcel
                </h1>
                <SupaStatusIndicator status={supaStatus} />
                <div className="relative">
                    <Bell className="text-gray-600" />
                    {notifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                            {notifications.length}
                        </span>
                    )}
                </div>
            </div>
        </header>

        {/* Show app content only if connected */}
        {supaStatus === 'connected' && (
            <>
                {/* Notifications List */}
                {notifications.length > 0 && (
                    <div className="mb-6 space-y-2">
                        {notifications.map(n => (
                            <div key={n.id} className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-xl text-sm flex items-center gap-2 animate-in slide-in-from-top-2">
                                <Bell size={14} /> {n.message}
                            </div>
                        ))}
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Panel */}
                    <div className="space-y-6">
                        
                        {!submitted ? (
                            <GlassCard className="animate-in fade-in slide-in-from-left-4 duration-500">
                                <h2 className="text-2xl font-bold mb-2">Create Request</h2>
                                <p className="text-sm text-gray-500 mb-6">
                                    Click on the map to select pickup and drop locations.
                                </p>
                                
                                <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 mb-6 flex items-center gap-2 text-blue-800 text-sm">
                                    <Info size={16} />
                                    <span>Status: <strong>{locStatus}</strong></span>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1 ml-1 text-gray-600">Weight (kg)</label>
                                            <GlassInput 
                                                type="number" 
                                                min="0.1" 
                                                step="0.1" 
                                                value={formData.weight}
                                                onChange={e => setFormData({...formData, weight: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 ml-1 text-gray-600">Date</label>
                                            <GlassInput type="date" onChange={e => setFormData({...formData, date: e.target.value})} />
                                        </div>
                                    </div>

                                    {/* Cost Breakdown */}
                                    {calcResult && (
                                        <div className="mt-6 p-4 bg-white/40 rounded-xl border border-white/60">
                                            <h3 className="font-semibold text-gray-700 mb-3">Cost Breakdown</h3>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-500">Distance</span>
                                                <span className="font-medium">{calcResult.distance} km</span>
                                            </div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-500">Weight Tier</span>
                                                <span className="font-medium">{parseFloat(formData.weight) > 5 ? '> 5kg (Heavy)' : '<= 5kg (Light)'}</span>
                                            </div>
                                            <div className="h-px bg-gray-300 my-2" />
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-gray-700">Total Price</span>
                                                <span className="text-2xl font-bold text-blue-600">₹{calcResult.price}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-2 text-center">
                                                (Fixed ₹45 + ₹0.5/km, with weight multipliers: 1x &lt;100g, 1.5x 101g-2kg, 2x 2-5kg)
                                            </p>
                                        </div>
                                    )}

                                    {error && (
                                        <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-xl text-sm">
                                            <strong>Error:</strong> {error}
                                        </div>
                                    )}

                                    <GlassButton 
                                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed" 
                                        type="submit"
                                        disabled={!locations.pickup || !locations.drop || submitting}
                                    >
                                        {submitting ? 'Submitting...' : 'List Parcel'}
                                    </GlassButton>
                                </form>
                            </GlassCard>
                        ) : (
                            <GlassCard className="text-center py-10">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                                    <Package size={40} />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Request Listed!</h2>
                                <p className="text-gray-600 mb-6">
                                    Your parcel has been listed in the marketplace.
                                    <br/>Travelers in your area will see it shortly.
                                </p>
                                <GlassButton 
                                    className="bg-gray-100 text-gray-800 hover:bg-gray-200" 
                                    onClick={() => {
                                        setSubmitted(false);
                                        setLocStatus('Select Pickup on Map');
                                        setLocations({ pickup: null, drop: null });
                                        setCalcResult(null);
                                        setError(null);
                                    }}
                                >
                                    Submit Another
                                </GlassButton>
                            </GlassCard>
                        )}
                    </div>

                    {/* Right Panel: Map */}
                    <div className="hidden md:block h-[600px]">
                        <Map 
                            zoom={7}
                            center={[10.5, 76.2]}
                            onMapClick={handleMapClick}
                            markers={[
                                locations.pickup ? { position: locations.pickup, popup: "Pickup" } : null,
                                locations.drop ? { position: locations.drop, popup: "Drop" } : null
                            ].filter(Boolean)} 
                        />
                    </div>
                </div>
            </>
        )}
      </div>
    </main>
  );
}