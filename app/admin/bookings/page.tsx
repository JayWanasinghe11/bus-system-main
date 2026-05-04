// app/admin/bookings/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProtectedRoute from '@/components/ProtectedRoute';

type Booking = {
  id: string;
  userId: string;
  routeId: string;
  from?: string;
  to?: string;
  price?: number;
  bookedAt: { seconds: number };
  status: string;
};

export default function ViewBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const snap = await getDocs(collection(db, 'bookings'));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Booking[];
      setBookings(list);
    };
    fetchBookings();
  }, []);

  const handleDelete = async (booking: Booking) => {
    if (!confirm('Delete this booking and free the seat?')) return;

    setDeletingId(booking.id);
    setError(null);

    try {
      const batch = writeBatch(db);

      // 1. Delete booking
      batch.delete(doc(db, 'bookings', booking.id));

      // 2. Re-increase seat count (if routeId exists)
      if (booking.routeId) {
        const routeRef = doc(db, 'routes', booking.routeId);
        const routeSnap = await getDoc(routeRef);
        if (routeSnap.exists()) {
          const currentSeats = routeSnap.data().seats || 0;
          batch.update(routeRef, { seats: currentSeats + 1 });
        }
      }

      await batch.commit();
      setBookings(bookings.filter(b => b.id !== booking.id));
    } catch (err: any) {
      setError('Failed to delete booking.');
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="max-w-5xl mx-auto p-6 mt-8 bg-gray-50 rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">All Bookings</h1>

        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded mb-4 shadow">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="border border-gray-200 rounded-lg p-4 bg-white shadow hover:shadow-md transition duration-200"
            >
              <div className="flex flex-col md:flex-row justify-between">
                <div className="text-gray-700 space-y-1">
                  <p><span className="font-semibold">User ID:</span> {booking.userId}</p>
                  <p>
                    <span className="font-semibold">Route:</span> 
                    <span className="text-blue-600 font-medium"> {booking.from} → {booking.to}</span> (ID: {booking.routeId})
                  </p>
                  <p><span className="font-semibold">Price:</span> <span className="text-green-600 font-medium">LKR {booking.price}</span></p>
                  <p>
                    <span className="font-semibold">Status:</span> 
                    <span className={booking.status === 'confirmed' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                      {booking.status}
                    </span>
                  </p>
                  <p><span className="font-semibold">Booked:</span> {new Date(booking.bookedAt.seconds * 1000).toLocaleString()}</p>
                </div>
                <div className="mt-3 md:mt-0 flex items-start">
                  <button
                    onClick={() => handleDelete(booking)}
                    disabled={deletingId === booking.id}
                    className={`px-4 py-2 text-sm rounded-lg font-semibold transition duration-200 ${
                      deletingId === booking.id
                        ? 'bg-gray-300 cursor-not-allowed text-gray-700'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {deletingId === booking.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
//Developed by: Jayamantha Wanasinghe