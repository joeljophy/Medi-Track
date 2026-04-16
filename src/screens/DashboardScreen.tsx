import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Icon } from '../components/Icon';
import { cn } from '../lib/utils';
import { handleError, ErrorSeverity, AppError } from '../lib/error-handler';
import { useUsers } from '../context/UserContext';

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

const appointmentData = [
  { name: 'Mon', count: 12 },
  { name: 'Tue', count: 19 },
  { name: 'Wed', count: 15 },
  { name: 'Thu', count: 22 },
  { name: 'Fri', count: 30 },
  { name: 'Sat', count: 10 },
  { name: 'Sun', count: 8 },
];

const caseData = [
  { name: 'Critical', value: 15, color: '#65000B' },
  { name: 'Stable', value: 45, color: '#D8CFC4' },
  { name: 'Recovering', value: 30, color: '#EAEAEA' },
  { name: 'Discharged', value: 10, color: '#4a4a4a' },
];

const resourceData = [
  { name: 'ICU', usage: 85 },
  { name: 'General', usage: 62 },
  { name: 'ER', usage: 92 },
  { name: 'Surgery', usage: 45 },
  { name: 'Lab', usage: 70 },
];
const stats = [
  { label: 'Total Users', value: '0', icon: 'person', trend: 'No data', trendColor: 'text-on-surface-variant' },
  { label: 'Active Doctors', value: '0', icon: 'medical_services' },
  { label: 'Medical Staff', value: '0', icon: 'badge' },
  { label: 'Appointments', value: '0', icon: 'calendar_today' },
  { label: 'Emergencies', value: '0', icon: 'emergency', color: 'text-on-surface-variant' },
  { label: 'System Alerts', value: '0', icon: 'warning' },
];

const activities: any[] = [];

