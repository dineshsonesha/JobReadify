import { Protect, useClerk, useUser } from '@clerk/clerk-react';
import { FileText, Hash, House, LogOut, Upload } from 'lucide-react'; // 👈 Added Upload icon
import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/ai/dashboard', label: 'Dashboard', Icon: House },
  { to: '/ai/resume-builder', label: 'Resume Builder', Icon: FileText },
  { to: '/ai/skill-growth', label: 'Skill Growth', Icon: Hash },
  { to: '/ai/review-resume', label: 'Review Resume', Icon: FileText },
  { to: '/ai/update-resume', label: 'Update Resume', Icon: Upload }, // 👈 New menu item
];

export default function Sidebar({ sidebar, setSidebar }) {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <div
      className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between max-sm:absolute top-14 bottom-0 z-50 transform transition-all duration-300 ease-in-out ${
        sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'
      }`}
    >
      {/* Top - User Info & Navigation */}
      <div className="my-7 w-full flex flex-col items-center">
        <img
          src={user.imageUrl}
          alt="User avatar"
          className="w-16 h-16 rounded-full border border-gray-300"
        />
        <h1 className="mt-2 text-center text-lg font-semibold">{user.fullName}</h1>
        <p className="text-sm text-gray-500 mb-4">
          <Protect plan="premium" fallback="Free">Premium</Protect> Plan
        </p>

        {/* Navigation */}
        <nav className="w-full px-4 mt-4 space-y-2">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition ${
                  isActive
                    ? 'bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom - Profile & Logout */}
      <div className="w-full border-t border-gray-200 p-4 flex items-center gap-3">
        <div onClick={openUserProfile} className="flex items-center gap-2 cursor-pointer">
          <img
            src={user.imageUrl}
            className="w-10 h-10 rounded-full border border-gray-300"
            alt="User avatar"
          />
          <div className="flex flex-col">
            <h2 className="text-sm font-medium">{user.fullName}</h2>
            <p className="text-xs text-gray-500">
              <Protect plan="premium" fallback="Free">Premium</Protect>
            </p>
          </div>
        </div>
        <LogOut
          onClick={signOut}
          className="ml-auto w-5 h-5 text-gray-400 hover:text-gray-700 transition cursor-pointer"
        />
      </div>
    </div>
  );
}
