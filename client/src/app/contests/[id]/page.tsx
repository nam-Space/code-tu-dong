'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Clock, User, Code2, ArrowRight, ChevronLeft, HardDrive } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function ContestDetailPage() {
  const { id } = useParams();
  const [contest, setContest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await api.get(`/contests/${id}`);
        setContest(res.data);
      } catch (error) {
        toast.error('Failed to load contest details');
      } finally {
        setLoading(false);
      }
    };
    fetchContest();
  }, [id]);

  if (loading) return <div className="h-[calc(100vh-100px)] flex items-center justify-center">Loading...</div>;
  if (!contest) return <div className="h-[calc(100vh-100px)] flex items-center justify-center text-gray-400">Contest not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <Link href="/contests" className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-8">
        <ChevronLeft size={16} /> Back to Contests
      </Link>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left Column: Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="premium-card">
            <div className="p-4 rounded-2xl bg-blue-600/10 text-blue-500 w-fit mb-6">
              <Trophy size={32} />
            </div>
            <h1 className="text-3xl font-bold mb-4">{contest.title}</h1>
            <p className="text-gray-400 leading-relaxed mb-8">
              {contest.description}
            </p>

            <div className="space-y-4 pt-6 border-t border-white/5">
              <div className="flex items-center gap-3 text-gray-300">
                <Calendar className="text-blue-500" size={18} />
                <div className="text-sm">
                  <div className="text-gray-500 text-xs uppercase">Start Date</div>
                  {format(new Date(contest.startTime), 'MMMM d, yyyy')}
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Clock className="text-blue-500" size={18} />
                <div className="text-sm">
                  <div className="text-gray-500 text-xs uppercase">Time</div>
                  {format(new Date(contest.startTime), 'HH:mm')} - {format(new Date(contest.endTime), 'HH:mm')}
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <User className="text-blue-500" size={18} />
                <div className="text-sm">
                  <div className="text-gray-500 text-xs uppercase">Organizer</div>
                  {contest.creator?.name || 'Admin'}
                </div>
              </div>
            </div>
          </div>

          <div className="premium-card bg-linear-to-br from-blue-600/20 to-indigo-600/20 border-blue-500/20">
            <h3 className="text-lg font-bold mb-2">Ready to compete?</h3>
            <p className="text-sm text-blue-200/60 mb-6">Solve all problems within the time limit to climb the leaderboard.</p>
            <div className="text-3xl font-bold text-white">00:00:00</div>
            <div className="text-[10px] text-blue-400 uppercase tracking-widest mt-1">Time Remaining</div>
          </div>
        </div>

        {/* Right Column: Problems List */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Code2 className="text-blue-500" />
            Contest Problems
          </h2>

          <div className="space-y-4">
            {contest.problems?.length === 0 ? (
              <div className="py-20 text-center glass-morphism rounded-3xl border border-dashed border-white/10 text-gray-500">
                No problems added to this contest yet.
              </div>
            ) : (
              contest.problems?.map((problem: any, index: number) => (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="premium-card flex items-center justify-between group hover:bg-white/[0.04]"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-bold text-lg text-gray-500 group-hover:text-blue-400 transition-colors">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1 group-hover:text-white transition-colors">{problem.title}</h4>
                      <div className="flex gap-3 items-center">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500' :
                          problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {problem.difficulty}
                        </span>
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                          <Clock size={10} /> {problem.timeLimit}ms
                        </span>
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                          <HardDrive size={10} /> {problem.memoryLimit}MB
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    href={`/problems/${problem.id}`}
                    className="p-3 rounded-full bg-white/5 group-hover:bg-blue-600 text-gray-400 group-hover:text-white transition-all shadow-lg"
                  >
                    <ArrowRight size={20} />
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
