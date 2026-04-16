import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Icon } from '../components/Icon';
import { cn } from '../lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface Metric {
  label: string;
  value: string;
  percent: number;
  icon: string;
  color: string;
}

export const SystemMonitoringScreen = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [deviceInfo, setDeviceInfo] = useState<any>({});

  // Detect device information
  useEffect(() => {
    const ua = window.navigator.userAgent;
    const cores = window.navigator.hardwareConcurrency || 4;
    const platform = (window.navigator as any).platform || 'Unknown';
    
    let os = 'Unknown OS';
    if (ua.indexOf('Win') !== -1) os = 'Windows';
    if (ua.indexOf('Mac') !== -1) os = 'macOS';
    if (ua.indexOf('X11') !== -1) os = 'UNIX';
    if (ua.indexOf('Linux') !== -1) os = 'Linux';
    if (/Android/.test(ua)) os = 'Android';
    if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';

    setDeviceInfo({
      os,
      cores,
      platform,
      browser: ua.split(' ').pop(),
      memory: (performance as any).memory ? Math.round((performance as any).memory.jsHeapSizeLimit / 1024 / 1024 / 1024) + 'GB' : 'Unknown'
    });
  }, []);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const cpuBase = 15 + Math.random() * 10;
      const ramBase = 40 + Math.random() * 5;
      const diskBase = 2 + Math.random() * 8;
      const netBase = 12 + Math.random() * 20;

      const newMetrics: Metric[] = [
        { label: 'CPU Usage', value: `${cpuBase.toFixed(1)}%`, percent: cpuBase, icon: 'processor', color: 'text-primary-container' },
        { label: 'RAM Usage', value: `${ramBase.toFixed(1)}%`, percent: ramBase, icon: 'memory', color: 'text-on-surface-variant' },
        { label: 'Disk I/O', value: `${diskBase.toFixed(1)} MB/s`, percent: (diskBase / 50) * 100, icon: 'speed', color: 'text-primary-container' },
        { label: 'Network', value: `${netBase.toFixed(1)} Mbps`, percent: (netBase / 100) * 100, icon: 'lan', color: 'text-on-surface-variant' },
      ];

      setMetrics(newMetrics);

      setHistory(prev => {
        const newPoint = {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          load: cpuBase,
          idle: 100 - cpuBase,
          network: netBase
        };
        const updated = [...prev, newPoint];
        return updated.slice(-20); // Keep last 20 points
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleStatClick = (label: string) => {
    toast.info(`Detailed diagnostics for ${label} on ${deviceInfo.os} device.`);
  };

  const handleViewLogs = () => {
    toast.info('Accessing browser console and system logs...');
  };

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-on-surface/10 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary-container font-mono text-xs font-bold uppercase tracking-[0.2em]">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
            Live Infrastructure Node: {deviceInfo.platform}
          </div>
          <h1 className="text-5xl font-extrabold text-on-surface tracking-tighter italic font-serif">
            System Monitoring
          </h1>
          <p className="text-on-surface-variant max-w-2xl font-medium leading-relaxed">
            Real-time telemetry from your {deviceInfo.os} device. Monitoring {deviceInfo.cores} logical cores and browser-allocated resources.
          </p>
        </div>
        <div className="flex bg-surface-container-low p-1 rounded-xl border border-outline-variant/10">
          <div className="px-4 py-2 text-center border-r border-outline-variant/20">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase">Cores</p>
            <p className="text-sm font-mono font-bold">{deviceInfo.cores}</p>
          </div>
          <div className="px-4 py-2 text-center">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase">Memory</p>
            <p className="text-sm font-mono font-bold">{deviceInfo.memory}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {metrics.map((stat) => (
            <motion.div 
              key={stat.label} 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => handleStatClick(stat.label)}
              className="bg-white p-8 rounded-3xl shadow-sm border border-outline-variant/10 cursor-pointer hover:shadow-xl transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] italic font-serif">{stat.label}</p>
                <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center group-hover:bg-primary-container/10 transition-colors">
                  <Icon name={stat.icon} className={cn("text-lg", stat.color)} />
                </div>
              </div>
              <div className="text-4xl font-extrabold text-on-surface mb-6 tracking-tighter font-mono">{stat.value}</div>
              <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.percent}%` }}
                  className={cn("h-full rounded-full", stat.color.replace('text', 'bg'))}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <section className="lg:col-span-2 bg-white rounded-3xl shadow-2xl border border-outline-variant/10 p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h3 className="text-2xl font-bold text-on-surface tracking-tight">Real-time Telemetry</h3>
              <p className="text-sm text-on-surface-variant italic font-serif">Live CPU load and network throughput history</p>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary-container" />
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">CPU Load</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary-container" />
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Network</span>
              </div>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#141414" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#141414" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#8E9299' }}
                  minTickGap={30}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#8E9299' }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="load" 
                  stroke="#141414" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorLoad)" 
                  animationDuration={1000}
                />
                <Area 
                  type="monotone" 
                  dataKey="network" 
                  stroke="#8E9299" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="transparent"
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-on-surface text-white rounded-3xl shadow-2xl p-10 flex flex-col gap-8">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold tracking-tight">Active Processes</h3>
            <p className="text-xs text-white/50 italic font-serif">Browser-level thread distribution</p>
          </div>
          
          <div className="space-y-6 flex-1">
            {[
              { name: 'Main Thread', usage: 12, color: 'bg-primary-container' },
              { name: 'Service Worker', usage: 4, color: 'bg-white/20' },
              { name: 'V8 Engine', usage: 24, color: 'bg-primary-container' },
              { name: 'GPU Process', usage: 18, color: 'bg-white/20' },
              { name: 'Network Stack', usage: 8, color: 'bg-white/20' },
            ].map((proc) => (
              <div key={proc.name} className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span>{proc.name}</span>
                  <span className="font-mono">{proc.usage}%</span>
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${proc.usage}%` }}
                    className={cn("h-full rounded-full", proc.color)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/10">
            <button 
              onClick={handleViewLogs}
              className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <Icon name="terminal" className="text-sm" />
              Open System Console
            </button>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
            <Icon name="check_circle" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase">Uptime</p>
            <p className="text-lg font-bold font-mono">99.98%</p>
          </div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container">
            <Icon name="dns" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase">Nodes</p>
            <p className="text-lg font-bold font-mono">14 Active</p>
          </div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary-container/10 flex items-center justify-center text-secondary-container">
            <Icon name="security" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase">Firewall</p>
            <p className="text-lg font-bold font-mono">Secure</p>
          </div>
        </div>
      </div>
    </div>
  );
};
