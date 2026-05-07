'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2, Plus, Edit2, Trash2, Brain, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function AdminProblems() {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this problem?')) return;
    try {
      await api.delete(`/problems/${id}`);
      setProblems(problems.filter(p => p.id !== id));
    } catch (error) {
      alert('Failed to delete problem');
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Problem Bank</h1>
          <p className="text-gray-500">Manage your coding challenges and test cases.</p>
        </div>
        <Link 
          href="/admin/problems/new"
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus size={20} /> New Problem
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {problems.map((problem, i) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <Code2 size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{problem.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black border uppercase ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Brain size={14} />
                      {problem.testCasesCount || 0} Test Cases
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link 
                  href={`/admin/problems/edit/${problem.id}`}
                  className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Edit2 size={18} />
                </Link>
                <button 
                  onClick={() => handleDelete(problem.id)}
                  className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
          {problems.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <Code2 size={48} className="mx-auto text-gray-700 mb-4" />
              <p className="text-gray-500 font-bold">No problems found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
