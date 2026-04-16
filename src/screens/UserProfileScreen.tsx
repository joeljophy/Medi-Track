import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from '../components/Icon';
import { useUsers, User } from '../context/UserContext';
import { cn } from '../lib/utils';

export const UserProfileScreen = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { getUserById, removeUser, updateUserStatus, updateUser } = useUsers();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<User>>({});

  const user = userId ? getUserById(userId) : undefined;

  const handleEditClick = () => {
    if (user) {
      setEditData({
        name: user.name,
        role: user.role,
        department: user.department,
        email: user.email,
        phone: user.phone,
        bio: user.bio
      });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (user && userId) {
      updateUser(userId, editData);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center text-on-surface-variant">
          <Icon name="person_off" className="text-4xl" />
        </div>
        <h2 className="text-2xl font-bold text-on-surface">User Not Found</h2>
        <p className="text-on-surface-variant">The user you are looking for does not exist or has been removed.</p>
        <button 
          onClick={() => navigate('/users')}
          className="bg-primary-container text-on-primary px-6 py-2 rounded-lg font-bold"
        >
          Back to Directory
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    removeUser(user.id);
    navigate('/users');
  };

  const handleSuspend = () => {
    const newStatus = user.status === 'Suspended' ? 'Active' : 'Suspended';
    updateUserStatus(user.id, newStatus);
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/users')}
          className="p-2 hover:bg-surface-container-low rounded-full transition-colors text-on-surface-variant"
        >
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">
            {isEditing ? 'Edit Profile' : 'User Profile'}
          </h1>
          <p className="text-on-surface-variant mt-1 font-body">
            {isEditing ? `Modifying information for ${user.name}.` : `Detailed information and management for ${user.name}.`}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Basic Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white rounded-3xl shadow-sm border border-outline-variant/10 overflow-hidden">
            <div className="h-32 bg-primary-container/20 relative">
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                <div className="w-24 h-24 rounded-full bg-secondary-container border-4 border-white flex items-center justify-center text-3xl font-bold text-on-secondary-container shadow-lg">
                  {(editData.name || user.name).split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            </div>
            <div className="pt-16 pb-8 px-6 text-center space-y-4">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold uppercase text-on-surface-variant tracking-widest">Full Name</label>
                    <input 
                      name="name"
                      value={editData.name || ''}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low border-b-2 border-outline-variant px-3 py-2 focus:border-primary-container outline-none transition-all rounded-t-lg text-sm"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold uppercase text-on-surface-variant tracking-widest">Role</label>
                    <select 
                      name="role"
                      value={editData.role || ''}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low border-b-2 border-outline-variant px-3 py-2 focus:border-primary-container outline-none transition-all rounded-t-lg text-sm"
                    >
                      <option>Doctor</option>
                      <option>Nurse</option>
                      <option>Admin</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold text-on-surface">{user.name}</h2>
                  <p className="text-sm text-on-surface-variant">{user.role} • {user.department}</p>
                </div>
              )}
              <div className="flex justify-center">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  user.status === 'Active' ? "bg-primary-container/10 text-primary-container" : 
                  user.status === 'Suspended' ? "bg-error-container/10 text-error-container" :
                  "bg-surface-container-low text-on-surface-variant"
                )}>
                  {user.status}
                </span>
              </div>
              <div className="pt-4 grid grid-cols-2 gap-4">
                <button 
                  onClick={handleSuspend}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-2xl transition-all active:scale-95",
                    user.status === 'Suspended' ? "bg-primary-container/10 text-primary-container" : "bg-surface-container-low text-on-surface-variant"
                  )}
                >
                  <Icon name={user.status === 'Suspended' ? 'check_circle' : 'block'} />
                  <span className="text-[10px] font-bold uppercase">{user.status === 'Suspended' ? 'Activate' : 'Suspend'}</span>
                </button>
                <button 
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  className="flex flex-col items-center gap-2 p-3 bg-error-container/10 text-error-container rounded-2xl transition-all active:scale-95"
                >
                  <Icon name="delete" />
                  <span className="text-[10px] font-bold uppercase">Delete</span>
                </button>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-3xl shadow-sm border border-outline-variant/10 p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Contact Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                  <Icon name="mail" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase">Email</p>
                  {isEditing ? (
                    <input 
                      name="email"
                      value={editData.email || ''}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low border-b border-outline-variant px-2 py-1 focus:border-primary-container outline-none transition-all text-sm"
                    />
                  ) : (
                    <p className="text-sm font-medium">{user.email}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface-variant">
                  <Icon name="phone" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase">Phone</p>
                  {isEditing ? (
                    <input 
                      name="phone"
                      value={editData.phone || ''}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low border-b border-outline-variant px-2 py-1 focus:border-primary-container outline-none transition-all text-sm"
                    />
                  ) : (
                    <p className="text-sm font-medium">{user.phone || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Detailed Info & Activity */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-3xl shadow-sm border border-outline-variant/10 p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-on-surface">Professional Profile</h3>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button 
                      onClick={handleCancelEdit}
                      className="text-on-surface-variant text-sm font-bold hover:underline"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      className="text-primary-container text-sm font-bold hover:underline"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={handleEditClick}
                    className="text-primary-container text-sm font-bold hover:underline"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Employee ID</p>
                <p className="text-lg font-mono font-bold text-primary-container">{user.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Department</p>
                {isEditing ? (
                  <select 
                    name="department"
                    value={editData.department || ''}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border-b-2 border-outline-variant px-3 py-2 focus:border-primary-container outline-none transition-all rounded-t-lg text-sm"
                  >
                    <option>Cardiology</option>
                    <option>Neurology</option>
                    <option>General Medicine</option>
                    <option>IT & Infrastructure</option>
                  </select>
                ) : (
                  <p className="text-lg font-bold">{user.department || 'N/A'}</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Join Date</p>
                <p className="text-lg font-bold">{user.joinDate || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Last Login</p>
                <p className="text-lg font-bold">{user.lastLogin}</p>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Biography</p>
              {isEditing ? (
                <textarea 
                  name="bio"
                  value={editData.bio || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-surface-container-low border-b-2 border-outline-variant px-4 py-3 focus:border-primary-container outline-none transition-all rounded-t-lg text-sm resize-none"
                  placeholder="Tell us about the user..."
                />
              ) : (
                <p className="text-on-surface-variant leading-relaxed">
                  {user.bio || 'No biography provided for this user profile.'}
                </p>
              )}
            </div>
          </section>

          <section className="bg-white rounded-3xl shadow-sm border border-outline-variant/10 p-8 space-y-6">
            <h3 className="text-xl font-bold text-on-surface">Recent Activity</h3>
            <div className="space-y-6">
              {[
                { action: 'Updated patient record #4421', time: '2 hours ago', icon: 'edit_note', color: 'bg-blue-100 text-blue-600' },
                { action: 'Logged into system', time: '4 hours ago', icon: 'login', color: 'bg-green-100 text-green-600' },
                { action: 'Generated weekly report', time: 'Yesterday', icon: 'summarize', color: 'bg-purple-100 text-purple-600' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", activity.color)}>
                    <Icon name={activity.icon} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{activity.action}</p>
                    <p className="text-xs text-on-surface-variant">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-3 text-sm font-bold text-primary-container hover:bg-surface-container-low rounded-xl transition-colors">
              View All Activity Logs
            </button>
          </section>
        </div>
      </div>

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
              className="relative bg-white w-full max-md rounded-2xl shadow-2xl p-8 text-center space-y-6"
            >
              <div className="w-16 h-16 bg-error-container/10 text-error-container rounded-full flex items-center justify-center mx-auto">
                <Icon name="delete_forever" className="text-3xl" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-on-surface">Confirm Deletion</h3>
                <p className="text-on-surface-variant text-sm">
                  Are you sure you want to remove <span className="font-bold text-on-surface">{user.name}</span>? This action cannot be undone.
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <button 
                  onClick={handleDelete}
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
