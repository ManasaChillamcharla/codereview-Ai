import React, { useState, useEffect } from 'react';
import Editor, { DiffEditor } from '@monaco-editor/react';
import api from '../services/api.js';
import { useTheme } from '../context/ThemeContext.jsx';
import { Play, Sparkles, AlertTriangle, CheckCircle, ShieldAlert, Code2, Copy, Check, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { theme } = useTheme();
  
  // Input states
  const [code, setCode] = useState(`// Paste your code here to review...
function calculateTotal(price, tax, discount) {
  let total = price + price * tax;
  total = total - discount;
  return total;
}`);
  const [language, setLanguage] = useState('javascript');
  
  // Loading & Result states
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);

  const languages = [
    { name: 'JavaScript', value: 'javascript' },
    { name: 'TypeScript', value: 'typescript' },
    { name: 'Python', value: 'python' },
    { name: 'Java', value: 'java' },
    { name: 'C++', value: 'cpp' },
  ];

  // Cycles through messages while the AI is analyzing the code
  const loadingMessages = [
    'Initializing Code Analyzer...',
    'Performing abstract syntax tree (AST) checks...',
    'Scanning for security vulnerabilities & SQL injections...',
    'Evaluating performance profiles and loop optimizations...',
    'Structuring code suggestions and rewrites...',
  ];

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 3500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const handleReviewCode = async () => {
    if (!code || code.trim().length === 0) {
      toast.error('Please enter some code to review.');
      return;
    }

    setLoading(true);
    setResult(null);
    setActiveTab('overview');

    try {
      const response = await api.post('/review', {
        code,
        language: language.toLowerCase(),
      });

      if (response.data?.success) {
        setResult(response.data);
        toast.success('Code analysis completed successfully!');
      } else {
        toast.error('Could not parse review output.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!result?.correctedCode) return;
    navigator.clipboard.writeText(result.correctedCode);
    setCopied(true);
    toast.success('Improved code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-2">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">AI Code Review Workspace</h1>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}>
          Select your programming language, paste your code, and receive deep optimizations in seconds.
        </p>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Input editor */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Controls Bar */}
          <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
            theme === 'dark' ? 'bg-[#0f0f15] border-white/5' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            {/* Language */}
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase text-gray-400 font-extrabold tracking-wider">Language:</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`px-3 py-1.5 rounded-xl border outline-none transition-all text-xs font-bold ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/5 text-white focus:border-indigo-500/50'
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                }`}
              >
                {languages.map((l) => (
                  <option
                    key={l.value}
                    value={l.value}
                    className={theme === 'dark' ? 'bg-[#0f0f15] text-white' : 'bg-white text-slate-850'}
                  >
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              onClick={handleReviewCode}
              className="btn-gradient flex items-center gap-2 px-5 py-2 rounded-xl text-white font-bold text-xs shadow-md shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Play size={14} className="fill-white" /> Analyze Code
                </>
              )}
            </motion.button>
          </div>

          {/* Monaco Editor Wrapper */}
          <div className={`rounded-2xl border overflow-hidden p-2 relative ${
            theme === 'dark' ? 'bg-[#0d1117] border-white/5' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <Editor
              height="55vh"
              language={language === 'cpp' ? 'cpp' : language}
              value={code}
              onChange={(val) => setCode(val || '')}
              theme={theme === 'dark' ? 'vs-dark' : 'light'}
              options={{
                fontSize: 13,
                fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                minimap: { enabled: false },
                scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
                lineNumbers: 'on',
                roundedSelection: true,
                cursorBlinking: 'smooth',
                formatOnPaste: true,
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Loading / Review results */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            
            {/* 1. Loading State */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-8 rounded-3xl border text-center flex flex-col items-center justify-center min-h-[50vh] ${
                  theme === 'dark' ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                {/* Dynamic animated glow sphere */}
                <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
                  <div className="absolute inset-0 bg-indigo-600/30 rounded-full blur-xl animate-pulse" />
                  <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center text-white relative z-10 shadow-lg shadow-indigo-500/50 animate-bounce">
                    <Sparkles size={24} />
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2">Analyzing Your Implementation</h3>
                <p className="text-sm text-gray-400 max-w-sm mx-auto mb-6 h-6">
                  {loadingMessages[loadingStep]}
                </p>

                {/* Shimmer loading items */}
                <div className="w-full max-w-md space-y-3">
                  <div className="h-4 shimmer rounded-full w-3/4 mx-auto" />
                  <div className="h-3.5 shimmer rounded-full w-1/2 mx-auto" />
                  <div className="h-3.5 shimmer rounded-full w-2/3 mx-auto" />
                </div>
              </motion.div>
            )}

            {/* 2. Welcome State (when no code reviewed yet) */}
            {!loading && !result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-8 rounded-3xl border text-center flex flex-col items-center justify-center min-h-[62vh] ${
                  theme === 'dark' ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6">
                  <Code2 size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Awaiting Code Submission</h3>
                <p className="text-sm text-gray-400 max-w-sm mx-auto">
                  Write or paste code in the editor on the left, select the language, and click &quot;Analyze Code&quot; to generate your detailed report.
                </p>
              </motion.div>
            )}

            {/* 3. Review Result State */}
            {!loading && result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                {/* Metric circular SVG scores */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(result.scores || {}).map(([key, val]) => (
                    <div key={key} className={`p-4 rounded-2xl border text-center ${
                      theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200 shadow-xs'
                    }`}>
                      <span className="block text-[10px] font-extrabold uppercase text-gray-400 tracking-wider mb-2">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <div className="relative inline-flex items-center justify-center">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle cx="32" cy="32" r="28" className="stroke-gray-100 dark:stroke-white/5" strokeWidth="4" fill="transparent" />
                          <circle cx="32" cy="32" r="28" className={`transition-all duration-1000 ${
                            val >= 80 ? 'stroke-emerald-400' : val >= 60 ? 'stroke-amber-400' : 'stroke-rose-400'
                          }`} strokeWidth="4" fill="transparent"
                            strokeDasharray={2 * Math.PI * 28}
                            strokeDashoffset={2 * Math.PI * 28 * (1 - val / 100)}
                          />
                        </svg>
                        <span className="absolute text-sm font-extrabold">{val}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tabs bar */}
                <div className="flex border-b border-gray-200 dark:border-white/5 overflow-x-auto gap-1">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'issues', label: `Issues (${result.issues?.length || 0})` },
                    { id: 'diff', label: 'Code Comparison' },
                    { id: 'suggestions', label: 'Advanced Tips' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-5 py-3 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-indigo-500 text-indigo-400'
                          : 'border-transparent text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Active Tab content */}
                <div className="min-h-[40vh]">
                  
                  {/* OVERVIEW TAB */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      {/* Summary text */}
                      <div className={`p-5 rounded-2xl border ${
                        theme === 'dark' ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-indigo-50/50 border-indigo-100'
                      }`}>
                        <h4 className="font-extrabold text-indigo-400 text-sm uppercase tracking-wider mb-2">Review Summary</h4>
                        <p className="text-sm leading-relaxed text-gray-300 dark:text-gray-200">{result.summary}</p>
                      </div>

                      {/* Strengths list */}
                      <div>
                        <h4 className="font-extrabold text-sm uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                          <CheckCircle size={16} className="text-emerald-400" /> Key Strengths
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {result.strengths?.map((str, idx) => (
                            <div key={idx} className={`p-4 rounded-xl border text-sm flex items-start gap-2.5 ${
                              theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'
                            }`}>
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                              <span>{str}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* AI explanation */}
                      {result.explanation && (
                        <div className={`p-5 rounded-2xl border ${
                          theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'
                        }`}>
                          <h4 className="font-extrabold text-sm uppercase tracking-wider text-gray-400 mb-3">AI Deep Explanation</h4>
                          <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-line">{result.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ISSUES TAB */}
                  {activeTab === 'issues' && (
                    <div className="space-y-4">
                      {(!result.issues || result.issues.length === 0) ? (
                        <div className="text-center py-12 text-gray-400">
                          🎉 No issues found! Your code matches high-quality industry patterns.
                        </div>
                      ) : (
                        result.issues.map((issue, idx) => (
                          <div key={idx} className={`p-5 rounded-2xl border flex items-start gap-4 ${
                            theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'
                          }`}>
                            <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                              issue.severity === 'critical' ? 'bg-rose-500/20 text-rose-400' :
                              issue.severity === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              <AlertTriangle size={18} />
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center justify-between mb-1.5">
                                <h4 className="font-bold text-sm md:text-base capitalize">{issue.title}</h4>
                                <div className="flex gap-2">
                                  {issue.line && (
                                    <span className="px-2 py-0.5 rounded-md text-xs bg-gray-500/10 text-gray-400 border border-gray-500/20 font-mono">
                                      Line {issue.line}
                                    </span>
                                  )}
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                                    issue.severity === 'critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                    issue.severity === 'warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                  }`}>
                                    {issue.severity}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-400 leading-relaxed">{issue.description}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* CODE COMPARISON TAB (DIFF EDITOR) */}
                  {activeTab === 'diff' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase text-gray-400 font-extrabold tracking-wider">Side-by-Side Review Diff (Original vs Corrected)</span>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleCopyCode}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                              theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {copied ? (
                              <>
                                <Check size={13} className="text-emerald-400" /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy size={13} /> Copy Code
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Diff editor */}
                      <div className={`rounded-2xl border overflow-hidden p-2 ${
                        theme === 'dark' ? 'bg-[#0d1117] border-white/5' : 'bg-white border-slate-200 shadow-sm'
                      }`}>
                        <DiffEditor
                          height="45vh"
                          original={code}
                          modified={result.correctedCode}
                          language={language === 'cpp' ? 'cpp' : language}
                          theme={theme === 'dark' ? 'vs-dark' : 'light'}
                          options={{
                            fontSize: 12,
                            fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                            minimap: { enabled: false },
                            scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
                            readOnly: true,
                            renderSideBySide: true,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* SUGGESTIONS TAB */}
                  {activeTab === 'suggestions' && (
                    <div className="space-y-6">
                      {/* Improvements */}
                      {result.improvements?.length > 0 && (
                        <div>
                          <h4 className="font-extrabold text-sm uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                            <Sparkles size={16} className="text-indigo-400" /> Improvement Suggestions
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {result.improvements.map((imp, idx) => (
                              <div key={idx} className="p-3.5 rounded-xl border border-white/5 bg-white/5 text-sm flex gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                                <span>{imp}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Best practices */}
                      {result.bestPractices?.length > 0 && (
                        <div>
                          <h4 className="font-extrabold text-sm uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                            <CheckCircle size={16} className="text-emerald-400" /> Best Practices
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {result.bestPractices.map((bp, idx) => (
                              <div key={idx} className="p-3.5 rounded-xl border border-white/5 bg-white/5 text-sm flex gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                                <span>{bp}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Security */}
                      {result.securitySuggestions?.length > 0 && (
                        <div>
                          <h4 className="font-extrabold text-sm uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                            <ShieldAlert size={16} className="text-rose-400" /> Security Recommendations
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {result.securitySuggestions.map((sec, idx) => (
                              <div key={idx} className="p-3.5 rounded-xl border border-red-500/10 bg-red-500/5 text-sm flex gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                                <span>{sec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
