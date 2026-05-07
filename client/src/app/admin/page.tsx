'use client';

import { motion } from 'framer-motion';
import { Trophy, Code2, Users, LayoutDashboard, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Problems', value: '42', icon: Code2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Active Contests', value: '12', icon: Trophy, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Registered Users', value: '1,234', icon: Users, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Total Submissions', value: '15.2k', icon: LayoutDashboard, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tight mb-2">Admin Dashboard</h1>
        <p className="text-gray-500">Manage your system, contests, and problems.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-3xl bg-white/5 border border-white/10"
          >
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <div className="text-3xl font-black mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-gray-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AdminCard
          title="Contest Management"
          description="Create, edit, and manage upcoming or ongoing contests."
          href="/admin/contests"
          icon={Trophy}
          color="bg-purple-600"
        />
        <AdminCard
          title="Problem Bank"
          description="Build your library of coding challenges with Markdown support."
          href="/admin/problems"
          icon={Code2}
          color="bg-blue-600"
        />
      </div>
    </div>
  );
}

function AdminCard({ title, description, href, icon: Icon, color }: any) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all relative overflow-hidden"
      >
        <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-6 shadow-lg shadow-black/20`}>
              <Icon size={24} className="text-white" />
            </div>
            <h3 className="text-2xl font-black mb-2">{title}</h3>
            <p className="text-gray-500 leading-relaxed max-w-sm">{description}</p>
          </div>
          <div className="p-3 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
            <ChevronRight size={20} className="text-gray-400" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
