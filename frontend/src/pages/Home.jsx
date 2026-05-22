import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Zap, Shield, TrendingUp, ArrowRight, Star, CheckCircle } from 'lucide-react';

const features = [
  { icon: Code2, title: 'Deep Code Analysis', desc: 'AI reviews every line for bugs, logic errors, and bad practices.' },
  { icon: Shield, title: 'Security Scanning', desc: 'Detect vulnerabilities like SQL injection, XSS, and insecure patterns.' },
  { icon: Zap, title: 'Performance Tips', desc: 'Get actionable suggestions to make your code faster and leaner.' },
  { icon: TrendingUp, title: 'Best Practices', desc: 'Learn industry-standard patterns and clean architecture ideas.' },
];

const langs = ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript'];

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 overflow-hidden">
        {/* BG glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm text-indigo-300 font-medium">
            <Star size={14} className="text-yellow-400" />
            AI-Powered Code Review Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Review Code with{' '}
            <span className="gradient-text">Superhuman AI</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Paste your code and get instant AI-powered feedback on bugs, security
            vulnerabilities, performance, and best practices — in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="btn-gradient flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-lg shadow-lg shadow-indigo-500/30"
              >
                Start Reviewing <ArrowRight size={20} />
              </motion.button>
            </Link>
            <Link to="/history">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="glass flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-lg hover:border-indigo-500/50 transition-colors"
              >
                View History
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Language pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative z-10 flex flex-wrap gap-3 justify-center mt-14"
        >
          {langs.map((lang, i) => (
            <motion.span
              key={lang}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="glass px-4 py-2 rounded-full text-sm font-medium text-gray-300"
            >
              {lang}
            </motion.span>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to write <span className="gradient-text">better code</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Our AI doesn&apos;t just find errors — it helps you grow as a developer.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="glass p-7 rounded-2xl group cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4 group-hover:bg-indigo-500/30 transition-colors">
                <f.icon size={24} className="text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-strong rounded-3xl p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 pointer-events-none" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">
            Ready to improve your code?
          </h2>
          <p className="text-gray-400 mb-8 relative z-10">
            Paste your code and get a full professional review in under 30 seconds.
          </p>
          <div className="flex gap-3 justify-center flex-wrap relative z-10">
            {['Bug Detection', 'Security Analysis', 'Performance', 'Best Practices'].map(t => (
              <span key={t} className="flex items-center gap-1 text-sm text-emerald-400">
                <CheckCircle size={14} /> {t}
              </span>
            ))}
          </div>
          <Link to="/dashboard" className="inline-block mt-8 relative z-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="btn-gradient px-10 py-4 rounded-xl text-white font-semibold text-lg shadow-lg shadow-indigo-500/30"
            >
              Get Started Free →
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
