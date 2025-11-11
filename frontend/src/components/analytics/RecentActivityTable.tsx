import React, { useState } from 'react';
import { CheckCircle, Clock, XCircle, Activity, Zap, Eye, ArrowRight } from 'lucide-react';
import { RecentActivity } from '../../data/analyticsData';

interface RecentActivityTableProps {
  activities: RecentActivity[];
}

const RecentActivityTable: React.FC<RecentActivityTableProps> = ({ activities }) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const getStatusIcon = (status: 'success' | 'pending' | 'failed') => {
    const iconProps = { className: "h-4 w-4 relative z-10" };
    switch (status) {
      case 'success':
        return (
          <div className="relative">
            <CheckCircle {...iconProps} />
            <div className="absolute inset-0 bg-green-400/30 rounded-full blur-md animate-pulse"></div>
          </div>
        );
      case 'pending':
        return (
          <div className="relative">
            <Clock {...iconProps} className="animate-spin" />
            <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-md animate-pulse"></div>
          </div>
        );
      case 'failed':
        return (
          <div className="relative">
            <XCircle {...iconProps} />
            <div className="absolute inset-0 bg-red-400/30 rounded-full blur-md animate-pulse"></div>
          </div>
        );
      default:
        return <Activity {...iconProps} />;
    }
  };

  const getStatusGradient = (status: 'success' | 'pending' | 'failed') => {
    switch (status) {
      case 'success':
        return 'from-teal-500/20 to-green-500/20 border-teal-500/30';
      case 'pending':
        return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
      case 'failed':
        return 'from-red-500/20 to-pink-500/20 border-red-500/30';
      default:
        return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  const getIconGradient = (status: 'success' | 'pending' | 'failed') => {
    switch (status) {
      case 'success':
        return 'from-teal-400 to-green-500';
      case 'pending':
        return 'from-yellow-400 to-orange-500';
      case 'failed':
        return 'from-red-400 to-pink-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusBadge = (status: 'success' | 'pending' | 'failed') => {
    const baseClasses = "status-badge";
    switch (status) {
      case 'success':
        return `${baseClasses} status-success`;
      case 'pending':
        return `${baseClasses} status-pending`;
      case 'failed':
        return `${baseClasses} status-failed`;
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-300`;
    }
  };

  const getActivityTypeIcon = (type: string) => {
    if (type.includes('Volume')) return '📈';
    if (type.includes('User')) return '👥';
    if (type.includes('Privacy')) return '🔒';
    if (type.includes('Export')) return '📤';
    if (type.includes('Scan')) return '🔍';
    return '⚡';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <div className="data-table relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-teal-500/5"></div>
      
      <div className="relative z-10">
        {/* Enhanced header */}
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg mr-3">
                  <Activity className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <p className="text-sm text-gray-400">Latest system activities and queries</p>
            </div>
            <button className="btn-primary text-sm px-4 py-2 group">
              <Eye className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              View All
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Activity Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  When
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Result
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {activities.map((activity, index) => (
                <tr 
                  key={activity.id} 
                  className="group cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-900/20 hover:to-purple-900/20"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onMouseEnter={() => setHoveredRow(activity.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center group">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        {/* Glow effect */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${getIconGradient(activity.status)} rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300`}></div>
                        
                        {/* Icon container */}
                        <div className={`relative h-10 w-10 bg-gradient-to-r ${getIconGradient(activity.status)} rounded-full flex items-center justify-center border border-white/20 backdrop-blur-sm`}>
                          <span className="text-lg">{getActivityTypeIcon(activity.type)}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white group-hover:text-blue-200 transition-colors duration-200">
                          {activity.type}
                        </div>
                        <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                          {activity.type.includes('Volume') ? 'Financial Analysis' :
                           activity.type.includes('User') ? 'User Analytics' :
                           activity.type.includes('Privacy') ? 'Security Check' :
                           activity.type.includes('Export') ? 'Data Export' : 'System Scan'}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-200">
                        {formatTimestamp(activity.timestamp)}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-mono text-white group-hover:text-blue-200 transition-colors duration-200 font-semibold">
                        {activity.value}
                      </span>
                      {hoveredRow === activity.id && (
                        <ArrowRight className="h-3 w-3 text-blue-400 ml-2 animate-slide-in-right" />
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={getStatusBadge(activity.status)}>
                        {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                      </span>
                      {activity.status === 'success' && (
                        <Zap className="h-3 w-3 text-teal-400 animate-bounce-gentle" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Enhanced footer */}
        <div className="px-6 py-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-sm text-gray-300">
                Showing <span className="font-semibold text-white">{activities.length}</span> recent activities
              </p>
            </div>
            <button className="flex items-center text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 group">
              View all activity
              <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Hover shimmer effect */}
      {hoveredRow && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] animate-shimmer pointer-events-none"></div>
      )}
    </div>
  );
};

export default RecentActivityTable;