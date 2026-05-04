'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('passenger');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setEmail(user.email || '');
        setDisplayName(user.displayName || '');
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setRole(userData.role || 'passenger');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    setSaving(true);
    setMessage(null);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not logged in');

      await updateProfile(currentUser, { displayName });
      await updateDoc(doc(db, 'users', currentUser.uid), { name: displayName });

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="spinner spinner-lg border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-2xl mx-auto animate-fade-in">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500 text-white mb-4 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">My Profile</h1>
            <p className="text-gray-600 text-lg">Manage your account details</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-8 transition-all hover-lift">
            {/* Success/Error Message */}
            {message && (
              <div
                className={`mb-6 p-4 rounded-xl text-center font-medium animate-fade-in-down transition-all ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-800 border-2 border-green-500'
                    : 'bg-red-100 text-red-800 border-2 border-red-500'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {message.type === 'success' ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {message.text}
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {message.text}
                    </>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              {/* Full Name */}
              <div className="transition-all">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  👤 Full Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email */}
              <div className="transition-all">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  📧 Email Address
                </label>
                <div className="px-4 py-3 bg-gray-100 rounded-xl border-2 border-gray-300 text-gray-700 font-medium">
                  {email}
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Your email cannot be changed for security reasons
                </p>
              </div>

              {/* Account Type */}
              <div className="transition-all">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  🎫 Account Type
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-all hover-scale ${
                      role === 'admin' || email === 'admin@bus.lk'
                        ? 'bg-blue-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    {role === 'admin' || email === 'admin@bus.lk' ? 'Administrator' : 'Passenger'}
                  </span>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg shadow-lg transition-all duration-300 ${
                    saving
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 hover-lift'
                  }`}
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="spinner spinner-sm border-white"></span>
                      Saving Changes...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Account Information
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Your profile information is stored securely in our database</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Changes to your name will be reflected in all future bookings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Contact support if you need to update your email address</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
