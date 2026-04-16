import React from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Icon } from '../components/Icon';
import { cn } from '../lib/utils';

const logs: any[] = [];

export const AuditLogsScreen = () => {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info('Searching audit logs...');
  };

  const handleFilter = () => {
    toast.info('Filters applied to audit logs');
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Audit Logs</h1>
        <p className="text-on-surface-variant mt-1 font-body">Comprehensive history of all system actions and security events.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Logs', value: '0', icon: 'list_alt' },
          { label: 'Failed Actions', value: '0', icon: 'gpp_bad', color: 'text-primary-container' },
          { label: 'Security Alerts', value: '0', icon: 'security', color: 'text-secondary-container' },
          { label: 'Active Sessions', value: '0', icon: 'sensors' },
        ].map((stat) => (
          <div 
            key={stat.label} 
            onClick={() => toast.info(`Viewing details for ${stat.label}`)}
            className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10 cursor-pointer hover:shadow-md transition-all"
          >
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <span className={cn("text-2xl font-bold font-headline", stat.color || "text-on-surface")}>{stat.value}</span>
              <Icon name={stat.icon} className="text-primary-container/20" />
            </div>
          </div>
        ))}
      </div>

      {/* Filter & Search */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/10 flex flex-wrap items-center gap-6">
        <form onSubmit={handleSearch} className="flex-1 min-w-[300px] relative">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input 
            className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-b-2 border-outline-variant focus:border-primary-container outline-none transition-all text-sm rounded-t-lg" 
            placeholder="Search logs by user, action or ID..." 
            type="text"
          />
        </form>
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase ml-1">Date Range</label>
            <input 
              onChange={() => toast.info('Date range updated')}
              className="bg-surface-container-low border-none rounded-lg text-xs px-4 py-2 outline-none" 
              type="date" 
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase ml-1">Severity</label>
            <select 
              onChange={(e) => toast.info(`Filtering by severity: ${e.target.value}`)}
              className="bg-surface-container-low border-none rounded-lg text-xs px-4 py-2 outline-none"
            >
              <option>All Severities</option>
              <option>Critical</option>
              <option>Warning</option>
              <option>Info</option>
            </select>
          </div>
          <button 
            onClick={handleFilter}
            className="mt-4 bg-primary-container text-white px-6 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-primary transition-all"
          >
            Apply Filters
          </button>
        </div>
      </section>

      {/* Logs Table */}
      <section className="bg-white rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest">Log ID</th>
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest">Action</th>
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest">Target Resource</th>
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest">Timestamp</th>
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {logs.length > 0 ? logs.map((log, i) => (
                <tr 
                  key={log.id} 
                  onClick={() => toast.info(`Viewing full log details for ${log.id}`)}
                  className={cn("hover:bg-surface-container-low/30 transition-colors cursor-pointer", log.critical && "bg-primary-container/5")}
                >
                  <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">{log.id}</td>
                  <td className="px-6 py-4 font-bold text-sm text-on-surface">{log.user}</td>
                  <td className="px-6 py-4 text-sm font-medium">{log.action}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{log.target}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      log.status === 'Success' ? "bg-surface-container-low text-on-surface-variant" : "bg-primary-container/10 text-primary-container"
                    )}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-on-surface-variant">{log.time}</td>
                  <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">{log.ip}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-on-surface-variant text-sm italic">No audit logs available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-surface-container-low/30 flex items-center justify-between border-t border-surface-container">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Showing {logs.length} of {logs.length} logs</span>
          <div className="flex gap-2">
            <button 
              onClick={() => toast.info('Previous page')}
              className="px-4 py-2 bg-white border border-outline-variant/20 rounded-lg text-xs font-bold hover:bg-surface-container-low transition-colors"
            >
              Previous
            </button>
            <button 
              onClick={() => toast.info('Next page')}
              className="px-4 py-2 bg-white border border-outline-variant/20 rounded-lg text-xs font-bold hover:bg-surface-container-low transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
