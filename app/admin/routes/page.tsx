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
  const [loading, setLoading] = useState(true); // Added loading state
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departure, setDeparture] = useState('');
  const [price, setPrice] = useState('');
  const [seats, setSeats] = useState('');

  // Fetching logic wrapped in a reusable function
  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, 'routes'));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as BusRoute[];
      setRoutes(list);
    } catch (error) {
      console.error("Error fetching routes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newRoute = {
        from,
        to,
        departure,
        price: parseFloat(price),
        seats: parseInt(seats),
      };
      
      const docRef = await addDoc(collection(db, 'routes'), newRoute);
      
      // Update state locally for instant UI feedback
      setRoutes([...routes, { id: docRef.id, ...newRoute }]);
      
      // Reset form
      setFrom('');
      setTo('');
      setDeparture('');
      setPrice('');
      setSeats('');
    } catch (error) {
      alert("Failed to add route. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this route?')) {
      try {
        await deleteDoc(doc(db, 'routes', id));
        setRoutes(routes.filter((r) => r.id !== id));
      } catch (error) {
        alert("Error deleting route.");
      }
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="max-w-4xl mx-auto p-6 mt-8 bg-gray-50 min-h-screen">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-indigo-800 text-center">
            Admin Dashboard: Route Management
          </h1>
          <p className="text-center text-gray-600 mt-2">Add, update, or remove bus travel schedules</p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg p-8 rounded-3xl mb-10 border border-indigo-50 transition-all"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1 ml-1">Departure From</label>
              <input
                type="text"
                placeholder="e.g., Colombo"
                className="p-3 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1 ml-1">Destination To</label>
              <input
                type="text"
                placeholder="e.g., Kandy"
                className="p-3 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1 ml-1">Time</label>
              <input
                type="text"
                placeholder="e.g., 08:30 AM"
                className="p-3 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1 ml-1">Price (LKR)</label>
                <input
                  type="number"
                  placeholder="2500"
                  className="p-3 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1 ml-1">Seats</label>
                <input
                  type="number"
                  placeholder="40"
                  className="p-3 border border-indigo-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="mt-8 w-full md:w-auto bg-indigo-600 text-white px-10 py-3 rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-indigo-200 transition-all transform hover:-translate-y-1 font-bold"
          >
            + Create New Route
          </button>
        </form>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4 ml-1">Existing Routes</h2>
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-700 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading active routes...</p>
            </div>
          ) : routes.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-dashed border-gray-300 text-center">
              <p className="text-gray-400 italic">No routes found in the database.</p>
            </div>
          ) : (
            routes.map((route) => (
              <div
                key={route.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center border border-indigo-50 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all bg-white group"
              >
                <div className="text-gray-800">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-indigo-700">{route.from}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-lg font-bold text-indigo-700">{route.to}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 text-sm text-gray-500 font-medium">
                    <span>🕒 {route.departure}</span>
                    <span>💰 LKR {route.price.toLocaleString()}</span>
                    <span>💺 {route.seats} Seats Available</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(route.id)}
                  className="mt-4 sm:mt-0 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-colors border border-red-100"
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