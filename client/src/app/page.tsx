'use client';

import { motion } from 'framer-motion';
import { Code2, Trophy, Shield, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const features = [
    {
      title: 'Real-time Judging',
      description: 'Get instant feedback on your code submissions with our high-speed judge engine.',
      icon: Zap,
      color: 'text-yellow-400',
    },
    {
      title: 'Secure Sandbox',
      description: 'Your code runs in an isolated Docker environment, ensuring safety and performance.',
      icon: Shield,
      color: 'text-green-400',
    },
    {
      title: 'Competitive Contests',
      description: 'Join global coding contests or create your own to challenge others.',
      icon: Trophy,
      color: 'text-blue-400',
    },
  ];

  return (
    <div className="flex flex-col items-center px-6">
      {/* Hero Section */}
      <section className="max-w-5xl w-full py-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6">
            Master Competitive <br />
            <span className="gradient-text">Programming</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            A next-generation Online Judge platform built for developers who demand speed, 
            security, and a premium experience.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/problems"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-semibold flex items-center gap-2 transition-all shadow-xl shadow-blue-900/40"
            >
              Get Started <ArrowRight size={20} />
            </Link>
            <Link
              href="/contests"
              className="px-8 py-4 glass-morphism hover:bg-white/5 rounded-2xl font-semibold transition-all"
            >
              View Contests
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl w-full py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="premium-card"
            >
              <div className={`p-3 rounded-xl bg-white/5 w-fit mb-6 ${feature.color}`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-5xl w-full py-20 border-t border-white/5 mt-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Submissions', value: '1M+' },
            { label: 'Active Users', value: '50K+' },
            { label: 'Contests', value: '200+' },
            { label: 'Problems', value: '500+' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
