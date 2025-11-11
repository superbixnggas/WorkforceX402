import React from 'react';
import { Menu, Wallet, Search, Bell, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Sparkles },
    { id: 'analytics', label: 'Analytics', icon: Sparkles },
    { id: 'reports', label: 'Reports', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Sparkles }
  ];

  return (
    <header className="dashboard-header border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title with enhanced styling */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center group cursor-pointer">
              <div className="relative">
                <Menu className="h-6 w-6 text-blue-400 mr-3 transition-all duration-300 group-hover:scale-110 group-hover:text-blue-300" />
                <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl group-hover:bg-blue-300/30 transition-all duration-300"></div>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent glow-text">
                Analytics Dashboard
              </h1>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex space-x-2">
            {navigationItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`nav-link relative ${
                  activeTab === item.id ? 'active' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="relative z-10">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Right side actions with enhanced styling */}
          <div className="flex items-center space-x-3">
            {/* Search with glass effect */}
            <button className="relative p-2 text-gray-300 hover:text-white rounded-lg transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Search className="h-5 w-5 relative z-10" />
            </button>
            
            {/* Notifications with pulse effect */}
            <button className="relative p-2 text-gray-300 hover:text-white rounded-lg transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-teal-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Bell className="h-5 w-5 relative z-10" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-gradient-to-r from-red-400 to-pink-400 rounded-full animate-pulse"></span>
            </button>

            {/* Enhanced Wallet Selector */}
            <button className="relative flex items-center space-x-2 px-6 py-2.5 rounded-lg overflow-hidden group pulse-glow">
              {/* Background gradient animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 transition-transform duration-500 group-hover:scale-105"></div>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
              <div className="relative z-10 flex items-center space-x-2">
                <Wallet className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">Connect Wallet</span>
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <div className="md:hidden py-3">
          <div className="flex space-x-2 overflow-x-auto">
            {navigationItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`nav-link whitespace-nowrap relative ${
                  activeTab === item.id ? 'active' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="relative z-10">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;