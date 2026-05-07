'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2, Search, Filter, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await api.get('/problems');
        setProblems(res.data);
      } catch (error) {
        console.error('Failed to fetch problems', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const filteredProblems = problems.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Problem Set</h1>
        <p className="text-gray-400 text-lg">Sharpen your skills with our curated set of challenges</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:border-blue-500 transition-all outline-none"
          />
        </div>
        <button className="px-6 py-4 glass-morphism rounded-2xl flex items-center gap-2 hover:bg-white/5 transition-all">
          <Filter size={20} /> Filters
        </button>
      </div>

      <div className="premium-card p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-500 text-sm uppercase tracking-wider">
            <tr>
              <th className="px-8 py-5 font-bold">Status</th>
              <th className="px-8 py-5 font-bold">Title</th>
              <th className="px-8 py-5 font-bold">Difficulty</th>
              <th className="px-8 py-5 font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={4} className="px-8 py-6 h-16 bg-white/[0.02]" />
                </tr>
              ))
            ) : (
              filteredProblems.map((problem) => (
                <tr key={problem.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <CheckCircle2 size={20} className="text-gray-700 group-hover:text-gray-600 transition-colors" />
                  </td>
                  <td className="px-8 py-6">
                    <Link href={`/problems/${problem.id}`} className="font-bold text-lg hover:text-blue-400 transition-colors">
                      {problem.title}
                    </Link>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500' :
                      problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <Link
                      href={`/problems/${problem.id}`}
                      className="px-6 py-2 bg-white/5 hover:bg-blue-600 rounded-xl text-sm font-bold transition-all"
                    >
                      Solve
                    </Link>
                  </td>
                </tr>
              ))
            )}
            {!loading && filteredProblems.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-gray-500">
                  No problems found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
