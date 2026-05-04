import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-blue-700 mb-3">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Manage all system data — routes, users, and bookings — from one place.
            </p>
          </div>


          {/* Management Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <DashboardCard
              href="/admin/routes"
              title="Manage Bus Routes"
              desc="Add, update, or remove available bus routes."
              color="from-blue-500 to-blue-600"
              icon="🚌"
            />
            <DashboardCard
              href="/admin/users"
              title="Manage Users"
              desc="View all users, update roles, or remove inactive accounts."
              color="from-green-500 to-green-600"
              icon="👥"
            />
            <DashboardCard
              href="/admin/bookings"
              title="View All Bookings"
              desc="Track, modify, or cancel bookings across all routes."
              color="from-purple-500 to-purple-600"
              icon="📑"
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

/* ---------- Reusable Dashboard Card ---------- */
function DashboardCard({
  href,
  title,
  desc,
  color,
  icon,
}: {
  href: string;
  title: string;
  desc: string;
  color: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-xl bg-white border border-blue-100 shadow-sm hover:shadow-md transition transform hover:-translate-y-1`}
    >
      <div className="p-6 flex flex-col items-center text-center space-y-3">
        <div
          className={`w-16 h-16 flex items-center justify-center text-3xl bg-gradient-to-br ${color} text-white rounded-full shadow-md`}
        >
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-blue-700">{title}</h3>
        <p className="text-gray-500 text-sm">{desc}</p>
      </div>
    </Link>
  );
}