export const DashboardScreen = () => {
  const navigate = useNavigate();
  const { users } = useUsers();

  const handleRefresh = () => {
    try {
      toast.promise(new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate a random refresh error
          if (Math.random() > 0.8) {
            reject(new AppError('Failed to synchronize with healthcare database', {
              severity: ErrorSeverity.HIGH,
              context: { service: 'SyncService' }
            }));
          } else {
            resolve(true);
          }
        }, 1000);
      }), {
        loading: 'Refreshing system data...',
        success: 'System data synchronized successfully',
        error: (err) => {
          handleError(err, { showToast: false });
          return err instanceof Error ? err.message : 'Failed to refresh data';
        },
      });
    } catch (error) {
      handleError(error);
    }
  };

  const handleQuickAction = (action: string) => {
    try {
      switch (action) {
        case 'Add User': navigate('/users'); break;
        case 'Assign Roles': navigate('/roles'); break;
        case 'View Reports': navigate('/reports'); break;
        case 'Backup Database': navigate('/backup'); break;
        case 'Audit Logs': navigate('/audit'); break;
        case 'System Settings': navigate('/settings'); break;
        default: toast.info(`Action "${action}" triggered`);
      }
    } catch (error) {
      handleError(error, { context: { action } });
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Welcome, Admin</h1>
        <p className="text-on-surface-variant mt-1 font-body">Manage system users, monitor activities, and control healthcare operations.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Total Users', value: users.length.toString(), icon: 'person', trend: 'No data', trendColor: 'text-on-surface-variant' },
          { label: 'Active Doctors', value: users.filter(u => u.role === 'Doctor').length.toString(), icon: 'medical_services' },
          { label: 'Medical Staff', value: users.filter(u => u.role === 'Nurse').length.toString(), icon: 'badge' },
          { label: 'Appointments', value: '24', icon: 'calendar_today' },
          { label: 'Emergencies', value: '3', icon: 'emergency', color: 'text-on-surface-variant' },
          { label: 'System Alerts', value: '2', icon: 'warning' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-container-low p-5 rounded-lg border-b-2 border-transparent hover:border-primary-container transition-all group cursor-pointer"
            onClick={() => toast.info(`Viewing details for ${stat.label}`)}
          >
            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <span className={cn("text-2xl font-bold font-headline text-on-surface", stat.color)}>{stat.value}</span>
              <Icon name={stat.icon} className="text-primary-container/20 group-hover:text-primary-container transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Advanced Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Appointments Trend */}
        <section className="xl:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold font-headline">Appointments Trend</h3>
              <p className="text-xs text-on-surface-variant">Weekly patient volume analysis</p>
            </div>
            <div className="flex gap-2">
              <button className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-colors">7D</button>
              <button className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded bg-primary-container text-on-primary shadow-sm">30D</button>
            </div>
          </div>
          <div className="h-72 w-full min-h-[288px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={appointmentData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#65000B" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#65000B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAEAEA" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#8E9299' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#8E9299' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: '8px', 
                    border: '1px solid #EAEAEA',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    fontSize: '12px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#65000B" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Case Distribution */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col gap-6">
          <h3 className="text-lg font-bold font-headline">Case Distribution</h3>
          <div className="h-64 w-full min-h-[256px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={caseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {caseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: '8px', 
                    border: '1px solid #EAEAEA',
                    fontSize: '12px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {caseData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{item.name}</span>
                <span className="text-xs font-bold ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* User Overview */}
        <section className="xl:col-span-2 bg-surface-container-lowest rounded-lg overflow-hidden flex flex-col shadow-sm">
          <div className="p-6 flex justify-between items-center">
            <h3 className="text-lg font-bold font-headline">User Overview</h3>
            <button 
              onClick={() => navigate('/users')}
              className="bg-primary-container hover:bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95 flex items-center gap-2 shadow-sm"
            >
              <Icon name="manage_accounts" className="text-sm" />
              Manage Users
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {users.length > 0 ? users.slice(0, 5).map((user, i) => (
                  <tr key={user.name} className={cn("hover:bg-surface-container-low transition-colors", i % 2 !== 0 && "bg-surface-container-low/30")}>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-xs font-bold text-on-secondary-container">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-medium">{user.name}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{user.role}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide",
                        user.status === 'Active' ? "bg-secondary-container/40 text-on-surface" : "bg-surface-container-low text-on-surface-variant"
                      )}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => {
                          navigate(`/users/${user.id}`);
                        }}
                        className="text-primary-container hover:underline text-xs font-bold"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant text-sm italic">No active users found in the system.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* System Monitoring */}
        <section className="bg-surface-container-lowest border-l-4 border-primary-container p-6 rounded-lg shadow-sm flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold font-headline">System Monitoring</h3>
              <p className="text-xs text-on-surface-variant">Real-time health status</p>
            </div>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-secondary-container/30 text-on-surface rounded-full text-[10px] font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span> Online
            </span>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold text-on-surface-variant">
                <span>SERVER LOAD</span>
                <span>42%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5">
                <div className="bg-primary-container h-1.5 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-bold text-on-surface-variant">
                <span>STORAGE</span>
                <span>78%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5">
                <div className="bg-secondary-container h-1.5 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-start gap-3 p-3 bg-error-container/30 rounded-lg cursor-pointer hover:bg-error-container/40 transition-colors" onClick={() => navigate('/backup')}>
              <Icon name="error" className="text-on-error-container" />
              <div>
                <p className="text-xs font-bold text-on-error-container">Critical Alert</p>
                <p className="text-[10px] text-on-error-container/80">Database backup delayed &gt; 4 hours.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-secondary-container/20 rounded-lg border border-secondary-container/30 cursor-pointer hover:bg-secondary-container/40 transition-colors" onClick={() => navigate('/audit')}>
              <Icon name="warning" className="text-primary-container" />
              <div>
                <p className="text-xs font-bold text-on-surface">System Warning</p>
                <p className="text-[10px] text-on-surface-variant">Unusual login pattern detected from IP 192.1.1.8</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Resource & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-surface-container-low p-6 rounded-xl flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold font-headline">Resource Utilization</h3>
            <button onClick={() => navigate('/reports')} className="text-primary-container text-xs font-bold hover:underline">View Full Reports</button>
          </div>
          <div className="h-64 w-full min-h-[256px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={resourceData} layout="vertical" margin={{ left: -20 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: '#141414' }}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: '8px', 
                    border: '1px solid #EAEAEA',
                    fontSize: '12px'
                  }} 
                />
                <Bar 
                  dataKey="usage" 
                  fill="#65000B" 
                  radius={[0, 4, 4, 0]} 
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold font-headline mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { name: 'Add User', icon: 'person_add' },
              { name: 'Assign Roles', icon: 'assignment_ind' },
              { name: 'View Reports', icon: 'summarize' },
              { name: 'Backup Database', icon: 'cloud_upload' },
              { name: 'Audit Logs', icon: 'list_alt' },
              { name: 'System Settings', icon: 'settings' },
            ].map((action) => (
              <button 
                key={action.name} 
                onClick={() => handleQuickAction(action.name)}
                className="bg-white hover:bg-surface-container-low border border-outline-variant/10 p-4 rounded-lg flex flex-col items-center gap-2 transition-all group active:scale-95 shadow-sm"
              >
                <Icon name={action.icon} className="text-primary-container group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-on-surface-variant">{action.name}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Recent Activity */}
      <section className="bg-white rounded-lg shadow-[0_12px_32px_rgba(101,0,11,0.04)] overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-container flex justify-between items-center">
          <h3 className="text-lg font-bold font-headline">Recent Activity</h3>
          <Icon name="refresh" className="text-on-surface-variant cursor-pointer hover:text-on-surface" onClick={handleRefresh} />
        </div>
        <div className="divide-y divide-surface-container">
          {activities.length > 0 ? activities.map((act, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-surface-container-low transition-colors">
              <div className="flex items-center gap-4">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", act.color)}>
                  <Icon name={act.icon} className="text-sm" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{act.title}</p>
                  <p className="text-xs text-on-surface-variant">{act.desc}</p>
                </div>
              </div>
              <span className="text-[10px] font-medium text-on-surface-variant uppercase">{act.time}</span>
            </div>
          )) : (
            <div className="px-6 py-12 text-center text-on-surface-variant text-sm italic">No recent system activity recorded.</div>
          )}
        </div>
      </section>
    </div>
  );
};
