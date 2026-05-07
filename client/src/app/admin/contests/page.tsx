'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Plus, Edit2, Trash2, Calendar, Users, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { format } from 'date-fns';

export default function AdminContests() {
  const [contests, setContests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContests = async () => {
    try {
      const res = await api.get('/contests');
      setContests(res.data);
    } catch (error) {
      console.error('Failed to fetch contests', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contest?')) return;
    try {
      await api.delete(`/contests/${id}`);
      setContests(contests.filter(c => c.id !== id));
    } catch (error) {
      alert('Failed to delete contest');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Manage Contests</h1>
          <p className="text-gray-500">Create and schedule competitions.</p>
        </div>
        <Link 
          href="/admin/contests/new"
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus size={20} /> Create Contest
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {contests.map((contest, i) => (
            <motion.div
              key={contest.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <Trophy size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{contest.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {format(new Date(contest.startTime), 'MMM d, HH:mm')} - {format(new Date(contest.endTime), 'MMM d, HH:mm')}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users size={14} />
                      {contest.creator?.name || 'Admin'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link 
                  href={`/admin/contests/edit/${contest.id}`}
                  className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Edit2 size={18} />
                </Link>
                <button 
                  onClick={() => handleDelete(contest.id)}
                  className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
          {contests.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <Trophy size={48} className="mx-auto text-gray-700 mb-4" />
              <p className="text-gray-500 font-bold">No contests found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
