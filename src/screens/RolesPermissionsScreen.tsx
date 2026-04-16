import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Icon } from '../components/Icon';
import { cn } from '../lib/utils';

interface Role {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  lastModified: string;
  permissions: Record<string, string[]>;
}

const initialRoles: Role[] = [
  {
    id: 'R-001',
    name: 'Super Administrator',
    description: 'Full system access with ability to manage all modules, users, and global settings.',
    memberCount: 2,
    lastModified: '2024-03-20',
    permissions: {
      'Dashboard': ['view', 'create', 'edit', 'delete'],
      'User Management': ['view', 'create', 'edit', 'delete'],
      'Appointments': ['view', 'create', 'edit', 'delete'],
      'Inventory': ['view', 'create', 'edit', 'delete'],
      'Reports': ['view', 'create', 'edit', 'delete'],
      'Settings': ['view', 'create', 'edit', 'delete'],
    }
  },
  {
    id: 'R-002',
    name: 'Medical Doctor',
    description: 'Access to patient records, appointments, and medical reports. Limited administrative access.',
    memberCount: 12,
    lastModified: '2024-03-15',
    permissions: {
      'Dashboard': ['view'],
      'User Management': ['view'],
      'Appointments': ['view', 'create', 'edit'],
      'Inventory': ['view'],
      'Reports': ['view', 'create'],
      'Settings': [],
    }
  },
  {
    id: 'R-003',
    name: 'Head Nurse',
    description: 'Management of nursing staff, inventory oversight, and appointment coordination.',
    memberCount: 5,
    lastModified: '2024-03-10',
    permissions: {
      'Dashboard': ['view'],
      'User Management': ['view'],
      'Appointments': ['view', 'create', 'edit'],
      'Inventory': ['view', 'edit'],
      'Reports': ['view'],
      'Settings': [],
    }
  },
  {
    id: 'R-004',
    name: 'IT Support',
    description: 'System monitoring, technical troubleshooting, and backup management.',
    memberCount: 3,
    lastModified: '2024-03-25',
    permissions: {
      'Dashboard': ['view'],
      'User Management': ['view'],
      'Appointments': [],
      'Inventory': [],
      'Reports': ['view'],
      'Settings': ['view', 'edit'],
    }
  }
];

const modules = [
  'Dashboard', 'User Management', 'Appointments', 'Inventory', 'Reports', 'Settings'
];

const actions = ['view', 'create', 'edit', 'delete'];

