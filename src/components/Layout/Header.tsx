import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, User, Menu, ChevronDown, Bell, Settings, 
  Activity, Shield, BookOpen, LayoutDashboard 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NavItem: React.FC<{
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
}> = ({ href, icon: Icon, label, active }) => (
  <Link 
    to={href} 
    className={`
      flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 
      ${active 
        ? 'bg-white/10 text-white' 
        : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
      }
    `}
  >
    <Icon className="w-5 h-5" />
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

const ProfileDropdown: React.FC<{ 
  user: any, 
  onLogout: () => void 
}> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 hover:bg-white/5 p-2 rounded-lg transition-all"
      >
        {user.profilePicture ? (
          <img
            src={user.profilePicture}
            alt={user.name}
            className="w-8 h-8 rounded-full border-2 border-gray-700"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-400" />
          </div>
        )}
        <span className="text-sm font-medium text-white">{user.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[#2A2A2A] border border-gray-800 rounded-xl shadow-2xl py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-800">
            <p className="text-xs text-gray-400">Signed in as</p>
            <p className="font-medium text-white">{user.email}</p>
          </div>
          
          <div className="py-1">
            <Link
              to="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <User className="w-4 h-4 mr-3" />
              Profile Settings
            </Link>
            <Link
              to="/account"
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <Settings className="w-4 h-4 mr-3" />
              Account Management
            </Link>
          </div>
          
          <div className="border-t border-gray-800 py-1">
            <button
              onClick={onLogout}
              className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/exams', icon: BookOpen, label: 'Exams' },
    ...(user?.role === 'admin' || user?.role === 'examiner' 
      ? [{ href: '/manage-exams', icon: Shield, label: 'Manage Exams' }] 
      : []),
    ...(user?.role === 'admin' 
      ? [{ href: '/admin', icon: Activity, label: 'Admin Panel' }] 
      : [])
  ];

  return (
    <header className="bg-gradient-to-r from-[#121212] via-[#1E1E1E] to-[#2C2C2C] text-white shadow-2xl border-b border-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-xl font-bold hover:opacity-80 transition-opacity"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-7 h-7"
          >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
          </svg>
          <span>ExamPrepare</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 flex-grow justify-center">
          {navLinks.map((link) => (
            <NavItem 
              key={link.href} 
              {...link} 
              active={location.pathname === link.href} 
            />
          ))}
        </nav>

        {/* User Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <ProfileDropdown user={user} onLogout={handleLogout} />
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link 
                to="/login" 
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors text-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1E1E1E] px-4 py-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <link.icon className="w-5 h-5 text-gray-400" />
                <span className="text-white">{link.label}</span>
              </Link>
            ))}
            
            {user ? (
              <>
                <div className="border-t border-gray-800 pt-3">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/5"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-white">Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/5 text-left"
                  >
                    <LogOut className="w-5 h-5 text-red-400" />
                    <span className="text-red-400">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link
                  to="/login"
                  className="text-center bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-center bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;