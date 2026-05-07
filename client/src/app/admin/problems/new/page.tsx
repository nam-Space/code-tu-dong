'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Code2, ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function NewProblemPage() {
  const router = useRouter();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Medium',
    timeLimit: 1000,
    memoryLimit: 256,
    contestId: '',
    testCases: [{ input: '', expectedOutput: '', isSample: true }]
  });

  useEffect(() => {
    api.get('/contests').then(res => setContests(res.data));
  }, []);

  const addTestCase = () => {
    setFormData({
      ...formData,
      testCases: [...formData.testCases, { input: '', expectedOutput: '', isSample: false }]
    });
  };

  const removeTestCase = (index: number) => {
    const newTestCases = [...formData.testCases];
    newTestCases.splice(index, 1);
    setFormData({ ...formData, testCases: newTestCases });
  };

  const updateTestCase = (index: number, field: string, value: any) => {
    const newTestCases = [...formData.testCases];
    newTestCases[index] = { ...newTestCases[index], [field]: value };
    setFormData({ ...formData, testCases: newTestCases });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/problems', formData);
      toast.success('Problem created successfully!');
      router.push('/admin');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create problem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link href="/admin" className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-8">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="premium-card">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-purple-600/10 text-purple-500">
            <Code2 size={24} />
          </div>
          <h1 className="text-2xl font-bold">Create New Problem</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400">Problem Title</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 transition-all outline-none"
                placeholder="e.g. Reverse a String"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 transition-all outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-400">Description (Markdown supported)</label>
            <textarea
              required
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 transition-all outline-none resize-none"
              placeholder="Describe the problem, input format, and output format..."
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400">Time Limit (ms)</label>
              <input
                required
                type="number"
                value={formData.timeLimit}
                onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400">Memory Limit (MB)</label>
              <input
                required
                type="number"
                value={formData.memoryLimit}
                onChange={(e) => setFormData({ ...formData, memoryLimit: parseInt(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400">Assigned Contest</label>
              <select
                value={formData.contestId}
                onChange={(e) => setFormData({ ...formData, contestId: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 transition-all outline-none"
              >
                <option value="">Standalone Problem</option>
                {contests.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Test Cases */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Test Cases</h3>
              <button
                type="button"
                onClick={addTestCase}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all"
              >
                <Plus size={14} /> Add Test Case
              </button>
            </div>

            <div className="space-y-4">
              {formData.testCases.map((tc, index) => (
                <div key={index} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl relative">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Test Case #{index + 1}</span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tc.isSample}
                          onChange={(e) => updateTestCase(index, 'isSample', e.target.checked)}
                          className="w-4 h-4 rounded bg-white/5 border-white/10 text-purple-600 focus:ring-0"
                        />
                        Is Sample
                      </label>
                      <button
                        type="button"
                        onClick={() => removeTestCase(index)}
                        className="text-red-500 hover:text-red-400 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Input</label>
                      <textarea
                        rows={3}
                        value={tc.input}
                        onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 transition-all outline-none font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Expected Output</label>
                      <textarea
                        rows={3}
                        value={tc.expectedOutput}
                        onChange={(e) => updateTestCase(index, 'expectedOutput', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 transition-all outline-none font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/20"
          >
            {loading ? 'Creating...' : <><Save size={18} /> Create Problem</>}
          </button>
        </form>
      </div>
    </div>
  );
}
