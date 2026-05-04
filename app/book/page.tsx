'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  writeBatch,
  onSnapshot,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';

type BusRoute = {
  id: string;
  from: string;
  to: string;
  departure: string;
  price: number;
  seats: number;
};


export default function BookPage() {
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<BusRoute[]>([]);
  const [user, setUser] = useState<any>(null);
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
  const [fromFilter, setFromFilter] = useState('');
  const [toFilter, setToFilter] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Auth guard
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) router.push('/login');
      else setUser(currentUser);
    });
    return () => unsubscribe();
  }, [router]);

  // Real-time route sync
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'routes'), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<BusRoute, 'id'>),
      }));
      setRoutes(list);
    });
    return () => unsub();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = routes;
    if (fromFilter) {
      result = result.filter((r) =>
        r.from.toLowerCase().includes(fromFilter.toLowerCase())
      );
    }
    if (toFilter) {
      result = result.filter((r) =>
        r.to.toLowerCase().includes(toFilter.toLowerCase())
      );
    }
    setFilteredRoutes(result);
  }, [fromFilter, toFilter, routes]);

  const handleBook = async () => {
    if (!user || !selectedRoute) return;

    setIsBooking(true);
    setError(null);

    try {
      const routeRef = doc(db, 'routes', selectedRoute.id);
      const snap = await getDoc(routeRef);
      if (!snap.exists()) throw new Error('Route no longer available');
      const current = snap.data() as BusRoute;

      if (current.seats <= 0) {
        setError('No seats left on this bus.');
        return;
      }

      const batch = writeBatch(db);
      batch.update(routeRef, { seats: current.seats - 1 });
      batch.set(doc(collection(db, 'bookings')), {
        userId: user.uid,
        routeId: selectedRoute.id,
        from: selectedRoute.from,
        to: selectedRoute.to,
        departure: selectedRoute.departure,
        price: selectedRoute.price,
        bookedAt: new Date(),
        status: 'confirmed',
      });

      await batch.commit();
      setSuccess(true);
      setSelectedRoute(null);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err: any) {
      setError(err.message || 'Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const origins = useMemo(() => [...new Set(routes.map(r => r.from))].sort(), [routes]);
  const destinations = useMemo(() => [...new Set(routes.map(r => r.to))].sort(), [routes]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white py-8 px-4">
        <div className="max-w-6xl mx-auto animate-fade-in">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 text-white mb-4 shadow-lg animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">Find Your Bus</h1>
            <p className="text-gray-600 text-lg">Choose from available routes across Sri Lanka</p>
          </div>

          {/* Success Banner */}
          {success && (
            <div className="mb-6 bg-green-100 rounded-xl p-5 border-2 border-green-500 text-center animate-fade-in-down shadow-lg">
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl">🎉</span>
                <div>
                  <p className="text-green-800 font-bold text-lg">Booking confirmed!</p>
                  <p className="text-green-700 text-sm">Check your tickets in <strong>My Bookings</strong></p>
                </div>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="mb-6 bg-red-100 rounded-xl p-5 border-2 border-red-500 animate-fade-in-down shadow-lg">
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl">⚠️</span>
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Search Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 border border-gray-200 hover-lift">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  📍 From
                </label>
                <select
                  value={fromFilter}
                  onChange={(e) => setFromFilter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all font-medium"
                >
                  <option value="">Any origin</option>
                  {origins.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  🎯 To
                </label>
                <select
                  value={toFilter}
                  onChange={(e) => setToFilter(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 transition-all font-medium"
                >
                  <option value="">Any destination</option>
                  {destinations.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFromFilter('');
                    setToFilter('');
                  }}
                  className="w-full py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all hover-scale shadow-md"
                >
                  🔄 Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Routes List */}
          {filteredRoutes.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto border border-gray-200">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-800 text-lg font-semibold">No buses match your search</p>
                <p className="text-gray-600 text-sm mt-2">Try adjusting your filters</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-stagger">
              {filteredRoutes.map((route) => (
                <div
                  key={route.id}
                  onClick={() => setSelectedRoute(route)}
                  className={`bg-white rounded-2xl shadow-lg border-2 cursor-pointer overflow-hidden transition-all duration-300 hover-lift ${
                    selectedRoute?.id === route.id
                      ? 'ring-4 ring-blue-500 shadow-2xl scale-105 border-blue-500'
                      : 'border-gray-200 hover:shadow-xl'
                  }`}
                >
                  <div className="p-6">
                    {/* Route Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold shadow-lg">
                            {route.from.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-xl text-gray-900">
                              {route.from}
                            </h3>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                          <span className="font-semibold">{route.to}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>🕗</span>
                          <span className="font-medium">{route.departure}</span>
                        </div>
                      </div>
                      
                      <div className="bg-green-400 text-white text-lg font-bold px-4 py-2 rounded-xl shadow-lg">
                        LKR{route.price}
                      </div>
                    </div>

                    {/* Route Footer */}
                    <div className="mt-5 pt-5 border-t-2 border-gray-200 flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Seats available</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-3 h-3 rounded-full ${
                            route.seats > 5 ? 'bg-green-500' :
                            route.seats > 0 ? 'bg-yellow-500' : 'bg-red-500'
                          } animate-pulse`}></div>
                          <p className={`text-lg font-bold ${
                            route.seats > 5 ? 'text-green-600' :
                            route.seats > 0 ? 'text-yellow-600' : 
                            'text-red-600'
                          }`}>
                            {route.seats}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        className={`font-semibold py-2 px-6 rounded-xl transition-all shadow-md ${
                          selectedRoute?.id === route.id
                            ? 'bg-blue-600 text-white shadow-lg scale-110'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300 hover-scale'
                        }`}
                      >
                        {selectedRoute?.id === route.id ? '✓ Selected' : 'Select'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking Confirmation Modal */}
        {selectedRoute && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-end md:items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-slide-in-up shadow-2xl border-2 border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Confirm Booking</h2>
                  <button
                    onClick={() => setSelectedRoute(null)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-all hover-scale"
                  >
                    <span className="text-gray-700 text-xl font-bold">×</span>
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-5 mb-6 border-2 border-gray-200 shadow-inner">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="font-bold text-2xl text-gray-900">{selectedRoute.from}</p>
                      <p className="text-gray-600 text-sm mt-1">Departure</p>
                    </div>
                    <div className="text-center px-4">
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-2 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-600 font-medium">Bus</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-2xl text-gray-900">{selectedRoute.to}</p>
                      <p className="text-gray-600 text-sm mt-1">{selectedRoute.departure}</p>
                    </div>
                  </div>
                  
                  <div className="mt-5 pt-5 border-t-2 border-gray-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Price</span>
                      <span className="font-bold text-xl text-green-700">LKR {selectedRoute.price}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Seats available</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          selectedRoute.seats > 0 ? 'bg-green-500' : 'bg-red-500'
                        } animate-pulse`}></div>
                        <span className={`font-bold text-lg ${
                          selectedRoute.seats > 0 ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {selectedRoute.seats}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedRoute(null)}
                    className="flex-1 py-4 border-2 border-gray-400 rounded-xl text-gray-800 font-semibold hover:bg-gray-100 transition-all hover-scale shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBook}
                    disabled={isBooking || selectedRoute.seats <= 0}
                    className={`flex-1 py-4 rounded-xl font-semibold text-white shadow-lg transition-all ${
                      isBooking
                        ? 'bg-gray-400 cursor-not-allowed'
                        : selectedRoute.seats <= 0
                        ? 'bg-red-400 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600 hover-scale'
                    }`}
                  >
                    {isBooking ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="spinner spinner-sm border-white"></span>
                        Booking...
                      </span>
                    ) : (
                      '✓ Confirm & Pay'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
