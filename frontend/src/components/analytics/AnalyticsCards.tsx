import React, { useState, useEffect } from 'react';
import { DollarSign, Users, Shield, Search, TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { AnalyticsCard as AnalyticsCardType } from '../../data/analyticsData';

interface AnalyticsCardsProps {
  cards: AnalyticsCardType[];
}

const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ cards }) => {
  const [counters, setCounters] = useState<{ [key: number]: number }>({});
  
  // Animated counter effect
  useEffect(() => {
    cards.forEach((card, index) => {
      const targetValue = parseFloat(card.value.replace(/[^\d.]/g, ''));
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = targetValue / steps;
      let currentValue = 0;
      
      const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
          currentValue = targetValue;
          clearInterval(timer);
        }
        setCounters(prev => ({ ...prev, [index]: currentValue }));
      }, duration / steps);
      
      return () => clearInterval(timer);
    });
  }, [cards]);

  const getIcon = (iconName: string) => {
    const iconProps = { className: "h-6 w-6 relative z-10" };
    switch (iconName) {
      case 'DollarSign':
        return <DollarSign {...iconProps} />;
      case 'Users':
        return <Users {...iconProps} />;
      case 'Shield':
        return <Shield {...iconProps} />;
      case 'Search':
        return <Search {...iconProps} />;
      default:
        return <DollarSign {...iconProps} />;
    }
  };

  const getChangeIcon = (changeType: 'positive' | 'negative') => {
    if (changeType === 'positive') {
      return <TrendingUp className="h-4 w-4 animate-bounce-gentle" />;
    }
    return <TrendingDown className="h-4 w-4 animate-bounce-gentle" />;
  };

  const getChangeColor = (changeType: 'positive' | 'negative') => {
    return changeType === 'positive' ? 'text-teal-400' : 'text-red-400';
  };

  const formatAnimatedValue = (value: string, index: number) => {
    const numValue = parseFloat(value.replace(/[^\d.]/g, ''));
    const animatedValue = counters[index] || 0;
    
    if (value.includes('$')) {
      return `$${animatedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}K`;
    } else if (value.includes(',')) {
      return animatedValue.toLocaleString(undefined, { maximumFractionDigits: 0 });
    } else {
      return animatedValue.toFixed(2);
    }
  };

  const getCardGradient = (index: number) => {
    const gradients = [
      'from-blue-500/20 to-purple-500/20',
      'from-purple-500/20 to-pink-500/20', 
      'from-teal-500/20 to-blue-500/20',
      'from-orange-500/20 to-red-500/20'
    ];
    return gradients[index % gradients.length];
  };

  const getIconGradient = (index: number) => {
    const gradients = [
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-teal-400 to-teal-600',
      'from-orange-400 to-red-500'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className="analytics-card group relative overflow-hidden"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Background gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getCardGradient(index)} opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
          
          {/* Floating particles effect */}
          <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
            <Zap className="h-4 w-4 text-white animate-pulse" />
          </div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex-1">
              <p className="analytics-card-header flex items-center">
                <span className="mr-2">{card.title}</span>
                <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
              </p>
              
              <p className="analytics-card-value font-mono">
                {formatAnimatedValue(card.value, index)}
              </p>
              
              <div className={`flex items-center space-x-1 analytics-card-change ${getChangeColor(card.changeType)}`}>
                {getChangeIcon(card.changeType)}
                <span className="text-sm font-medium flex items-center">
                  {card.change > 0 ? '+' : ''}{card.change}%
                </span>
                <span className="text-xs text-gray-400 ml-1">vs last month</span>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <div className="relative">
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${getIconGradient(index)} rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300 scale-110`}></div>
                
                {/* Icon container */}
                <div className={`relative p-3 bg-gradient-to-r ${getIconGradient(index)} rounded-lg border border-white/20 backdrop-blur-sm`}>
                  <div className="text-white">
                    {getIcon(card.icon)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;