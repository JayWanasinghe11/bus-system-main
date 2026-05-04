// app/admin/users/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import ProtectedRoute from '@/components/ProtectedRoute';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: { seconds: number };
};

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, 'users'));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as User[];
      setUsers(list);
    };
    fetchUsers();
  }, []);

  const handleDelete = async (user: User) => {
    if (!confirm(`Delete user ${user.email}? This cannot be undone.`)) return;

    setDeletingId(user.id);
    setError(null);

    try {
      const authUser = auth.currentUser;
      if (authUser?.email === user.email) {
        alert('You cannot delete your own account while logged in.');
        return;
      }

      await deleteDoc(doc(db, 'users', user.id));
      setUsers(users.filter(u => u.id !== user.id));
    } catch (err: any) {
      setError('Failed to delete user. Try again.');
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="max-w-6xl mx-auto p-6 mt-8 bg-gray-50 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Manage Users</h1>

        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded mb-4 shadow">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="border-b p-3 text-left text-gray-700">Name</th>
                <th className="border-b p-3 text-left text-gray-700">Email</th>
                <th className="border-b p-3 text-left text-gray-700">Role</th>
                <th className="border-b p-3 text-left text-gray-700">Joined</th>
                <th className="border-b p-3 text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="border-b p-3 text-gray-800">{user.name}</td>
                  <td className="border-b p-3 text-gray-800">{user.email}</td>
                  <td className="border-b p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="border-b p-3 text-gray-700">
                    {new Date(user.createdAt.seconds * 1000).toLocaleDateString()}
                  </td>
                  <td className="border-b p-3">
                    <button
                      onClick={() => handleDelete(user)}
                      disabled={deletingId === user.id}
                      className={`text-sm px-3 py-1 rounded-lg font-medium transition-colors ${
                        deletingId === user.id
                          ? 'bg-gray-300 cursor-not-allowed text-gray-700'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {deletingId === user.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}
