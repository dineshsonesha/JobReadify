import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <div className="fixed z-50 w-full backdrop-blur-2xl flex justify-between items-center px-4 py-3 sm:px-20 xl:px-32 cursor-pointer border-b border-gray-200/50">
      <h1
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-2xl sm:text-4xl font-bold bg-gradient-to-br from-black to-purple-300 text-transparent bg-clip-text select-none"
      >
        {/* Use PNG icon here */}
        <img src="/resume_icon.png" alt="Logo" className="w-8 h-8" />
        JobReadify
      </h1>

      {user ? (
        <UserButton />
      ) : (
        <button
          onClick={openSignIn}
          className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-purple-700 text-white px-10 py-2.5"
        >
          Get Started <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
