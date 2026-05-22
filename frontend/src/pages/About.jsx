import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.jsx';
import { Shield, Sparkles, BookOpen, Terminal, CheckCircle2, Heart } from 'lucide-react';

const About = () => {
  const { theme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Title block */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          About <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">CodeReview AI</span>
        </h1>
        <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}`}>
          A state-of-the-art code analysis platform that empowers software engineering teams with 
          instant, deep AI code reviews. Get expert feedback on security, performance, readability, and syntax in seconds.
        </p>
      </motion.div>

      {/* Grid of features */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
      >
        {/* Card 1 */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className={`p-6 rounded-2xl border transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-white/5 border-white/5 hover:border-indigo-500/30' 
              : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-4">
            <Sparkles size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">AI-Driven Deep Insights</h3>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}>
            Utilizes advanced LangChain chains backed by frontier LLMs (GPT-4o/Claude 3.5 Sonnet) 
            to perform fine-grained analyses of logical logic and structural quality.
          </p>
        </motion.div>

        {/* Card 2 */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className={`p-6 rounded-2xl border transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-white/5 border-white/5 hover:border-indigo-500/30' 
              : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
            <Shield size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Automated Security Auditing</h3>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}>
            Scans for common vulnerabilities including injection attacks, XSS, insecure patterns, 
            key exposure, and bad encryption practices automatically.
          </p>
        </motion.div>

        {/* Card 3 */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className={`p-6 rounded-2xl border transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-white/5 border-white/5 hover:border-indigo-500/30' 
              : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
            <Terminal size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Interactive Monaco Editor</h3>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}>
            Embedded Monaco Editor provides VS-Code grade formatting, highlight rules, and line-referencing,
            making coding and copying extremely fluid.
          </p>
        </motion.div>

        {/* Card 4 */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className={`p-6 rounded-2xl border transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-white/5 border-white/5 hover:border-indigo-500/30' 
              : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4">
            <BookOpen size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Educational Feedbacks</h3>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-slate-600'}>
            Not just bug alerts! We provide comprehensive rewrite examples, line-by-line detailed explanations, 
            and best-practice patterns to help you learn and grow.
          </p>
        </motion.div>
      </motion.div>

      {/* Tech Stack block */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className={`p-8 rounded-3xl border mb-16 ${
          theme === 'dark' ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-200 shadow-sm'
        }`}
      >
        <h2 className="text-2xl font-extrabold mb-6 text-center">Built on Modern Technologies</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {['Vite & React 18', 'Tailwind CSS v3', 'Express / Node.js', 'LangChain Core', 'Mongoose / MongoDB', 'Monaco Editor'].map((tech) => (
            <div key={tech} className={`px-4 py-3 rounded-xl border flex items-center justify-center gap-2 ${
              theme === 'dark' ? 'bg-[#0f0f15] border-white/5 text-gray-300' : 'bg-white border-slate-200 text-slate-700 shadow-xs'
            }`}>
              <CheckCircle2 size={16} className="text-indigo-500 shrink-0" />
              <span className="font-semibold text-xs sm:text-sm">{tech}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Footer support */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center py-6 border-t border-gray-200 dark:border-white/5"
      >
        <p className="flex items-center justify-center gap-1.5 text-sm text-gray-400">
          Created with <Heart size={14} className="text-red-500 fill-red-500" /> by the AI CodeReview Team.
        </p>
      </motion.div>
    </div>
  );
};

export default About;
