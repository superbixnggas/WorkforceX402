import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Activity, PieChart, Sparkles } from 'lucide-react';

interface ChartsProps {
  volumeData: any[];
  userActivityData: any[];
  privacyScoreData: any[];
}

const Charts: React.FC<ChartsProps> = ({ volumeData, userActivityData, privacyScoreData }) => {
  const [animatedData, setAnimatedData] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Animate data appearance
    const timer = setTimeout(() => {
      setAnimatedData(volumeData || []);
    }, 500);

    return () => clearTimeout(timer);
  }, [volumeData]);

  const chartVariants = [
    {
      title: "Volume Over Time",
      subtitle: "Monthly trading volume in USD",
      icon: TrendingUp,
      gradient: "from-blue-400 to-cyan-400",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      data: volumeData,
      type: "bar",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "User Activity", 
      subtitle: "Daily active users this week",
      icon: Activity,
      gradient: "from-teal-400 to-green-400",
      bgGradient: "from-teal-500/20 to-green-500/20",
      data: userActivityData,
      type: "bar",
      color: "from-teal-500 to-green-500"
    },
    {
      title: "Privacy Score Trend",
      subtitle: "Weekly privacy score improvement", 
      icon: BarChart3,
      gradient: "from-purple-400 to-pink-400",
      bgGradient: "from-purple-500/20 to-pink-500/20",
      data: privacyScoreData,
      type: "line",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "User Distribution",
      subtitle: "Current user status breakdown",
      icon: PieChart,
      gradient: "from-orange-400 to-red-400", 
      bgGradient: "from-orange-500/20 to-red-500/20",
      data: [
        { name: 'Active', value: 68, color: 'from-blue-500 to-cyan-500' },
        { name: 'New', value: 20, color: 'from-teal-500 to-green-500' },
        { name: 'Inactive', value: 12, color: 'from-orange-500 to-red-500' }
      ],
      type: "pie",
      color: "from-orange-500 to-red-500"
    }
  ];

  const renderBarChart = (data: any[], color: string) => {
    if (!data || data.length === 0) return null;
    
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div className="h-64 flex items-end justify-around space-x-2 p-4">
        {data.map((item, index) => {
          const height = (item.value / maxValue) * 200;
          return (
            <div 
              key={index} 
              className="flex flex-col items-center group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative">
                <div 
                  className={`chart-bar bg-gradient-to-t ${color} rounded-t-md w-8 transition-all duration-500 hover:scale-110 cursor-pointer relative overflow-hidden`}
                  style={{ 
                    height: `${height}px`,
                    animation: isVisible ? 'fadeInUp 0.6s ease-out both' : 'none',
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {/* Animated glow effect */}
                  <div className="absolute inset-0 bg-white/20 rounded-t-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Value tooltip on hover */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {item.value.toLocaleString()}
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-400 mt-2 group-hover:text-white transition-colors duration-200">
                {item.name}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderLineChart = (data: any[]) => {
    if (!data || data.length === 0) return null;
    
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 280 + 10;
      const y = 200 - ((item.value - 85) / 15) * 180;
      return { x, y, value: item.value, name: item.name };
    });

    return (
      <div className="h-64 p-4">
        <svg className="w-full h-full" viewBox="0 0 300 200">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="30" height="20" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="300" height="200" fill="url(#grid)" />
          
          {/* Animated line */}
          <polyline
            fill="none"
            stroke="url(#purpleGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points.map(p => `${p.x},${p.y}`).join(' ')}
            style={{
              strokeDasharray: '1000',
              strokeDashoffset: isVisible ? '0' : '1000',
              transition: 'stroke-dashoffset 2s ease-in-out'
            }}
          />
          
          {/* Animated dots */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="url(#purpleGradient)"
              className="transition-all duration-300 hover:r-6"
              style={{
                opacity: isVisible ? '1' : '0',
                transitionDelay: `${index * 0.2}s`
              }}
            />
          ))}
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  };

  const renderPieChart = (data: any[]) => {
    if (!data || data.length === 0) return null;
    
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    
    return (
      <div className="h-64 flex items-center justify-center space-x-8">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (item.value / total) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          currentAngle = endAngle;
          
          const x1 = 120 + 60 * Math.cos((startAngle - 90) * Math.PI / 180);
          const y1 = 100 + 60 * Math.sin((startAngle - 90) * Math.PI / 180);
          const x2 = 120 + 60 * Math.cos((endAngle - 90) * Math.PI / 180);
          const y2 = 100 + 60 * Math.sin((endAngle - 90) * Math.PI / 180);
          
          const largeArcFlag = angle > 180 ? 1 : 0;
          const pathData = [
            `M 120 100`,
            `L ${x1} ${y1}`,
            `A 60 60 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `Z`
          ].join(' ');

          return (
            <div key={index} className="text-center group cursor-pointer">
              <div className="relative mb-3">
                <div className="w-20 h-20 rounded-full border-4 border-gray-700 overflow-hidden relative">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#colorGradient)"
                      strokeWidth="8"
                      strokeDasharray={`${percentage * 2.827} 282.7`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                      style={{
                        strokeDashoffset: isVisible ? '0' : '282.7',
                        transitionDelay: `${index * 0.2}s`
                      }}
                    />
                    <defs>
                      <linearGradient id={`colorGradient${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={item.color.split(' ')[1]} />
                        <stop offset="100%" stopColor={item.color.split(' ')[3]} />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Center content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{percentage.toFixed(0)}%</div>
                    </div>
                  </div>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12"></div>
                </div>
              </div>
              <p className="text-sm text-gray-400 group-hover:text-white transition-colors duration-200 font-medium">
                {item.name} Users
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {chartVariants.map((chart, index) => {
        const IconComponent = chart.icon;
        
        return (
          <div 
            key={index} 
            className="chart-container group relative overflow-hidden"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${chart.bgGradient} opacity-30 group-hover:opacity-50 transition-opacity duration-500`}></div>
            
            {/* Floating sparkles */}
            <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
              <Sparkles className="h-4 w-4 text-white animate-pulse" />
            </div>
            
            <div className="relative z-10">
              {/* Chart header */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <div className={`p-2 bg-gradient-to-r ${chart.gradient} rounded-lg mr-3`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-200 transition-colors duration-300">
                    {chart.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {chart.subtitle}
                </p>
              </div>
              
              {/* Chart content */}
              {chart.type === 'bar' && renderBarChart(chart.data, chart.color)}
              {chart.type === 'line' && renderLineChart(chart.data)}
              {chart.type === 'pie' && renderPieChart(chart.data)}
            </div>
            
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </div>
        );
      })}
    </div>
  );
};

export default Charts;