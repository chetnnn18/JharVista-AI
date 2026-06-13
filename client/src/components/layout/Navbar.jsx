import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineBell,
  HiOutlineMenu,
  HiX,
} from 'react-icons/hi';
import { GiLeafSwirl } from 'react-icons/gi';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/explore', label: 'Explore' },
  { to: '/trip-planner', label: 'Trip Planner' },
  { to: '/reels', label: 'Reels', badge: 'New' },
  { to: '/circuits', label: 'Circuits' },
  { to: '/districts', label: 'Districts' },
];

const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/30 dark:border-slate-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <GiLeafSwirl className="text-2xl text-secondary" />
            <div>
              <span className="font-bold text-primary dark:text-secondary text-lg leading-tight block">
                JharYatra AI
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Explore. Experience. Jharkhand.
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-primary dark:text-secondary'
                      : 'text-slate-600 dark:text-slate-300 hover:text-primary'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {link.badge && (
                      <span className="ml-1 text-[10px] bg-secondary text-white px-1.5 py-0.5 rounded-full">
                        {link.badge}
                      </span>
                    )}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-3 right-3 h-0.5 bg-secondary rounded-full"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <HiOutlineSun className="text-xl text-accent" />
              ) : (
                <HiOutlineMoon className="text-xl text-slate-600" />
              )}
            </button>
            <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hidden sm:block">
              <HiOutlineBell className="text-xl text-slate-600 dark:text-slate-300" />
            </button>

            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                {user.role === 'admin' && (
                  <Button variant="ghost" className="!px-3 !py-1.5 text-xs" onClick={() => navigate('/admin')}>
                    Admin
                  </Button>
                )}
                {user.role === 'explorer' && (
                  <Button variant="ghost" className="!px-3 !py-1.5 text-xs" onClick={() => navigate('/explorer')}>
                    Dashboard
                  </Button>
                )}
                <button
                  onClick={logout}
                  className="text-sm text-slate-600 dark:text-slate-300 hover:text-primary"
                >
                  {user.name.split(' ')[0]}
                </button>
              </div>
            ) : (
              <Button
                className="hidden sm:flex !px-4 !py-2 text-sm"
                onClick={() => navigate('/login')}
              >
                Login / Signup
              </Button>
            )}

            <button
              className="lg:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <HiX className="text-2xl" /> : <HiOutlineMenu className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                >
                  {link.label}
                </NavLink>
              ))}
              {!user && (
                <Button onClick={() => { navigate('/login'); setMobileOpen(false); }}>
                  Login / Signup
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
