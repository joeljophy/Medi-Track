import React from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Icon } from '../components/Icon';
import { cn } from '../lib/utils';

export const SystemSettingsScreen = () => {
  const handleSave = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: 'Updating system configuration...',
      success: 'All settings saved successfully',
      error: 'Failed to update settings',
    });
  };

  const handleDiscard = () => {
    toast.info('Changes discarded. Reverting to previous state...');
  };

  const handleToggle = (setting: string, enabled: boolean) => {
    toast.info(`${setting} is now ${enabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">System Settings</h1>
        <p className="text-on-surface-variant mt-1 font-body">Configure global preferences, security protocols, and system behavior.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Rail */}
        <nav className="lg:col-span-3 space-y-2">
          {[
            { name: 'General Settings', icon: 'settings', active: true },
            { name: 'User & Access', icon: 'manage_accounts' },
            { name: 'Notification Settings', icon: 'notifications_active' },
            { name: 'Security Settings', icon: 'security' },
            { name: 'System Preferences', icon: 'tune' },
            { name: 'API & Integrations', icon: 'api' },
          ].map((item) => (
            <button 
              key={item.name}
              onClick={() => toast.info(`Switched to ${item.name}`)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                item.active 
                  ? "bg-primary-container text-on-primary shadow-md" 
                  : "text-on-surface-variant hover:bg-surface-container-low"
              )}
            >
              <Icon name={item.icon} className="text-lg" />
              {item.name}
            </button>
          ))}
        </nav>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-8">
          {/* General Settings */}
          <section className="bg-white rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
            <div className="p-8 border-b border-surface-container">
              <h3 className="text-xl font-bold text-on-surface">General Settings</h3>
              <p className="text-sm text-on-surface-variant">Basic configuration for the MediTrack portal.</p>
            </div>
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-on-surface-variant tracking-widest">Portal Name</label>
                  <input 
                    className="w-full bg-surface-container-low border-b-2 border-outline-variant px-4 py-3 focus:border-primary-container outline-none transition-all rounded-t-lg font-medium" 
                    defaultValue="" 
                    placeholder="Enter portal name"
                    type="text" 
                    onChange={() => toast.info('Portal name modified')}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-on-surface-variant tracking-widest">System Language</label>
                  <select 
                    onChange={(e) => toast.info(`Language changed to ${e.target.value}`)}
                    className="w-full bg-surface-container-low border-b-2 border-outline-variant px-4 py-3 focus:border-primary-container outline-none transition-all rounded-t-lg font-medium"
                  >
                    <option>English (United States)</option>
                    <option>Spanish (ES)</option>
                    <option>French (FR)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-on-surface-variant tracking-widest">Timezone</label>
                  <select 
                    onChange={(e) => toast.info(`Timezone changed to ${e.target.value}`)}
                    className="w-full bg-surface-container-low border-b-2 border-outline-variant px-4 py-3 focus:border-primary-container outline-none transition-all rounded-t-lg font-medium"
                  >
                    <option>UTC (Coordinated Universal Time)</option>
                    <option>EST (Eastern Standard Time)</option>
                    <option>PST (Pacific Standard Time)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-on-surface-variant tracking-widest">Date Format</label>
                  <select 
                    onChange={(e) => toast.info(`Date format changed to ${e.target.value}`)}
                    className="w-full bg-surface-container-low border-b-2 border-outline-variant px-4 py-3 focus:border-primary-container outline-none transition-all rounded-t-lg font-medium"
                  >
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Security Settings Preview */}
          <section className="bg-white rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
            <div className="p-8 border-b border-surface-container">
              <h3 className="text-xl font-bold text-on-surface">Security Settings</h3>
              <p className="text-sm text-on-surface-variant">Manage authentication and access protocols.</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary-container/10 flex items-center justify-center rounded-lg">
                    <Icon name="vibration" className="text-primary-container" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Two-Factor Authentication (2FA)</p>
                    <p className="text-xs text-on-surface-variant">Require a secondary code for all administrative logins.</p>
                  </div>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    defaultChecked 
                    onChange={(e) => handleToggle('2FA', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-container-high after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary-container/10 flex items-center justify-center rounded-lg">
                    <Icon name="timer" className="text-primary-container" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Session Timeout</p>
                    <p className="text-xs text-on-surface-variant">Automatically logout users after 30 minutes of inactivity.</p>
                  </div>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    defaultChecked 
                    onChange={(e) => handleToggle('Session Timeout', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-container-high after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-4 pb-8">
            <button 
              onClick={handleDiscard}
              className="px-8 py-3 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Discard Changes
            </button>
            <button 
              onClick={handleSave}
              className="bg-primary-container text-on-primary px-12 py-3 rounded-xl font-bold shadow-lg hover:bg-primary transition-all active:scale-95"
            >
              Save All Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
