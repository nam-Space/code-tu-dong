'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Code2, Play, Send, ChevronLeft, Clock, HardDrive, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Editor from '@monaco-editor/react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProblemDetailPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState<any>(null);
  const [code, setCode] = useState('// Write your solution here\nprint("Hello World")');
  const languages = ['python', 'cpp', 'javascript', 'java'];
  const [language, setLanguage] = useState('python');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await api.get(`/problems/${id}`);
        setProblem(res.data);
      } catch (error) {
        toast.error('Failed to load problem');
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setResult(null);
    try {
      const res = await api.post('/submissions', {
        code,
        language,
        problemId: id,
      });
      toast.success('Submission received! Waiting for results...');
      
      // Poll for result
      const pollInterval = setInterval(async () => {
        const subRes = await api.get(`/submissions/${res.data.id}`);
        if (subRes.data.status !== 'PENDING' && subRes.data.status !== 'RUNNING') {
          setResult(subRes.data);
          clearInterval(pollInterval);
          setSubmitting(false);
          
          if (subRes.data.status === 'ACCEPTED') {
            toast.success('Correct Answer!', { icon: '🎉' });
          } else {
            toast.error(subRes.data.status);
          }
        }
      }, 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Submission failed');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="h-[calc(100vh-100px)] flex items-center justify-center">Loading...</div>;

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row overflow-hidden bg-[#050505]">
      {/* Problem Description Panel */}
      <div className="w-full md:w-1/3 overflow-y-auto border-r border-white/5 p-8 custom-scrollbar">
        <Link href="/problems" className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-8">
          <ChevronLeft size={16} /> Back to Problems
        </Link>
        
        <h1 className="text-3xl font-bold mb-4">{problem.title}</h1>
        <div className="flex gap-4 mb-8">
          <div className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded bg-blue-500/10 text-blue-500">
            <Clock size={12} /> {problem.timeLimit}ms
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded bg-purple-500/10 text-purple-500">
            <HardDrive size={12} /> {problem.memoryLimit}MB
          </div>
          <div className="text-xs font-semibold px-2 py-1 rounded bg-white/5 text-gray-400">
            {problem.difficulty}
          </div>
        </div>

        <div className="prose prose-invert max-w-none mb-12">
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {problem.description}
          </p>
        </div>

        {problem.testCases?.map((tc: any, i: number) => (
          <div key={tc.id} className="mb-6">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Sample Test Case {i + 1}</h4>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="text-[10px] text-gray-500 uppercase mb-2">Input</div>
                <pre className="text-sm text-blue-300 font-mono">{tc.input}</pre>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="text-[10px] text-gray-500 uppercase mb-2">Expected Output</div>
                <pre className="text-sm text-green-300 font-mono">{tc.expectedOutput}</pre>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Panel */}
      <div className="flex-1 flex flex-col relative">
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#0a0a0a]">
          <div className="flex items-center gap-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white/5 text-sm rounded-lg px-3 py-1.5 border border-white/10 outline-none focus:border-blue-500 transition-all"
            >
              <option value="python">Python 3</option>
              <option value="cpp">C++ 17</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java 17</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 rounded-lg text-sm font-bold transition-all"
            >
              {submitting ? 'Submitting...' : <><Send size={16} /> Submit Code</>}
            </button>
          </div>
        </div>

        <div className="flex-1">
          <Editor
            height="100%"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={(v) => setCode(v || '')}
            options={{
              fontSize: 14,
              fontFamily: "'Fira Code', monospace",
              minimap: { enabled: false },
              padding: { top: 20 },
              smoothScrolling: true,
              cursorBlinking: 'smooth',
            }}
          />
        </div>

        {/* Results Modal/Overlay */}
        {result && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-6 left-6 right-6 glass-morphism rounded-2xl p-6 border-l-4 border-l-blue-500 z-10"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                {result.status === 'ACCEPTED' ? (
                  <CheckCircle2 size={32} className="text-green-500" />
                ) : (
                  <AlertCircle size={32} className="text-red-500" />
                )}
                <div>
                  <h4 className={`text-xl font-bold ${result.status === 'ACCEPTED' ? 'text-green-400' : 'text-red-400'}`}>
                    {result.status}
                  </h4>
                  <p className="text-sm text-gray-400 mt-1">
                    Time: {result.executionTime}ms | Memory: {result.memoryUsed || 0}KB
                  </p>
                </div>
              </div>
              <button onClick={() => setResult(null)} className="text-gray-500 hover:text-white">Close</button>
            </div>
            {result.errorMessage && (
              <div className="mt-4 p-3 bg-red-500/10 rounded-lg text-xs font-mono text-red-300">
                {result.errorMessage}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
