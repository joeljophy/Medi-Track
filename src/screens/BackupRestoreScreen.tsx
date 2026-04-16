import React from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Icon } from '../components/Icon';
import { cn } from '../lib/utils';
import { handleError, ErrorSeverity, AppError } from '../lib/error-handler';

const history: any[] = [];

export const BackupRestoreScreen = () => {
  const handleCreateBackup = () => {
    try {
      toast.promise(new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate a critical storage error for demonstration
          if (Math.random() > 0.7) {
            reject(new AppError('Backup failed: S3 Storage quota exceeded', {
              severity: ErrorSeverity.HIGH,
              context: { storageTier: 'Standard', used: '98%' }
            }));
          } else {
            resolve(true);
          }
        }, 2000);
      }), {
        loading: 'Initiating system backup...',
        success: 'Backup created successfully: BKUP-20260322-MANUAL',
        error: (err) => {
          handleError(err, { showToast: false });
          return err instanceof Error ? err.message : 'Backup failed';
        },
      });
    } catch (error) {
      handleError(error);
    }
  };

  const handleRestore = () => {
    try {
      toast.promise(new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate a critical restore failure
          reject(new AppError('Critical: Database checksum mismatch detected during restore', {
            severity: ErrorSeverity.CRITICAL,
            context: { backupId: 'BKUP-LATEST', reason: 'Data corruption' }
          }));
        }, 3000);
      }), {
        loading: 'Restoring database from archive...',
        success: 'System restored successfully. Refreshing services...',
        error: (err) => {
          handleError(err, { showToast: false });
          return err instanceof Error ? err.message : 'Restore failed';
        },
      });
    } catch (error) {
      handleError(error);
    }
  };

  const handleAction = (action: string, id: string) => {
    try {
      if (action === 'Delete') {
        throw new AppError('Cannot delete a verified system backup', {
          severity: ErrorSeverity.MEDIUM,
          context: { backupId: id }
        });
      }
      toast.info(`${action} action triggered for backup ${id}`);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">Database Backup & Restore</h1>
        <p className="text-on-surface-variant font-medium">Manage system backups and ensure data safety</p>
      </header>

      {/* Storage Info Panel */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-low p-6 rounded-xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Icon name="database" className="text-primary-container" />
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Storage Used</span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-on-surface">0 GB</div>
            <div className="w-full bg-surface-container-highest h-2 rounded-full mt-2">
              <div className="bg-primary-container h-2 rounded-full" style={{ width: '0%' }}></div>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Icon name="cloud_queue" className="text-primary-container" />
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Available Space</span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-on-surface">0 GB</div>
            <p className="text-xs text-on-surface-variant mt-2 italic">Standard Tier S3 Storage</p>
          </div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Icon name="event_repeat" className="text-primary-container" />
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Backup Frequency</span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-on-surface">Daily</div>
            <p className="text-xs text-on-surface-variant mt-2">Next scheduled: 02:00 AM UTC</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Backup Configuration */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/15 flex flex-col gap-6">
            <h3 className="text-xl font-bold text-on-surface flex items-center gap-2">
              <Icon name="add_circle" />
              New Backup
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-on-surface-variant">Backup Name</label>
                <input className="bg-surface-container-low border-b-2 border-outline-variant px-0 py-2 focus:ring-0 focus:border-primary-container transition-all text-sm outline-none" placeholder="e.g. Weekly_Archive_Q3" type="text" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-on-surface-variant">Backup Type</label>
                <select className="bg-surface-container-low border-b-2 border-outline-variant px-0 py-2 focus:ring-0 focus:border-primary-container transition-all text-sm outline-none">
                  <option>Full Backup</option>
                  <option>Incremental</option>
                  <option>Differential</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-3 pt-4">
              <button 
                onClick={handleCreateBackup}
                className="bg-primary-container text-on-primary py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
              >
                <Icon name="backup" className="text-sm" />
                Create Backup
              </button>
              <button 
                onClick={() => toast.info('Backup scheduled for next window')}
                className="bg-secondary-fixed text-on-secondary-fixed py-3 rounded-lg font-bold text-sm active:scale-95 transition-all"
              >
                Schedule Backup
              </button>
            </div>
          </section>

          <section className="bg-error-container/20 p-6 rounded-xl border-2 border-error-container flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-error-container p-2 rounded-lg">
                <Icon name="warning" fill className="text-on-error-container" />
              </div>
              <div>
                <h4 className="text-on-error-container font-bold text-lg">Critical Warning</h4>
                <p className="text-on-error-container text-sm mt-1 leading-relaxed">Restoring will overwrite current system data. This action is irreversible once initiated.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-on-error-container/70">Select Backup to Restore</label>
                <select defaultValue="" className="w-full bg-white/50 border-b-2 border-error-container px-0 py-2 focus:ring-0 focus:border-on-error-container text-sm outline-none">
                  <option value="" disabled>No backups available...</option>
                </select>
              </div>
              <button 
                onClick={handleRestore}
                className="w-full bg-primary-container text-on-primary py-4 rounded-lg font-extrabold text-sm uppercase tracking-widest active:scale-95 transition-all shadow-xl mt-4"
              >
                Restore Database
              </button>
            </div>
          </section>
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
            <div className="px-8 py-6 flex items-center justify-between border-b border-surface-container-low">
              <h3 className="text-xl font-bold text-on-surface">Backup History</h3>
              <button 
                onClick={() => toast.info('Exporting logs...')}
                className="text-primary-container text-sm font-bold flex items-center gap-1 hover:underline"
              >
                <Icon name="download_done" className="text-sm" />
                Export Logs
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low">
                    <th className="px-8 py-4 text-xs font-bold uppercase text-on-surface-variant tracking-wider">Backup ID</th>
                    <th className="px-4 py-4 text-xs font-bold uppercase text-on-surface-variant tracking-wider">Name</th>
                    <th className="px-4 py-4 text-xs font-bold uppercase text-on-surface-variant tracking-wider">Date & Time</th>
                    <th className="px-4 py-4 text-xs font-bold uppercase text-on-surface-variant tracking-wider">Type</th>
                    <th className="px-4 py-4 text-xs font-bold uppercase text-on-surface-variant tracking-wider">Size</th>
                    <th className="px-4 py-4 text-xs font-bold uppercase text-on-surface-variant tracking-wider">Status</th>
                    <th className="px-8 py-4 text-xs font-bold uppercase text-on-surface-variant tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low">
                  {history.length > 0 ? history.map((item, i) => (
                    <tr key={item.id} className={cn("hover:bg-surface-container-low/30 transition-colors", i % 2 !== 0 && "bg-surface-container-low/20")}>
                      <td className="px-8 py-4 font-mono text-xs text-on-surface">{item.id}</td>
                      <td className="px-4 py-4 font-semibold text-sm">{item.name}</td>
                      <td className="px-4 py-4 text-xs text-on-surface-variant">{item.date}</td>
                      <td className="px-4 py-4 text-xs"><span className="bg-surface-container-highest px-2 py-1 rounded">{item.type}</span></td>
                      <td className="px-4 py-4 text-xs font-medium">{item.size}</td>
                      <td className="px-4 py-4 text-xs">
                        <span className={cn(
                          "inline-flex items-center gap-1 font-bold",
                          item.status === 'Success' ? "text-primary-container" : "text-on-surface-variant"
                        )}>
                          <Icon name={item.status === 'Success' ? 'check_circle' : 'error'} fill className="text-xs" />
                          {item.status}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleAction('Restore', item.id)}
                            className="text-on-surface-variant hover:text-primary-container p-1"
                          >
                            <Icon name="settings_backup_restore" className="text-lg" />
                          </button>
                          <button 
                            onClick={() => handleAction('Download', item.id)}
                            className="text-on-surface-variant hover:text-primary-container p-1"
                          >
                            <Icon name="download" className="text-lg" />
                          </button>
                          <button 
                            onClick={() => handleAction('Delete', item.id)}
                            className="text-on-surface-variant hover:text-primary-container p-1"
                          >
                            <Icon name="delete" className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="px-8 py-20 text-center text-on-surface-variant text-sm italic">No backup history found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-8 py-4 bg-surface-container-low flex items-center justify-between text-xs text-on-surface-variant font-medium">
              <span>Showing {history.length} of {history.length} backup instances</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => toast.info('Previous page')}
                  className="px-3 py-1 bg-surface-container-lowest rounded border border-outline-variant/30 hover:bg-surface-container-high transition-colors"
                >
                  Previous
                </button>
                <button 
                  onClick={() => toast.info('Next page')}
                  className="px-3 py-1 bg-surface-container-lowest rounded border border-outline-variant/30 hover:bg-surface-container-high transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