export const RolesPermissionsScreen = () => {
  const [selectedRoleId, setSelectedRoleId] = useState(initialRoles[0].id);
  const [roles, setRoles] = useState(initialRoles);
  const [isSaving, setIsSaving] = useState(false);

  const selectedRole = roles.find(r => r.id === selectedRoleId) || roles[0];

  const handleTogglePermission = (module: string, action: string) => {
    setRoles(prevRoles => prevRoles.map(role => {
      if (role.id !== selectedRoleId) return role;

      const currentModulePerms = role.permissions[module] || [];
      const newModulePerms = currentModulePerms.includes(action)
        ? currentModulePerms.filter(a => a !== action)
        : [...currentModulePerms, action];

      return {
        ...role,
        permissions: {
          ...role.permissions,
          [module]: newModulePerms
        }
      };
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: `Updating ${selectedRole.name} permissions...`,
      success: () => {
        setIsSaving(false);
        return 'Permissions synchronized successfully';
      },
      error: () => {
        setIsSaving(false);
        return 'Synchronization failed';
      },
    });
  };

  return (
    <div className="space-y-10 max-w-[1400px] mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-on-surface/10 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary-container font-mono text-xs font-bold uppercase tracking-[0.2em]">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
            Access Control System v2.4
          </div>
          <h1 className="text-5xl font-extrabold text-on-surface tracking-tighter italic font-serif">
            Roles & Permissions
          </h1>
          <p className="text-on-surface-variant max-w-2xl font-medium leading-relaxed">
            Configure granular access levels for the MediTrack ecosystem. Changes are applied in real-time to active sessions.
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => toast.info('Exporting permissions matrix...')}
            className="px-6 py-3 border border-outline-variant rounded-xl font-bold text-sm hover:bg-surface-container-low transition-all flex items-center gap-2"
          >
            <Icon name="download" />
            Export Matrix
          </button>
          <button 
            onClick={() => toast.info('Audit logs opened')}
            className="px-6 py-3 border border-outline-variant rounded-xl font-bold text-sm hover:bg-surface-container-low transition-all flex items-center gap-2"
          >
            <Icon name="history" />
            View Audit
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Left Panel: Role Selection */}
        <div className="xl:col-span-4 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black text-on-surface-variant uppercase tracking-[0.2em] italic font-serif">
              System Roles
            </h2>
            <button 
              onClick={() => toast.info('Add role modal')}
              className="text-primary-container hover:underline text-xs font-bold flex items-center gap-1"
            >
              <Icon name="add" className="text-sm" />
              New Role
            </button>
          </div>

          <div className="space-y-3">
            {roles.map((role) => (
              <motion.div
                key={role.id}
                whileHover={{ x: 4 }}
                onClick={() => setSelectedRoleId(role.id)}
                className={cn(
                  "group relative p-6 rounded-2xl cursor-pointer transition-all border-2",
                  selectedRoleId === role.id 
                    ? "bg-on-surface text-bg-color border-on-surface shadow-xl" 
                    : "bg-white border-outline-variant/10 hover:border-on-surface/20"
                )}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={cn(
                    "font-mono text-[10px] font-bold tracking-widest px-2 py-1 rounded",
                    selectedRoleId === role.id ? "bg-white/10 text-white" : "bg-surface-container-low text-on-surface-variant"
                  )}>
                    {role.id}
                  </span>
                  <div className="flex items-center gap-1">
                    <Icon name="group" className="text-xs opacity-50" />
                    <span className="text-[10px] font-bold">{role.memberCount}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 tracking-tight">{role.name}</h3>
                <p className={cn(
                  "text-xs leading-relaxed line-clamp-2",
                  selectedRoleId === role.id ? "text-white/70" : "text-on-surface-variant"
                )}>
                  {role.description}
                </p>
                
                {selectedRoleId === role.id && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-12 bg-primary-container rounded-full"
                  />
                )}
              </motion.div>
            ))}
          </div>

          <div className="p-6 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant space-y-4">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Icon name="info" className="text-sm" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Security Tip</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed italic font-serif">
              "Always follow the principle of least privilege. Grant only the minimum permissions required for a user to perform their duties."
            </p>
          </div>
        </div>

        {/* Right Panel: Permissions Matrix */}
        <div className="xl:col-span-8">
          <div className="bg-white rounded-3xl shadow-2xl border border-outline-variant/10 overflow-hidden flex flex-col min-h-[600px]">
            <div className="p-8 border-b border-surface-container-high bg-surface-container-lowest flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-on-surface tracking-tight">
                    {selectedRole.name}
                  </h2>
                  <span className="px-2 py-0.5 bg-primary-container/10 text-primary-container text-[10px] font-bold rounded uppercase">
                    Active Matrix
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant font-medium italic font-serif">
                  Last modified by Admin on {selectedRole.lastModified}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    setRoles(prev => prev.map(r => r.id === selectedRoleId ? {
                      ...r,
                      permissions: modules.reduce((acc, m) => ({ ...acc, [m]: [...actions] }), {})
                    } : r));
                    toast.success('All permissions granted');
                  }}
                  className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors"
                >
                  Grant All
                </button>
                <div className="w-px h-6 bg-outline-variant/20 mx-1" />
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-on-surface text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-primary-container/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Icon name="sync" className="text-sm" />
                  )}
                  Sync Changes
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/30">
                    <th className="py-6 px-8 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] italic font-serif">
                      Module / Capability
                    </th>
                    {actions.map(action => (
                      <th key={action} className="py-6 px-4 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] text-center">
                        {action}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  {modules.map((module) => (
                    <tr key={module} className="group hover:bg-surface-container-low/20 transition-colors">
                      <td className="py-6 px-8">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant group-hover:bg-primary-container/10 group-hover:text-primary-container transition-colors">
                            <Icon name={
                              module === 'Dashboard' ? 'dashboard' :
                              module === 'User Management' ? 'people' :
                              module === 'Appointments' ? 'event' :
                              module === 'Inventory' ? 'inventory_2' :
                              module === 'Reports' ? 'analytics' : 'settings'
                            } className="text-sm" />
                          </div>
                          <span className="font-bold text-on-surface tracking-tight">{module}</span>
                        </div>
                      </td>
                      {actions.map((action) => {
                        const isEnabled = (selectedRole.permissions[module] || []).includes(action);
                        return (
                          <td key={action} className="py-6 px-4 text-center">
                            <button
                              onClick={() => handleTogglePermission(module, action)}
                              className={cn(
                                "w-10 h-10 rounded-xl transition-all flex items-center justify-center mx-auto border-2",
                                isEnabled 
                                  ? "bg-primary-container/10 border-primary-container text-primary-container shadow-inner" 
                                  : "bg-surface-container-low border-transparent text-on-surface-variant/30 hover:border-outline-variant"
                              )}
                            >
                              <Icon name={isEnabled ? 'check_circle' : 'circle'} className={cn("text-lg", isEnabled ? "scale-100" : "scale-75 opacity-50")} />
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-8 bg-surface-container-lowest border-t border-surface-container-high">
              <div className="flex items-start gap-4 p-4 bg-primary-container/5 rounded-2xl border border-primary-container/10">
                <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container shrink-0">
                  <Icon name="security" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-on-surface">Security Enforcement Notice</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Updating these permissions will immediately affect all users currently assigned to the <span className="font-bold text-on-surface">{selectedRole.name}</span> role. 
                    Ensure you have verified the impact on critical workflows before syncing changes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
