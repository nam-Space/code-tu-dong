'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Clock, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { format } from 'date-fns';

export default function ContestsPage() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchContests();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Available Contests</h1>
          <p className="text-gray-400 text-lg">Test your skills against the best programmers</p>
        </div>
        <div className="flex gap-2 p-1 glass-morphism rounded-xl">
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-sm font-medium">Ongoing</button>
          <button className="px-4 py-2 rounded-lg text-gray-400 text-sm font-medium hover:text-white transition-colors">Past</button>
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="premium-card animate-pulse h-64 bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contests.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <Trophy size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No contests available at the moment.</p>
            </div>
          )}
          {contests.map((contest, index) => (
            <motion.div
              key={contest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="premium-card group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-xl bg-blue-600/10 text-blue-500">
                  <Trophy size={24} />
                </div>
                <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider">
                  Live
                </div>
              </div>

              <h3 className="text-xl font-bold mb-4 group-hover:text-blue-400 transition-colors">
                {contest.title}
              </h3>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar size={16} />
                  {format(new Date(contest.startTime), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock size={16} />
                  {format(new Date(contest.startTime), 'HH:mm')} - {format(new Date(contest.endTime), 'HH:mm')}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <User size={16} />
                  By {contest.creator?.name || 'Admin'}
                </div>
              </div>

              <Link
                href={`/contests/${contest.id}`}
                className="w-full py-3 bg-white/5 group-hover:bg-blue-600 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
              >
                Enter Contest <ArrowRight size={18} />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
