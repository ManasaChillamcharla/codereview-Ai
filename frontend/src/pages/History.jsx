import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { useTheme } from '../context/ThemeContext.jsx';
import { Search, Filter, Calendar, Trash2, Code2, X, AlertTriangle, CheckCircle, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Simple helper to format dates nicely
const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const History = () => {
  const { theme } = useTheme();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const languages = ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript'];

  // Fetch reviews based on search/filters
  const fetchReviews = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (language) params.language = language;

      const response = await api.get('/history', { params });
      if (response.data?.success) {
        setReviews(response.data.reviews || []);
        setPagination(response.data.pagination || { page: 1, pages: 1 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchReviews(1);
    }, 300);

    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, language]);

  // Handle opening review detail
  const handleOpenReview = async (id) => {
    setSelectedReviewId(id);
    setDetailLoading(true);
    setActiveTab('overview');
    try {
      const response = await api.get(`/history/${id}`);
      if (response.data?.success) {
        setSelectedReview(response.data.review);
      } else {
        toast.error('Could not load review detail.');
        setSelectedReviewId(null);
      }
    } catch (err) {
      console.error(err);
      setSelectedReviewId(null);
    } finally {
      setDetailLoading(false);
    }
  };

  // Handle deleting review
  const handleDeleteReview = async (e, id) => {
    e.stopPropagation(); // prevent card click
    if (!window.confirm('Are you sure you want to delete this review from history?')) return;

    try {
      const response = await api.delete(`/history/${id}`);
      if (response.data?.success) {
        toast.success('Review deleted from history.');
        if (selectedReviewId === id) {
          setSelectedReviewId(null);
          setSelectedReview(null);
        }
        fetchReviews(pagination.page);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="py-4">
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Review History</h1>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}>
            Browse, inspect, and manage your previous AI code analysis reports.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by keywords or summary description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all text-sm font-medium ${
              theme === 'dark'
                ? 'bg-white/5 border-white/5 text-white placeholder-gray-500 focus:border-indigo-500/50 focus:bg-white/10'
                : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
            }`}
          />
        </div>

        {/* Filter select */}
        <div className="relative">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all text-sm font-medium appearance-none ${
              theme === 'dark'
                ? 'bg-white/5 border-white/5 text-white placeholder-gray-500 focus:border-indigo-500/50 focus:bg-white/10'
                : 'bg-white border-slate-200 text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
            }`}
          >
            <option value="" className={theme === 'dark' ? 'bg-[#0f0f15] text-white' : 'bg-white text-slate-800'}>
              All Languages
            </option>
            {languages.map(lang => (
              <option
                key={lang}
                value={lang.toLowerCase()}
                className={theme === 'dark' ? 'bg-[#0f0f15] text-white' : 'bg-white text-slate-800'}
              >
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main content grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <RefreshCw size={36} className="text-indigo-500 animate-spin" />
          <span className="font-semibold text-gray-400">Loading code reviews...</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className={`text-center py-24 rounded-2xl border ${
          theme === 'dark' ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-200'
        }`}>
          <Code2 size={48} className="text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-1">No reviews found</h3>
          <p className="text-gray-400 max-w-sm mx-auto text-sm">
            {search || language 
              ? 'Try modifying your search keywords or removing filters.'
              : 'Submit code on the Dashboard to see your reviews saved here.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {reviews.map((rev) => (
              <motion.div
                key={rev._id}
                whileHover={{ y: -4 }}
                onClick={() => handleOpenReview(rev._id)}
                className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/5 hover:border-indigo-500/30'
                    : 'bg-white border-slate-200 shadow-xs hover:shadow-md'
                }`}
              >
                <div>
                  {/* Header info */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {rev.language}
                    </span>
                    <button
                      onClick={(e) => handleDeleteReview(e, rev._id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete from history"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Summary */}
                  <h3 className="font-bold text-base mb-2 group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {rev.summary || 'Code Review'}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-4">
                    {rev.summary}
                  </p>
                </div>

                {/* Score meters & date */}
                <div className="pt-4 border-t border-gray-200 dark:border-white/5">
                  {/* Miniature scores */}
                  <div className="grid grid-cols-4 gap-1 text-center mb-3">
                    {Object.entries(rev.scores || {}).map(([key, val]) => (
                      <div key={key} className="p-1 rounded-lg bg-gray-500/5">
                        <div className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">{key.substring(0, 4)}</div>
                        <div className={`font-bold text-xs ${
                          val >= 80 ? 'text-emerald-400' : val >= 60 ? 'text-amber-400' : 'text-rose-400'
                        }`}>{val}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar size={13} />
                    <span>{formatDate(rev.createdAt)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <button
                disabled={pagination.page === 1}
                onClick={() => fetchReviews(pagination.page - 1)}
                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${
                  pagination.page === 1
                    ? 'opacity-40 cursor-not-allowed border-transparent'
                    : (theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-50')
                }`}
              >
                Previous
              </button>
              <span className="text-sm font-semibold">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                disabled={pagination.page === pagination.pages}
                onClick={() => fetchReviews(pagination.page + 1)}
                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${
                  pagination.page === pagination.pages
                    ? 'opacity-40 cursor-not-allowed border-transparent'
                    : (theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-50')
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Review details Overlay Modal */}
      <AnimatePresence>
        {selectedReviewId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setSelectedReviewId(null); setSelectedReview(null); }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25 }}
              className={`relative z-10 w-full max-w-5xl max-h-[85vh] overflow-y-auto rounded-3xl border flex flex-col ${
                theme === 'dark' ? 'bg-[#0a0a0f] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
              }`}
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 p-6 flex items-center justify-between border-b bg-inherit border-gray-200 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Code2 size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold tracking-tight">Code Review Details</h2>
                    <p className="text-xs text-gray-400">
                      {selectedReview ? `Analyzed in ${selectedReview.language.toUpperCase()} on ${formatDate(selectedReview.createdAt)}` : 'Loading...'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setSelectedReviewId(null); setSelectedReview(null); }}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {detailLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <RefreshCw size={32} className="text-indigo-500 animate-spin" />
                    <span className="font-semibold text-gray-400">Fetching review report...</span>
                  </div>
                ) : !selectedReview ? (
                  <div className="text-center py-10 text-gray-400 font-semibold">Failed to load detailed report.</div>
                ) : (
                  <div>
                    {/* Scores Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      {Object.entries(selectedReview.scores || {}).map(([key, val]) => (
                        <div key={key} className={`p-4 rounded-2xl border text-center ${
                          theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200 shadow-xs'
                        }`}>
                          <span className="block text-[11px] font-extrabold uppercase text-gray-400 tracking-wider mb-2">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </span>
                          <div className="relative inline-flex items-center justify-center">
                            {/* Circular meter SVG */}
                            <svg className="w-16 h-16 transform -rotate-90">
                              <circle cx="32" cy="32" r="28" className="stroke-gray-200 dark:stroke-white/5" strokeWidth="4" fill="transparent" />
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

                    {/* Navigation Tabs */}
                    <div className="flex border-b border-gray-200 dark:border-white/5 mb-6 overflow-x-auto gap-1">
                      {['overview', 'issues', 'code', 'suggestions'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-5 py-3 border-b-2 font-bold text-sm capitalize transition-all whitespace-nowrap ${
                            activeTab === tab
                              ? 'border-indigo-500 text-indigo-400'
                              : 'border-transparent text-gray-400 hover:text-gray-300'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* Tab contents */}
                    <div>
                      {/* OVERVIEW TAB */}
                      {activeTab === 'overview' && (
                        <div className="space-y-6">
                          {/* Summary Box */}
                          <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-indigo-50/50 border-indigo-100'}`}>
                            <h4 className="font-extrabold text-indigo-400 text-sm uppercase tracking-wider mb-2">Review Summary</h4>
                            <p className="text-sm leading-relaxed text-gray-300 dark:text-gray-200">{selectedReview.summary}</p>
                          </div>

                          {/* Strengths */}
                          <div>
                            <h4 className="font-extrabold text-sm uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                              <CheckCircle size={16} className="text-emerald-400" /> Key Strengths
                            </h4>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {selectedReview.strengths?.map((str, idx) => (
                                <li key={idx} className={`p-4 rounded-xl border text-sm flex items-start gap-2.5 ${
                                  theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'
                                }`}>
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                                  <span>{str}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Explanations */}
                          {selectedReview.explanation && (
                            <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                              <h4 className="font-extrabold text-sm uppercase tracking-wider text-gray-400 mb-3">AI Deep Explanation</h4>
                              <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-line">{selectedReview.explanation}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* ISSUES TAB */}
                      {activeTab === 'issues' && (
                        <div className="space-y-4">
                          {(!selectedReview.issues || selectedReview.issues.length === 0) ? (
                            <div className="text-center py-10 text-gray-400">🎉 No major issues detected in this code!</div>
                          ) : (
                            selectedReview.issues.map((issue, idx) => (
                              <div key={idx} className={`p-5 rounded-2xl border flex items-start gap-4 ${
                                theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'
                              }`}>
                                <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                                  issue.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
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
                                        issue.severity === 'critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
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

                      {/* CODE TAB */}
                      {activeTab === 'code' && (
                        <div className="space-y-4">
                          <div className="flex flex-col gap-2">
                            <span className="text-xs uppercase text-gray-400 font-extrabold tracking-wider">Corrected / Improved Code</span>
                            <pre className="p-4 rounded-2xl text-xs font-mono bg-[#0d1117] border border-[#30363d] overflow-x-auto text-gray-200 select-all max-h-[400px] leading-relaxed">
                              {selectedReview.correctedCode || '// No corrections generated'}
                            </pre>
                          </div>
                        </div>
                      )}

                      {/* SUGGESTIONS TAB */}
                      {activeTab === 'suggestions' && (
                        <div className="space-y-6">
                          {/* Improvements */}
                          {selectedReview.improvements?.length > 0 && (
                            <div>
                              <h4 className="font-extrabold text-sm uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                                <Sparkles size={16} className="text-indigo-400" /> Improvement Suggestions
                              </h4>
                              <div className="grid grid-cols-1 gap-2">
                                {selectedReview.improvements.map((imp, idx) => (
                                  <div key={idx} className="p-3.5 rounded-xl border border-white/5 bg-white/5 text-sm flex gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                                    <span>{imp}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Security */}
                          {selectedReview.securitySuggestions?.length > 0 && (
                            <div>
                              <h4 className="font-extrabold text-sm uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                                <ShieldAlert size={16} className="text-rose-400" /> Security Recommendations
                              </h4>
                              <div className="grid grid-cols-1 gap-2">
                                {selectedReview.securitySuggestions.map((sec, idx) => (
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
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default History;
