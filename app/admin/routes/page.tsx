'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProtectedRoute from '@/components/ProtectedRoute';

type BusRoute = {
  id: string;
  from: string;
  to: string;
  departure: string;
  price: number;
  seats: number;
};

export default function ManageRoutes() {
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departure, setDeparture] = useState('');
  const [price, setPrice] = useState('');
  const [seats, setSeats] = useState('');

  useEffect(() => {
    const fetchRoutes = async () => {
      const snap = await getDocs(collection(db, 'routes'));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as BusRoute[];
      setRoutes(list);
    };
    fetchRoutes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'routes'), {
      from,
      to,
      departure,
      price: parseFloat(price),
      seats: parseInt(seats),
    });
    // Reset form
    setFrom('');
    setTo('');
    setDeparture('');
    setPrice('');
    setSeats('');
    // Refetch
    const snap = await getDocs(collection(db, 'routes'));
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as BusRoute[];
    setRoutes(list);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this route?')) {
      await deleteDoc(doc(db, 'routes', id));
      setRoutes(routes.filter((r) => r.id !== id));
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="max-w-4xl mx-auto p-6 mt-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700 text-center">
          Manage Bus Routes
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md p-6 rounded-2xl mb-8 border border-indigo-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="From (e.g., Colombo)"
              className="p-2 border border-indigo-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="To (e.g., Kandy)"
              className="p-2 border border-indigo-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Departure (e.g., 08:00 AM)"
              className="p-2 border border-indigo-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Price (LKR)"
              className="p-2 border border-indigo-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Seats Available"
              className="p-2 border border-indigo-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105"
          >
            Add Route
          </button>
        </form>

        <div className="space-y-4">
          {routes.length === 0 ? (
            <p className="text-gray-500 text-center italic">
              No routes added yet. Start by adding a new route above.
            </p>
          ) : (
            routes.map((route) => (
              <div
                key={route.id}
                className="flex justify-between items-center border border-indigo-200 p-4 rounded-lg shadow-sm hover:shadow-md transition bg-white"
              >
                <div className="text-gray-800">
                  <strong className="text-indigo-700">
                    {route.from} → {route.to}
                  </strong>{' '}
                  | {route.departure} | LKR {route.price} | {route.seats} seats
                </div>
                <button
                  onClick={() => handleDelete(route.id)}
                  className="text-red-600 font-medium hover:text-red-800 transition"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
