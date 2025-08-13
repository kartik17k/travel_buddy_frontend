import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, User, LogOut, Home, PlusCircle, Layout } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <MapPin className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Travel Buddy
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                isActive('/') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            <Link
              to="/generate"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                isActive('/generate') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Generate</span>
            </Link>

            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                  isActive('/dashboard') 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
                }`}
              >
                <Layout className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-slate-50 rounded-lg">
                  <User className="h-4 w-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">
                    {user?.full_name || user?.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive('/login')
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-slate-200">
        <div className="flex items-center justify-around py-2">
          <Link
            to="/"
            className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
              isActive('/') ? 'text-primary-600' : 'text-slate-600'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>
          
          <Link
            to="/generate"
            className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
              isActive('/generate') ? 'text-primary-600' : 'text-slate-600'
            }`}
          >
            <PlusCircle className="h-5 w-5" />
            <span className="text-xs">Generate</span>
          </Link>

          {isAuthenticated && (
            <Link
              to="/dashboard"
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                isActive('/dashboard') ? 'text-primary-600' : 'text-slate-600'
              }`}
            >
              <Layout className="h-5 w-5" />
              <span className="text-xs">Dashboard</span>
            </Link>
          )}

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex flex-col items-center space-y-1 px-3 py-2 text-slate-600 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-xs">Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                isActive('/login') ? 'text-primary-600' : 'text-slate-600'
              }`}
            >
              <User className="h-5 w-5" />
              <span className="text-xs">Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;