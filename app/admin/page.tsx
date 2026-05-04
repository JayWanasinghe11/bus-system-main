'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 border-b border-gray-200 pb-8">
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-extrabold text-indigo-900 mb-2">
                System Administrator
              </h1>
              <p className="text-gray-500 text-lg">
                Manage bus routes, user roles, and reservation records.
              </p>
            </div>
            <div className="mt-4 md:mt-0 bg-indigo-100 px-4 py-2 rounded-lg text-indigo-700 font-semibold text-sm">
              Role: System Super Admin
            </div>
          </div>

          {/* Quick Stats Summary (Optional Visual) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <QuickStat label="Active Routes" value="12" color="bg-blue-50 text-blue-700" />
            <QuickStat label="Total Bookings" value="142" color="bg-purple-50 text-purple-700" />
            <QuickStat label="Registered Users" value="84" color="bg-green-50 text-green-700" />
            <QuickStat label="Today's Revenue" value="LKR 45k" color="bg-orange-50 text-orange-700" />
          </div>

          {/* Management Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <DashboardCard
              href="/admin/routes"
              title="Manage Bus Routes"
              desc="Add, update, or remove available bus routes and timing."
              color="from-blue-600 to-indigo-700"
              icon="🚌"
            />
            <DashboardCard
              href="/admin/users"
              title="Manage Users"
              desc="View all users, update roles, or manage account status."
              color="from-emerald-500 to-teal-600"
              icon="👥"
            />
            <DashboardCard
              href="/admin/bookings"
              title="View All Bookings"
              desc="Track, modify, or cancel bookings across all routes."
              color="from-violet-500 to-purple-600"
              icon="📑"
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

/* ---------- Reusable Components ---------- */

function QuickStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={`${color} p-4 rounded-2xl border border-white shadow-sm`}>
      <p className="text-xs font-bold uppercase tracking-wider opacity-70">{label}</p>
      <p className="text-xl font-black mt-1">{value}</p>
    </div>
  );
}

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
      className="group relative block rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
    >
      <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${color}`} />
      <div className="p-8 flex flex-col items-center text-center space-y-4">
        <div
          className={`w-20 h-20 flex items-center justify-center text-4xl bg-gradient-to-br ${color} text-white rounded-2xl shadow-lg transform group-hover:rotate-6 transition-transform`}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{title}</h3>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">{desc}</p>
        </div>
        <div className="pt-2 text-indigo-600 font-bold text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Open Management <span>→</span>
        </div>
      </div>
    </Link>
  );
}