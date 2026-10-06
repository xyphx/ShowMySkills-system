import { useState } from 'react';
import Link from 'next/link';

export default function NavPanel({ mainItems, accountItems }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMobileMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Menu Icon Button (Visible on mobile screens, positioned top-right) */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg bg-[#459E93] text-white focus:outline-none shadow-md"
          aria-label="Toggle Navigation"
        >
          {isOpen ? (
            // Close (X) Icon
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger Icon
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>

      {/* Navigation Panel Container */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-[#459E93] text-white flex flex-col justify-between p-6 transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:min-h-screen
          ${isOpen ? 'translate-x-0 w-full' : '-translate-x-full'}
        `}
      >
        {/* Top Section: Logo & Main Menu Items */}
        <div className="flex flex-col space-y-8">
          {/* Brand Logo Header matching the design */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#459E93] font-bold shadow">
              S
            </div>
            <span className="text-xl font-bold tracking-wide">ShowMySkills</span>
          </div>

          {/* Main Navigation Links */}
          <ul className="flex flex-col space-y-2">
            {mainItems.map(({ label, href, active }, index) => (
              <li key={index}>
                <Link
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                    active
                      ? 'bg-white text-[#459E93] shadow-sm'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Section: Account Items & Upgrade Box */}
        <div className="flex flex-col space-y-6">
          {/* Optional Upgrade Box seen in the image for the dashboard context */}
          <div className="bg-white text-slate-800 p-4 rounded-2xl shadow-sm flex flex-col space-y-2">
            <p className="font-semibold text-sm">Upgrade Plan</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              To explore more opportunities, more filters upgrade your plan
            </p>
            <button className="mt-2 w-full bg-[#459E93] text-white text-xs font-semibold py-2 rounded-xl hover:opacity-90 transition">
              Upgrade Plan
            </button>
          </div>

          {/* Account/Footer Links (Profile, Settings, Help) */}
          <ul className="flex flex-col space-y-2 border-t border-white/20 pt-4">
            {accountItems.map(({ label, href }, index) => (
              <li key={index}>
                <Link
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-2.5 rounded-xl font-medium text-white hover:bg-white/10 transition-colors"
                >
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
