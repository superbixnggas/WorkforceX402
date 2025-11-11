export interface AnalyticsCard {
  title: string;
  value: string;
  change: number;
  changeType: 'positive' | 'negative';
  icon: string;
}

export interface RecentActivity {
  id: string;
  type: string;
  timestamp: string;
  value: string;
  status: 'success' | 'pending' | 'failed';
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
}

// Analytics Cards Data
export const analyticsCards: AnalyticsCard[] = [
  {
    title: "Total Volume",
    value: "$560K",
    change: 12.5,
    changeType: "positive",
    icon: "DollarSign"
  },
  {
    title: "Active Users",
    value: "2,847",
    change: 8.2,
    changeType: "positive",
    icon: "Users"
  },
  {
    title: "Privacy Score",
    value: "95.60",
    change: -2.1,
    changeType: "negative",
    icon: "Shield"
  },
  {
    title: "Queries Today",
    value: "156",
    change: 23.4,
    changeType: "positive",
    icon: "Search"
  }
];

// Recent Activity Data
export const recentActivity: RecentActivity[] = [
  {
    id: "1",
    type: "Volume Query",
    timestamp: "2025-11-11 18:45:00",
    value: "$125K",
    status: "success"
  },
  {
    id: "2", 
    type: "User Analysis",
    timestamp: "2025-11-11 18:30:00",
    value: "Active",
    status: "success"
  },
  {
    id: "3",
    type: "Privacy Check",
    timestamp: "2025-11-11 18:15:00",
    value: "92.5%",
    status: "pending"
  },
  {
    id: "4",
    type: "Data Export",
    timestamp: "2025-11-11 18:00:00",
    value: "2.3MB",
    status: "success"
  },
  {
    id: "5",
    type: "System Scan",
    timestamp: "2025-11-11 17:45:00",
    value: "Failed",
    status: "failed"
  }
];

// Chart Data for Volume Over Time
export const volumeChartData: ChartData[] = [
  { name: "Jan", value: 450000 },
  { name: "Feb", value: 380000 },
  { name: "Mar", value: 520000 },
  { name: "Apr", value: 480000 },
  { name: "May", value: 560000 },
  { name: "Jun", value: 620000 },
];

// Chart Data for User Activity
export const userActivityData: ChartData[] = [
  { name: "Mon", value: 2400 },
  { name: "Tue", value: 1398 },
  { name: "Wed", value: 9800 },
  { name: "Thu", value: 3908 },
  { name: "Fri", value: 4800 },
  { name: "Sat", value: 3800 },
  { name: "Sun", value: 4300 },
];

// Privacy Score Data
export const privacyScoreData: ChartData[] = [
  { name: "Week 1", value: 89.2 },
  { name: "Week 2", value: 91.5 },
  { name: "Week 3", value: 94.1 },
  { name: "Week 4", value: 95.6 },
];