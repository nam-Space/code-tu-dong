'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Medal, User as UserIcon, Flame, Target } from 'lucide-react';
import api from '@/lib/api';

export default function LeaderboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/submissions/leaderboard');
        setUsers(res.data);
      } catch (error) {
        console.error('Failed to fetch leaderboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="h-[calc(100vh-64px)] flex items-center justify-center">Loading...</div>;

  const top3 = users.slice(0, 3);
  const others = users.slice(3);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black mb-4 tracking-tighter italic">HALL OF FAME</h1>
        <p className="text-gray-500 text-lg">Celebrating the top problem solvers of KU_OJ</p>
      </div>

      {/* Top 3 Podium */}
      <div className="flex flex-col md:flex-row items-end justify-center gap-8 mb-20 px-4">
        {/* 2nd Place */}
        {top3[1] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 max-w-[280px] w-full text-center"
          >
            <div className="mb-4 relative inline-block">
              <div className="w-24 h-24 rounded-full bg-slate-400/20 border-4 border-slate-400 p-1">
                <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center overflow-hidden">
                   <UserIcon size={40} className="text-slate-400" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-slate-400 text-black flex items-center justify-center font-bold text-xl">
                2
              </div>
            </div>
            <h3 className="text-xl font-bold mb-1">{top3[1].name}</h3>
            <p className="text-slate-400 text-sm font-mono mb-4">@{top3[1].username}</p>
            <div className="bg-slate-400/10 rounded-2xl py-3 border border-slate-400/20">
              <span className="text-2xl font-black text-slate-400">{top3[1].solvedCount}</span>
              <span className="text-xs font-bold text-gray-500 ml-2 uppercase">Solved</span>
            </div>
          </motion.div>
        )}

        {/* 1st Place */}
        {top3[0] && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.9 }}
            animate={{ opacity: 1, y: -40, scale: 1.1 }}
            className="flex-1 max-w-[320px] w-full text-center z-10"
          >
            <div className="mb-6 relative inline-block">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-yellow-500 animate-bounce">
                <Trophy size={48} />
              </div>
              <div className="w-32 h-32 rounded-full bg-yellow-500/20 border-4 border-yellow-500 p-1 shadow-[0_0_50px_-12px_rgba(234,179,8,0.5)]">
                <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center overflow-hidden">
                   <UserIcon size={56} className="text-yellow-500" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-yellow-500 text-black flex items-center justify-center font-black text-2xl">
                1
              </div>
            </div>
            <h3 className="text-2xl font-black mb-1 text-white">{top3[0].name}</h3>
            <p className="text-yellow-500 text-sm font-mono mb-6 italic">Master Coder</p>
            <div className="bg-yellow-500/10 rounded-2xl py-4 border border-yellow-500/30">
              <span className="text-4xl font-black text-yellow-500">{top3[0].solvedCount}</span>
              <span className="text-xs font-bold text-yellow-500/50 ml-2 uppercase">Solved</span>
            </div>
          </motion.div>
        )}

        {/* 3rd Place */}
        {top3[2] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 max-w-[280px] w-full text-center"
          >
            <div className="mb-4 relative inline-block">
              <div className="w-24 h-24 rounded-full bg-orange-700/20 border-4 border-orange-700 p-1">
                <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center overflow-hidden">
                   <UserIcon size={40} className="text-orange-700" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-orange-700 text-white flex items-center justify-center font-bold text-xl">
                3
              </div>
            </div>
            <h3 className="text-xl font-bold mb-1">{top3[2].name}</h3>
            <p className="text-orange-700 text-sm font-mono mb-4">@{top3[2].username}</p>
            <div className="bg-orange-700/10 rounded-2xl py-3 border border-orange-700/20">
              <span className="text-2xl font-black text-orange-700">{top3[2].solvedCount}</span>
              <span className="text-xs font-bold text-gray-500 ml-2 uppercase">Solved</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Others Table */}
      <div className="max-w-4xl mx-auto bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm">
        <div className="px-8 py-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-xs text-gray-400">
            <Award size={16} className="text-blue-500" />
            Remaining Contenders
          </div>
          <div className="text-xs text-gray-600 font-mono">Rankings update every submission</div>
        </div>
        <table className="w-full text-left border-collapse">
          <tbody>
            {others.map((user, i) => (
              <tr key={user.id} className="group hover:bg-white/[0.02] border-b border-white/5 transition-colors">
                <td className="px-8 py-6 w-20 font-black text-2xl text-gray-700 group-hover:text-gray-500 transition-colors">
                  {i + 4}
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-all">
                      <UserIcon size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-gray-300 group-hover:text-white transition-colors">{user.name}</div>
                      <div className="text-xs font-mono text-gray-500">@{user.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="inline-flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-black text-gray-400 group-hover:text-white transition-colors">
                        {user.solvedCount}
                      </div>
                      <div className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">Solved Problems</div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-700 group-hover:text-blue-500/20 transition-colors">
                      <Target size={20} />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
