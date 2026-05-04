'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-12 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4 transform transition-all duration-500 hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#00E5FF] hover:text-[#0099FF] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00E5FF] to-[#0099FF]">
                LankaRide
              </span>
            </div>
            <p className="text-[#A0EFFF] text-sm">
              Sri Lanka’s trusted bus ticket booking platform. Safe, fast, and reliable.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#00E5FF]">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/book">Book Ticket</FooterLink>
              <FooterLink href="/bookings">My Bookings</FooterLink>
              <FooterLink href="/help">Help Center</FooterLink>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#00E5FF]">Legal</h3>
            <ul className="space-y-2">
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/refund">Refund Policy</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#00E5FF]">Contact Us</h3>
            <address className="text-[#A0EFFF] not-italic text-sm space-y-2">
              <p className="transition-transform hover:-translate-y-1 hover:text-[#00E5FF]">📞 +94 11 234 5678</p>
              <p className="transition-transform hover:-translate-y-1 hover:text-[#00E5FF]">✉️ support@lankaride.lk</p>
              <p className="transition-transform hover:-translate-y-1 hover:text-[#00E5FF]">📍 Colombo 07, Sri Lanka</p>
            </address>
          </div>
        </div>

        <div className="border-t border-[#00E5FF]/30 mt-8 pt-6 text-center text-[#A0EFFF] text-sm transition-all hover:text-[#00E5FF]">
          <p>© {new Date().getFullYear()} LankaRide. All rights reserved. Made with ❤️ in Sri Lanka.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a
        href={href}
        className="text-[#A0EFFF] hover:text-[#00E5FF] transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 block"
      >
        {children}
      </a>
    </li>
  );
}
