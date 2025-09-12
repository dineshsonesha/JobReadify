import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { SignIn, useUser } from '@clerk/clerk-react';

export default function Layout() {
  const navigate = useNavigate();
  const [siderbar, setSidebar] = useState(false);
  const { user } = useUser();

  return user ? (
    <div className='flex flex-col items-start justify-start h-screen'>
      <nav className='w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-200'>
        <h1
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-2xl sm:text-2xl font-bold bg-gradient-to-br from-black to-purple-300 text-transparent bg-clip-text select-none"
      >
        <img src="/resume_icon.png" alt="Logo" className="w-8 h-8" />
        JobReadify
      </h1>
        {
          siderbar ? <X onClick={() => { setSidebar(false) }} className='w-6 h-6 text-gray-600 sm:hidden' />
            : <Menu onClick={() => { setSidebar(true) }} className='w-6 h-6 text-gray-600 sm:hidden' />
        }
      </nav>
      <div className='flex-1 w-full flex h-[calc(100vh-64px)]'>
        <Sidebar sidebar={siderbar} setSidebar={setSidebar} />
        <div className='flex-1 bg-[#F4F7FB] overflow-y-auto'>
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div className='flex items-center justify-center h-screen'>
      <SignIn />
    </div>
  )
}
