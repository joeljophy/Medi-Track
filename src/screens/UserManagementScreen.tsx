import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Icon } from '../components/Icon';
import { cn } from '../lib/utils';
import { handleError, ErrorSeverity, AppError } from '../lib/error-handler';
import { useUsers } from '../context/UserContext';

export const UserManagementScreen = () => {
  const { users, addUser, removeUser } = useUsers();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string, name: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const firstName = formData.get('firstName') as string;
      const lastName = formData.get('lastName') as string;
      const email = formData.get('email') as string;
      const role = formData.get('role') as string;
      const department = formData.get('department') as string;
      const phone = formData.get('phone') as string;

      addUser({
        name: `${firstName} ${lastName}`,
        email,
        role,
        status: 'Active',
        department,
        phone,
        joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      });
      
      setIsModalOpen(false);
    } catch (error) {
      handleError(error, { context: { action: 'Create User' } });
    }
  };

  const handleAction = (action: string, user: any) => {
    try {
      if (action === 'Delete') {
        setUserToDelete({ id: user.id, name: user.name });
        setIsDeleteConfirmOpen(true);
      } else if (action === 'Edit') {
        navigate(`/users/${user.id}`);
      } else {
        toast.info(`${action} action triggered for ${user.name}`);
      }
    } catch (error) {
      handleError(error, { context: { action, userName: user.name } });
    }
  };

  const confirmDelete = () => {
    if (!userToDelete) return;
    removeUser(userToDelete.id);
    setIsDeleteConfirmOpen(false);
    setUserToDelete(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All Status' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">User Management</h1>
          <p className="text-on-surface-variant mt-1 font-body">Manage staff access, update profiles, and monitor user status.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-container hover:bg-primary text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md"
        >
          <Icon name="person_add" />
          Create New User
        </button>
      </header>

      {/* Filter Bar */}
      <section className="bg-surface-container-low p-4 rounded-xl flex flex-wrap items-center gap-4 border border-outline-variant/10">
        <div className="flex-1 min-w-[240px] relative">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input 
            className="w-full pl-10 pr-4 py-2 bg-white border-none rounded-lg text-sm focus:ring-2 focus:ring-primary-container/20 outline-none" 
            placeholder="Search by name, email or ID..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              throw new Error('This is a simulated runtime crash!');
            }}
            className="p-2 bg-error-container/10 text-error-container rounded-lg hover:bg-error-container/20 transition-colors"
            title="Simulate Runtime Crash"
          >
            <Icon name="bug_report" />
          </button>
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white border-none rounded-lg text-sm px-4 py-2 focus:ring-2 focus:ring-primary-container/20 outline-none"
          >
            <option>All Roles</option>
            <option>Doctor</option>
            <option>Nurse</option>
            <option>Admin</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border-none rounded-lg text-sm px-4 py-2 focus:ring-2 focus:ring-primary-container/20 outline-none"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>On Leave</option>
            <option>Suspended</option>
          </select>
          <button 
            onClick={() => toast.info('Advanced filters opened')}
            className="p-2 bg-white rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant"
          >
            <Icon name="filter_list" />
          </button>
        </div>
      </section>

      {/* User Table */}
      <section className="bg-white rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest">User ID</th>
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest">Full Name</th>
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest">Email Address</th>
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest">Last Login</th>
                <th className="px-6 py-4 text-xs font-black text-on-surface-variant uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {filteredUsers.length > 0 ? filteredUsers.map((user, i) => (
                <tr key={user.id} className={cn("hover:bg-surface-container-low/30 transition-colors", i % 2 !== 0 && "bg-surface-container-low/10")}>
                  <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">{user.id}</td>
                  <td className="px-6 py-4">
                    <Link 
                      to={`/users/${user.id}`}
                      className="font-bold text-sm text-on-surface hover:text-primary-container transition-colors"
                    >
                      {user.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{user.email}</td>
                  <td className="px-6 py-4 text-sm font-medium">{user.role}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      user.status === 'Active' ? "bg-primary-container/10 text-primary-container" : "bg-surface-container-low text-on-surface-variant"
                    )}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-on-surface-variant">{user.lastLogin}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleAction('Edit', user)}
                        className="p-2 hover:bg-surface-container-high rounded-lg transition-colors text-on-surface-variant hover:text-primary-container"
                      >
                        <Icon name="edit" className="text-lg" />
                      </button>
                      <button 
                        onClick={() => handleAction('Delete', user)}
                        className="p-2 hover:bg-surface-container-high rounded-lg transition-colors text-on-surface-variant hover:text-primary-container"
                      >
                        <Icon name="delete" className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-on-surface-variant text-sm italic">No users found in the directory.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-surface-container-low/30 flex items-center justify-between border-t border-surface-container">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Showing {filteredUsers.length} of {users.length} users</span>
          <div className="flex gap-2">
            <button 
              onClick={() => toast.info('Previous page')}
              className="px-4 py-2 bg-white border border-outline-variant/20 rounded-lg text-xs font-bold hover:bg-surface-container-low transition-colors disabled:opacity-50" 
              disabled
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

      {/* Create User Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="px-8 py-6 bg-primary-container text-on-primary flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-headline font-extrabold tracking-tight">Create New User</h2>
                  <p className="text-on-primary/70 text-sm">Add a new staff member to the system.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Icon name="close" className="text-2xl" />
                </button>
              </div>
              <form className="p-8 space-y-6" onSubmit={handleCreateUser}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-on-surface-variant tracking-widest">First Name</label>
                    <input name="firstName" className="w-full bg-surface-container-low border-b-2 border-outline-variant px-4 py-3 focus:border-primary-container outline-none transition-all rounded-t-lg" placeholder="e.g. Julian" type="text" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-on-surface-variant tracking-widest">Last Name</label>
                    <input name="lastName" className="w-full bg-surface-container-low border-b-2 border-outline-variant px-4 py-3 focus:border-primary-container outline-none transition-all rounded-t-lg" placeholder="e.g. Smith" type="text" required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase text-on-surface-variant tracking-widest">Email Address</label>
                    <input name="email" className="w-full bg-surface-container-low border-b-2 border-outline-variant px-4 py-3 focus:border-primary-container outline-none transition-all rounded-t-lg" placeholder="j.smith@meditrack.com" type="email" required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase text-on-surface-variant tracking-widest">Mobile Number</label>
                    <input name="phone" className="w-full bg-surface-container-low border-b-2 border-outline-variant px-4 py-3 focus:border-primary-container outline-none transition-all rounded-t-lg" placeholder="+1 (555) 000-0000" type="tel" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-on-surface-variant tracking-widest">Assign Role</label>
                    <select name="role" className="w-full bg-surface-container-low border-b-2 border-outline-variant px-4 py-3 focus:border-primary-container outline-none transition-all rounded-t-lg">
                      <option>Doctor</option>
                      <option>Nurse</option>
                      <option>Admin</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-on-surface-variant tracking-widest">Department</label>
                    <select name="department" className="w-full bg-surface-container-low border-b-2 border-outline-variant px-4 py-3 focus:border-primary-container outline-none transition-all rounded-t-lg">
                      <option>Cardiology</option>
                      <option>Neurology</option>
                      <option>General Medicine</option>
                      <option>IT & Infrastructure</option>
                    </select>
                  </div>
                </div>
                <div className="pt-6 flex justify-end gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-primary-container text-on-primary px-10 py-3 rounded-xl font-bold shadow-lg hover:bg-primary transition-all active:scale-95"
                  >
                    Create User Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 text-center space-y-6"
            >
              <div className="w-16 h-16 bg-error-container/10 text-error-container rounded-full flex items-center justify-center mx-auto">
                <Icon name="delete_forever" className="text-3xl" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-on-surface">Confirm Deletion</h3>
                <p className="text-on-surface-variant text-sm">
                  Are you sure you want to remove <span className="font-bold text-on-surface">{userToDelete?.name}</span>? This action cannot be undone.
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <button 
                  onClick={confirmDelete}
                  className="w-full bg-error-container text-on-error-container py-3 rounded-xl font-bold shadow-md hover:bg-error transition-all active:scale-95"
                >
                  Delete User
                </button>
                <button 
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="w-full py-2 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
