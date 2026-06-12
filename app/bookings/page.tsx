'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  writeBatch,
  getDoc,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Booking {
  id: string;
  routeId: string;
  from: string;
  to: string;
  departure: string;
  price: number;
  bookedAt: { seconds: number } | Date;
  status: string;
  transmission?: string;
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<Booking | null>(null);

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Bookings
  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'bookings'), where('userId', '==', user.uid));
        const snap = await getDocs(q);
        
        if (!isMounted) return;

        const list: Booking[] = [];
        snap.docs.forEach((docSnap) => {
          const data = docSnap.data();
          
          // Basic validation for required fields
          if (
            data.from &&
            data.to &&
            data.departure &&
            typeof data.price === 'number' &&
            data.routeId &&
            data.status
          ) {
            list.push({
              id: docSnap.id,
              routeId: data.routeId,
              from: data.from,
              to: data.to,
              departure: data.departure,
              price: data.price,
              bookedAt: data.bookedAt,
              status: data.status,
              transmission: data.transmission,
            });
          }
        });

        // Sort by date (Newest first)
        list.sort((a, b) => {
          const timeA = a.bookedAt instanceof Date ? a.bookedAt.getTime() : a.bookedAt.seconds * 1000;
          const timeB = b.bookedAt instanceof Date ? b.bookedAt.getTime() : b.bookedAt.seconds * 1000;
          return timeB - timeA;
        });

        setBookings(list);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBookings();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Handle Booking Cancellation
  const handleCancel = async () => {
    if (!confirmCancel) return;

    const targetId = confirmCancel.id;
    setCancellingId(targetId);
    setConfirmCancel(null);

    try {
      const batch = writeBatch(db);
      
      // 1. Update Booking Status
      batch.update(doc(db, 'bookings', targetId), { status: 'cancelled' });

      // 2. Increment Route Seat Count
      const routeRef = doc(db, 'routes', confirmCancel.routeId);
      const routeSnap = await getDoc(routeRef);
      
      if (routeSnap.exists()) {
        const currentSeats = routeSnap.data().seats || 0;
        batch.update(routeRef, { seats: currentSeats + 1 });
      }

      // Commit transaction batch
      await batch.commit();

      // Update local state smoothly
      setBookings((prev) =>
        prev.map((b) => (b.id === targetId ? { ...b, status: 'cancelled' } : b))
      );
    } catch (err) {
      alert('Cancellation failed. Please try again.');
      console.error('Cancel error:', err);
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="spinner spinner-lg border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-800 font-medium">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white py-8 px-4">
        <div className="max-w-4xl mx-auto animate-fade-in">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 text-white mb-4 shadow-lg animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">My Bookings</h1>
            <p className="text-gray-600 text-lg">Manage your bus tickets</p>
          </div>

          {/* Bookings List */}
          {bookings.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md mx-auto border-2 border-gray-200 transition-all hover:scale-105">
                <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-4 transition-all hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-800 text-xl font-semibold mb-2">No bookings yet</p>
                <p className="text-gray-600 text-sm">Your booked tickets will appear here</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden transition-all duration-300 transform hover:scale-102"
                >
                  {/* Status Badge */}
                  <div className={`px-4 py-1.5 transition-all duration-300 ${
                    booking.status === 'confirmed' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold text-xs flex items-center gap-1.5">
                        {booking.status === 'confirmed' ? 'Confirmed' : 'Cancelled'}
                      </span>
                      <span className="text-white text-xs opacity-90">
                        {booking.bookedAt instanceof Date
                          ? booking.bookedAt.toLocaleDateString()
                          : new Date(booking.bookedAt.seconds * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold shadow-md transition-all hover:scale-110">
                          {booking.from.charAt(0)}
                        </div>
                        <h3 className="font-bold text-base text-gray-800">{booking.from}</h3>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 mb-2 ml-10">
                        <span className="font-semibold text-sm">{booking.to}</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-600 ml-10">
                        <div className="flex items-center gap-1">
                          <span>🕗</span>
                          <span>{booking.departure}</span>
                        </div>
                        <div className="flex items-center gap-1 ml-3">
                          <span>⚙️</span>
                          <span>{booking.transmission || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price Badge */}
                    <div className="text-right">
                      <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg inline-block transition-all transform hover:scale-105">
                        <p className="text-xs opacity-90">Price</p>
                        <p className="text-lg font-bold">LKR {booking.price}</p>
                      </div>
                    </div>
                  </div>

                  {/* Cancel Button */}
                  {booking.status === 'confirmed' && (
                    <div className="mt-3 pt-3 border-t border-gray-200 flex justify-end px-4 pb-3">
                      <button
                        onClick={() => setConfirmCancel(booking)}
                        disabled={cancellingId === booking.id}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform ${
                          cancellingId === booking.id
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-red-100 text-red-700 hover:bg-red-200 hover:scale-105 hover:shadow-md'
                        }`}
                      >
                        {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cancel Confirmation Modal */}
        {confirmCancel && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full