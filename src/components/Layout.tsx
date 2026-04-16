import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from './Icon';
import { cn } from '../lib/utils';

const navItems = [
  { name: 'Dashboard', icon: 'dashboard', path: '/' },
  { name: 'User Management', icon: 'group', path: '/users' },
  { name: 'Roles & Permissions', icon: 'rule', path: '/roles' },
  { name: 'Reports & Analytics', icon: 'analytics', path: '/reports' },
  { name: 'System Monitoring', icon: 'monitor_heart', path: '/monitoring' },
  { name: 'Backup & Restore', icon: 'settings_backup_restore', path: '/backup' },
  { name: 'Audit Logs', icon: 'history_edu', path: '/audit' },
  { name: 'System Settings', icon: 'settings', path: '/settings' },
];

import { toast } from 'sonner';

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="bg-secondary-container h-screen w-64 fixed left-0 top-0 pt-20 flex flex-col overflow-y-auto custom-scrollbar z-40">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5lGYS2QxDQWxopVOEOP76XYsSWLMeaYx1EjjCF9kBjrgHrCkppLP_jTvUJG9KCfR1qnLux_kFfFaOC5bHsaJ21Cm0MZxvrbJwRho5qYxipWBp2KLv8ztuL0dVpLGVPHCDT-mIbwNBtZBIIO1OeJltydfSAh-D-WZcsu6AagHnwaB6seUMXdgbXdJWsSalNTIA8vty0wEPud_zufKjmtARuKp0drlv1GV1MY9dLl8SlhPNOGnVGed3wtkkXEQvYg8JQiE4kzERPC0" 
            alt="Admin" 
            className="w-10 h-10 rounded-full bg-white/50"
          />
          <div>
            <p className="font-headline font-black text-primary-container text-sm">MediTrack</p>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">System Administrator</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "mx-2 py-3 px-4 flex items-center gap-3 font-body text-sm transition-all rounded-lg",
                isActive 
                  ? "bg-white/50 dark:bg-white/10 text-primary-container font-bold" 
                  : "text-on-surface-variant hover:text-primary-container hover:bg-white/30"
              )}
            >
              <Icon name={item.icon} fill={isActive} className={cn("text-xl", isActive && "text-primary-container")} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 mt-6 border-t border-outline-variant/20 pt-6 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-white text-xs font-bold">MT</div>
          <div>
            <p className="text-xs font-bold text-on-surface">MediTrack v2.4</p>
            <p className="text-[10px] text-on-surface-variant">Cloud Infrastructure</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export const TopBar = () => {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info('Search functionality triggered');
  };

  return (
    <header className="bg-white/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 shadow-[0_12px_32px_rgba(101,0,11,0.04)] h-16">
      <div className="flex justify-between items-center w-full px-8 h-full">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-container flex items-center justify-center rounded-lg">
              <Icon name="medical_services" className="text-on-primary" />
            </div>
            <span className="text-2xl font-headline font-extrabold text-primary-container tracking-tight">MediTrack</span>
          </div>
          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-surface-container-low px-4 py-2 rounded-full gap-2">
            <Icon name="search" className="text-on-surface-variant text-sm" />
            <input 
              className="bg-transparent border-none focus:ring-0 text-sm w-64 placeholder:text-on-surface-variant outline-none" 
              placeholder="Search system..." 
              type="text"
            />
          </form>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => toast.info('No new notifications')}
            className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant"
          >
            <Icon name="notifications" />
          </button>
          <button 
            onClick={() => toast.info('User Profile settings coming soon')}
            className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant"
          >
            <Icon name="account_circle" />
          </button>
          <Link 
            to="/login" 
            onClick={() => toast.success('Logged out successfully')}
            className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant"
          >
            <Icon name="logout" />
          </Link>
        </div>
      </div>
    </header>
  );
};
