'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trophy, Code2, LayoutDashboard, User, LogOut, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    setIsLoggedIn(!!token);
    if (userStr) {
      const user = JSON.parse(userStr);
      setIsAdmin(user.role === 'ADMIN');
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Code2 className="text-white" size={18} />
            </div>
            <span className="font-black text-xl tracking-tighter">KU_OJ</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/problems" active={pathname.startsWith('/problems')}>
              <Code2 size={16} /> Problems
            </NavLink>
            <NavLink href="/submissions" active={pathname.startsWith('/submissions')}>
              <LayoutDashboard size={16} /> Submissions
            </NavLink>
            <NavLink href="/leaderboard" active={pathname === '/leaderboard'}>
              <Trophy size={16} /> Leaderboard
            </NavLink>
            <NavLink href="/contests" active={pathname.startsWith('/contests')}>
              <Trophy size={16} /> Contests
            </NavLink>
            {isAdmin && (
              <NavLink href="/admin" active={pathname.startsWith('/admin')}>
                <Settings size={16} /> Admin
              </NavLink>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link href="/profile" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <User size={16} className="text-gray-400" />
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-bold text-gray-500 hover:text-white transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-bold text-gray-500 hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/register" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold transition-all">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 text-sm font-bold transition-colors relative ${
        active ? 'text-white' : 'text-gray-500 hover:text-gray-300'
      }`}
    >
      {children}
      {active && (
        <motion.div
          layoutId="nav-active"
          className="absolute -bottom-[22px] left-0 right-0 h-0.5 bg-blue-500"
        />
      )}
    </Link>
  );
}
