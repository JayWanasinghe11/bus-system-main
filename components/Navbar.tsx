'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 font-bold text-xl md:text-2xl text-blue-700 hover:text-blue-800 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="tracking-wide">LankaRide</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <>
                <NavButton href="/" label="Home" isActive={pathname === '/'} />
                <NavButton href="/book" label="Book" isActive={pathname === '/book'} />
                <NavButton href="/bookings" label="My Bookings" isActive={pathname === '/bookings'} />
                <NavButton href="/profile" label="Profile" isActive={pathname === '/profile'} />
                <NavButton href="/help" label="Help" isActive={pathname === '/help'} />

                {user.email === 'admin@gmail.com' && (
                  <NavButton href="/admin" label="Admin" isActive={pathname.startsWith('/admin')} />
                )}

                <div className="ml-4 flex items-center space-x-3">
                  <span className="hidden lg:inline text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    {user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavButton href="/" label="Home" isActive={pathname === '/'} />
                <NavButton href="/help" label="Help" isActive={pathname === '/help'} />
                <NavButton href="/login" label="Login" isActive={pathname === '/login'} />
                <NavButton href="/register" label="Register" isActive={pathname === '/register'} isPrimary />
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-blue-700 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-blue-100 shadow-lg">
          <div className="flex flex-col items-start space-y-1 py-3 px-4">
            {user ? (
              <>
                <MobileLink href="/" label="Home" onClick={toggleMenu} />
                <MobileLink href="/book" label="Book" onClick={toggleMenu} />
                <MobileLink href="/bookings" label="My Bookings" onClick={toggleMenu} />
                <MobileLink href="/profile" label="Profile" onClick={toggleMenu} />
                <MobileLink href="/help" label="Help" onClick={toggleMenu} />
                {user.email === 'admin@gmail.com' && (
                  <MobileLink href="/admin" label="Admin" onClick={toggleMenu} />
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="w-full text-left py-2 px-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <MobileLink href="/" label="Home" onClick={toggleMenu} />
                <MobileLink href="/help" label="Help" onClick={toggleMenu} />
                <MobileLink href="/login" label="Login" onClick={toggleMenu} />
                <MobileLink href="/register" label="Register" isPrimary onClick={toggleMenu} />
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

/* ---------- Reusable Components ---------- */

function NavButton({
  href,
  label,
  isActive,
  isPrimary = false,
}: {
  href: string;
  label: string;
  isActive: boolean;
  isPrimary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
        isActive
          ? 'bg-blue-100 text-blue-700 font-semibold'
          : isPrimary
          ? 'bg-blue-600 hover:bg-blue-700 text-white font-semibold'
          : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50'
      }`}
    >
      {label}
    </Link>
  );
}

function MobileLink({
  href,
  label,
  onClick,
  isPrimary = false,
}: {
  href: string;
  label: string;
  onClick: () => void;
  isPrimary?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`w-full block py-2 px-3 rounded-md text-sm font-medium transition ${
        isPrimary
          ? 'bg-blue-600 hover:bg-blue-700 text-white font-semibold'
          : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50'
      }`}
    >
      {label}
    </Link>
  );
}
