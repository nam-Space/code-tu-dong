'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Clock, User as UserIcon, Code2, CheckCircle2, XCircle, AlertCircle, Timer, Radio } from 'lucide-react';
import api from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { io } from 'socket.io-client';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      const res = await api.get('/submissions/all');
      setSubmissions(res.data);
    } catch (error) {
      console.error('Failed to fetch submissions', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();

    // Thiết lập Socket.io
    const socket = io('http://localhost:3001'); // Thay đổi cổng nếu cần

    socket.on('submissionsBatchUpdate', (batch: any[]) => {
      setSubmissions(prev => {
        const newSubmissions = [...prev];
        
        batch.forEach(updatedSubmission => {
          const index = newSubmissions.findIndex(s => s.id === updatedSubmission.id);
          if (index !== -1) {
            newSubmissions[index] = updatedSubmission;
          } else {
            // Nếu là bài mới nộp, thêm vào đầu nếu nó chưa có trong danh sách
            newSubmissions.unshift(updatedSubmission);
          }
        });

        // Chỉ giữ lại 1000 bài mới nhất
        return newSubmissions.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 1000);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED': return 'text-green-400 bg-green-400/10 border-green-400/20 shadow-[0_0_15px_-5px_rgba(74,222,128,0.3)]';
      case 'WRONG_ANSWER': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'TIME_LIMIT_EXCEEDED': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'COMPILE_ERROR': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'PENDING':
      case 'RUNNING': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACCEPTED': return <CheckCircle2 size={14} />;
      case 'WRONG_ANSWER': return <XCircle size={14} />;
      case 'TIME_LIMIT_EXCEEDED': return <Timer size={14} />;
      case 'PENDING':
      case 'RUNNING': return <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />;
      default: return <AlertCircle size={14} />;
    }
  };

  if (loading) return (
    <div className="h-[calc(100vh-64px)] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 font-bold animate-pulse">Loading Submissions...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-500">
               <LayoutDashboard size={24} />
            </div>
            <h1 className="text-4xl font-black tracking-tight">Submissions</h1>
          </div>
          <p className="text-gray-500">Watching all activity across the platform</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/5 border border-blue-500/10 text-xs font-bold text-blue-400">
            <Radio size={14} className="animate-pulse" /> Live WebSocket Connected
          </div>
          <div className="text-[10px] text-gray-600 font-mono">Showing last 1000 records</div>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Problem</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">User</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Lang</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Time</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Memory</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence initial={false}>
              {submissions.map((sub) => (
                <motion.tr
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={sub.id}
                  className="group hover:bg-white/[0.02] transition-colors relative overflow-hidden"
                >
                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all duration-500 ${getStatusColor(sub.status)}`}>
                      {getStatusIcon(sub.status)}
                      {sub.status.replace(/_/g, ' ')}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-bold text-sm text-gray-300 group-hover:text-blue-400 transition-colors">
                      {sub.problem?.title || 'Unknown Problem'}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/5 flex items-center justify-center">
                        <UserIcon size={12} className="text-gray-300" />
                      </div>
                      <span className="font-medium">{sub.user?.username || 'Anonymous'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-[10px] font-black text-gray-600 bg-white/5 px-2 py-1 rounded uppercase w-fit">{sub.language}</div>
                  </td>
                  <td className="px-6 py-5 font-mono text-sm">
                    {sub.executionTime !== null ? (
                      <span className="text-gray-400">{sub.executionTime}ms</span>
                    ) : (
                      <span className="text-gray-700">--</span>
                    )}
                  </td>
                  <td className="px-6 py-5 font-mono text-sm">
                    {sub.memoryUsed !== null ? (
                      <span className="text-gray-400">{(sub.memoryUsed / 1024).toFixed(1)} MB</span>
                    ) : (
                      <span className="text-gray-700">--</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Clock size={12} />
                      {formatDistanceToNow(new Date(sub.createdAt), { addSuffix: true })}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {submissions.length === 0 && (
          <div className="py-20 text-center">
            <AlertCircle size={48} className="mx-auto text-gray-800 mb-4" />
            <p className="text-gray-500 font-bold">No submissions found yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
