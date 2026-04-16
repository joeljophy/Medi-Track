import React from 'react';
import { toast } from 'sonner';
import { Icon } from '../components/Icon';
import { cn } from '../lib/utils';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  ComposedChart
} from 'recharts';

const monthlyData = [
  { month: 'Jan', appointments: 400, emergencies: 240, staff: 120 },
  { month: 'Feb', appointments: 300, emergencies: 139, staff: 125 },
  { month: 'Mar', appointments: 200, emergencies: 980, staff: 130 },
  { month: 'Apr', appointments: 278, emergencies: 390, staff: 135 },
  { month: 'May', appointments: 189, emergencies: 480, staff: 140 },
  { month: 'Jun', appointments: 239, emergencies: 380, staff: 145 },
  { month: 'Jul', appointments: 349, emergencies: 430, staff: 150 },
];

export const ReportsScreen = () => {
  const handleRefresh = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
      loading: 'Synchronizing clinical data stream...',
      success: 'Data stream refreshed successfully',
      error: 'Failed to synchronize data',
    });
  };

  const handleExport = (type: string) => {
    toast.info(`Exporting reports as ${type}...`);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Reports & Analytics</h1>
          <p className="text-on-surface-variant mt-1 font-body">Detailed clinical and operational data analysis.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => handleExport('PDF')}
            className="px-4 py-2 bg-white border border-outline-variant/20 rounded-lg text-xs font-bold hover:bg-surface-container-low transition-all flex items-center gap-2"
          >
            <Icon name="picture_as_pdf" className="text-primary-container" />
            Export PDF
          </button>
          <button 
            onClick={() => handleExport('CSV')}
            className="px-4 py-2 bg-white border border-outline-variant/20 rounded-lg text-xs font-bold hover:bg-surface-container-low transition-all flex items-center gap-2"
          >
            <Icon name="table_chart" className="text-primary-container" />
            Export CSV
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KPI Cards */}
        {[
          { label: 'Avg Patient Wait Time', value: '18 min', trend: '-12%', icon: 'timer' },
          { label: 'Staff Efficiency', value: '94.2%', trend: '+2.4%', icon: 'engineering' },
          { label: 'Resource Utilization', value: '82.5%', trend: '+5.1%', icon: 'inventory' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-primary-container/5 rounded-lg">
                <Icon name={kpi.icon} className="text-primary-container" />
              </div>
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full",
                kpi.trend.startsWith('+') ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              )}>
                {kpi.trend}
              </span>
            </div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{kpi.label}</p>
            <h4 className="text-2xl font-extrabold text-on-surface mt-1">{kpi.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Overview Chart */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-outline-variant/10 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-on-surface">Monthly Operational Overview</h3>
            <Icon name="more_vert" className="text-on-surface-variant cursor-pointer" />
          </div>
          <div className="h-80 w-full min-h-[320px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <ComposedChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEAEA" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8E9299' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8E9299' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: '12px', 
                    border: '1px solid #EAEAEA',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                  }} 
                />
                <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
                <Bar dataKey="appointments" fill="#65000B" radius={[4, 4, 0, 0]} barSize={30} name="Appointments" />
                <Line type="monotone" dataKey="emergencies" stroke="#D8CFC4" strokeWidth={3} dot={{ r: 4 }} name="Emergencies" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Staffing Levels Chart */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-outline-variant/10 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-on-surface">Staffing Levels</h3>
            <Icon name="more_vert" className="text-on-surface-variant cursor-pointer" />
          </div>
          <div className="h-80 w-full min-h-[320px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEAEA" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8E9299' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8E9299' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: '12px', 
                    border: '1px solid #EAEAEA'
                  }} 
                />
                <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
                <Line type="stepAfter" dataKey="staff" stroke="#65000B" strokeWidth={3} dot={{ r: 4 }} name="Total Staff" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-container/10 rounded-full flex items-center justify-center">
            <Icon name="auto_awesome" className="text-primary-container" />
          </div>
          <div>
            <h4 className="font-bold text-on-surface">AI Insights Available</h4>
            <p className="text-sm text-on-surface-variant">Gemini has generated 3 new operational insights based on this data.</p>
          </div>
        </div>
        <button 
          onClick={() => toast.info('Generating AI insights...')}
          className="bg-primary-container text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-primary transition-all whitespace-nowrap"
        >
          View Insights
        </button>
      </div>
    </div>
  );
};
