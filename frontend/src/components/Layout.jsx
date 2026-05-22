import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import { Sun, Moon, Code2, Menu, X, Info, History, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'History', path: '/history', icon: History },
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#050505] text-[#f0f0f0]' : 'bg-[#f8fafc] text-[#0f172a]'
    }`}>
      {/* Dynamic Animated BG for Dark Mode */}
      {theme === 'dark' && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#0a0a14] to-[#07050a] pointer-events-none z-0" />
      )}

      {/* Header */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-[#050505]/75 border-b border-white/5 backdrop-blur-md' 
          : 'bg-white/75 border-b border-slate-200 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative z-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
              <Code2 size={20} />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              CodeReview AI
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <span className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive(item.path)
                    ? (theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600')
                    : (theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
                }`}>
                  <item.icon size={16} />
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-colors duration-200 ${
                theme === 'dark' ? 'bg-white/5 text-yellow-400 hover:bg-white/10' : 'bg-slate-100 text-[#0f172a] hover:bg-slate-200'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-xl transition-colors ${
                theme === 'dark' ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden border-t ${
                theme === 'dark' ? 'bg-[#0b0b0f] border-white/5' : 'bg-white border-slate-200'
              }`}
            >
              <div className="px-4 py-3 space-y-1">
                {navItems.map((item) => (
                  <Link 
                    key={item.path} 
                    to={item.path} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block"
                  >
                    <div className={`px-4 py-3 rounded-xl text-base font-medium flex items-center gap-3 ${
                      isActive(item.path)
                        ? (theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600')
                        : (theme === 'dark' ? 'text-gray-300 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-50')
                    }`}>
                      <item.icon size={18} />
                      {item.name}
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-grow relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className={`mt-auto border-t py-6 relative z-10 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#050505]/40 border-white/5 text-gray-500' : 'bg-white/40 border-slate-200 text-slate-400'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>© {new Date().getFullYear()} CodeReview AI. Built with premium design and AI power.</p>
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-indigo-400 transition-colors">Documentation</Link>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors">GitHub</a>
            <a href="/api/health" className="hover:text-indigo-400 transition-colors">API Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
