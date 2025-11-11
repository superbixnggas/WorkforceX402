import React, { useState, useEffect } from 'react';
import Header from './layout/Header';
import Footer from './layout/Footer';
import AnalyticsCards from './analytics/AnalyticsCards';
import Charts from './charts/Charts';
import RecentActivityTable from './analytics/RecentActivityTable';
import { analyticsCards, volumeChartData, userActivityData, privacyScoreData, recentActivity } from '../data/analyticsData';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading for dramatic effect
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
      default:
        return (
          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Enhanced Page Header with floating elements */}
              <div className="mb-8 relative">
                {/* Floating background elements */}
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-float"></div>
                <div className="absolute -top-2 -right-8 w-16 h-16 bg-purple-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '-2s' }}></div>
                <div className="absolute top-8 left-1/2 w-12 h-12 bg-teal-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '-4s' }}></div>
                
                <div className="relative z-10">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent glow-text mb-3">
                    Dashboard Overview
                  </h1>
                  <p className="text-gray-400 text-lg">
                    Real-time analytics and insights for your platform
                  </p>
                  
                  {/* Status indicator */}
                  <div className="flex items-center mt-4 space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-400 font-medium">System Online</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                      <span className="text-sm text-blue-400 font-medium">Data Live</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                      <span className="text-sm text-purple-400 font-medium">Analytics Ready</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analytics Cards */}
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full mr-3"></div>
                  <h2 className="text-xl font-semibold text-white">Key Metrics</h2>
                  <div className="ml-auto flex space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
                <AnalyticsCards cards={analyticsCards} />
              </div>

              {/* Charts Section */}
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-teal-400 to-green-400 rounded-full mr-3"></div>
                  <h2 className="text-xl font-semibold text-white">Analytics Overview</h2>
                  <div className="ml-auto text-sm text-gray-400">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
                <Charts 
                  volumeData={volumeChartData}
                  userActivityData={userActivityData}
                  privacyScoreData={privacyScoreData}
                />
              </div>

              {/* Recent Activity */}
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-orange-400 to-red-400 rounded-full mr-3"></div>
                  <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
                </div>
                <RecentActivityTable activities={recentActivity} />
              </div>
            </div>
          </main>
        );
      case 'analytics':
        return (
          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="mb-8 relative">
                {/* Floating elements for analytics page */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-float"></div>
                <div className="absolute top-8 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '-3s' }}></div>
                
                <div className="relative z-10">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent glow-text mb-3">
                    Advanced Analytics
                  </h1>
                  <p className="text-gray-400 text-lg">
                    Deep dive into your data with comprehensive analytics tools
                  </p>
                </div>
              </div>
              
              <div className="glass-card p-12 text-center relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-teal-500/10"></div>
                <div className="absolute top-4 right-4 w-16 h-16 bg-white/5 rounded-full animate-float"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/5 rounded-full animate-float" style={{ animationDelay: '-2s' }}></div>
                
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white rounded-full animate-spin"></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">Advanced Analytics Suite</h3>
                  <p className="text-gray-400 mb-6">Next-generation analytics features coming soon...</p>
                  <button className="btn-primary">
                    <span className="mr-2">Get Notified</span>
                    <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
                  </button>
                </div>
              </div>
            </div>
          </main>
        );
      case 'reports':
        return (
          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="mb-8 relative">
                {/* Floating elements for reports page */}
                <div className="absolute top-0 left-0 w-28 h-28 bg-teal-500/10 rounded-full blur-xl animate-float"></div>
                <div className="absolute top-4 right-8 w-20 h-20 bg-green-500/10 rounded-full blur-lg animate-float" style={{ animationDelay: '-1s' }}></div>
                
                <div className="relative z-10">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 via-green-400 to-blue-400 bg-clip-text text-transparent glow-text mb-3">
                    Reports Dashboard
                  </h1>
                  <p className="text-gray-400 text-lg">
                    Generate and manage comprehensive reports
                  </p>
                </div>
              </div>
              
              <div className="glass-card p-12 text-center relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-green-500/10 to-blue-500/10"></div>
                <div className="absolute top-4 left-4 w-14 h-14 bg-white/5 rounded-full animate-float"></div>
                <div className="absolute bottom-4 right-4 w-18 h-18 bg-white/5 rounded-full animate-float" style={{ animationDelay: '-2s' }}></div>
                
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-green-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">Report Generation</h3>
                  <p className="text-gray-400 mb-6">Custom report builder and analytics platform...</p>
                  <button className="btn-primary">
                    <span className="mr-2">Preview Features</span>
                    <div className="w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
                  </button>
                </div>
              </div>
            </div>
          </main>
        );
      case 'settings':
        return (
          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="mb-8 relative">
                {/* Floating elements for settings page */}
                <div className="absolute top-0 right-8 w-24 h-24 bg-orange-500/10 rounded-full blur-xl animate-float"></div>
                <div className="absolute top-8 left-4 w-16 h-16 bg-red-500/10 rounded-full blur-lg animate-float" style={{ animationDelay: '-1.5s' }}></div>
                
                <div className="relative z-10">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent glow-text mb-3">
                    Settings Panel
                  </h1>
                  <p className="text-gray-400 text-lg">
                    Configure your dashboard preferences and account settings
                  </p>
                </div>
              </div>
              
              <div className="glass-card p-12 text-center relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10"></div>
                <div className="absolute top-4 right-4 w-12 h-12 bg-white/5 rounded-full animate-float"></div>
                <div className="absolute bottom-4 left-4 w-20 h-20 bg-white/5 rounded-full animate-float" style={{ animationDelay: '-1s' }}></div>
                
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white rounded-full animate-bounce-gentle"></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">Configuration Options</h3>
                  <p className="text-gray-400 mb-6">Advanced settings and customization tools...</p>
                  <button className="btn-primary">
                    <span className="mr-2">Access Settings</span>
                    <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce"></div>
                  </button>
                </div>
              </div>
            </div>
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background with particles */}
      <div className="fixed inset-0 -z-10">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 animate-gradient-x"></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Large gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <div className={`flex-1 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {renderContent()}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;