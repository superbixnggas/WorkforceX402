import React from 'react';
import { Github, Twitter, Linkedin, Mail, Heart, ExternalLink, Sparkles } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Documentation', href: '#', icon: '📚' },
    { label: 'API Reference', href: '#', icon: '🔗' },
    { label: 'Support', href: '#', icon: '💬' },
    { label: 'Status', href: '#', icon: '📊' }
  ];

  const companyLinks = [
    { label: 'About', href: '#', icon: 'ℹ️' },
    { label: 'Blog', href: '#', icon: '✍️' },
    { label: 'Careers', href: '#', icon: '💼' },
    { label: 'Contact', href: '#', icon: '📧' }
  ];

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub', color: 'from-gray-400 to-gray-600' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'from-blue-400 to-blue-600' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'from-blue-500 to-blue-700' },
    { icon: Mail, href: '#', label: 'Email', color: 'from-red-400 to-red-600' }
  ];

  return (
    <footer className="mt-auto relative overflow-hidden">
      {/* Glass morphism background */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-800/80 to-transparent backdrop-blur-md border-t border-white/10"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-float"></div>
      <div className="absolute top-4 right-1/3 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '-2s' }}></div>
      <div className="absolute bottom-4 left-1/2 w-20 h-20 bg-teal-500/10 rounded-full blur-lg animate-float" style={{ animationDelay: '-4s' }}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Enhanced Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg mr-3 border border-white/20">
                <Sparkles className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
                Analytics Dashboard
              </h3>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Comprehensive analytics platform providing real-time insights, 
              privacy-focused data analysis, and advanced reporting capabilities 
              for the modern web.
            </p>
            
            {/* Enhanced Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="group relative p-2.5 rounded-lg transition-all duration-300 hover:scale-110"
                  >
                    {/* Glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${social.color} rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300`}></div>
                    
                    {/* Icon container */}
                    <div className={`relative p-2 bg-gradient-to-r ${social.color} rounded-lg border border-white/20 backdrop-blur-sm`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Enhanced Quick Links */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-1 h-4 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full mr-2"></div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wide">
                Quick Links
              </h4>
            </div>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="group flex items-center text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    <span className="text-sm mr-2 opacity-70 group-hover:opacity-100 transition-opacity">
                      {link.icon}
                    </span>
                    <span className="relative">
                      {link.label}
                      <div className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                    </span>
                    <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Company Links */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-1 h-4 bg-gradient-to-b from-teal-400 to-green-400 rounded-full mr-2"></div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wide">
                Company
              </h4>
            </div>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="group flex items-center text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    <span className="text-sm mr-2 opacity-70 group-hover:opacity-100 transition-opacity">
                      {link.icon}
                    </span>
                    <span className="relative">
                      {link.label}
                      <div className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-400 to-green-400 group-hover:w-full transition-all duration-300"></div>
                    </span>
                    <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Enhanced Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <p className="text-gray-400 text-sm flex items-center">
                © {currentYear} Analytics Dashboard. All rights reserved.
                <Heart className="h-3 w-3 mx-1 text-red-400 animate-pulse" />
                Made with passion
              </p>
            </div>
            
            <div className="flex space-x-6">
              {[
                { label: 'Privacy Policy', href: '#', color: 'hover:text-blue-400' },
                { label: 'Terms of Service', href: '#', color: 'hover:text-purple-400' },
                { label: 'Cookie Policy', href: '#', color: 'hover:text-teal-400' }
              ].map((link, index) => (
                <a 
                  key={index}
                  href={link.href} 
                  className={`text-gray-400 ${link.color} text-sm transition-colors duration-200 relative group`}
                >
                  {link.label}
                  <div className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-current group-hover:w-full transition-all duration-300"></div>
                </a>
              ))}
            </div>
          </div>
          
          {/* Additional status indicator */}
          <div className="flex items-center justify-center mt-6 pt-4 border-t border-white/5">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>All systems operational</span>
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <span>API v2.1.0</span>
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] animate-shimmer pointer-events-none"></div>
    </footer>
  );
};

export default Footer;