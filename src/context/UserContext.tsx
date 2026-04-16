import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { AppError, ErrorSeverity, handleError } from '../lib/error-handler';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  department?: string;
  phone?: string;
  joinDate?: string;
  bio?: string;
}

interface UserContextType {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'lastLogin'>) => void;
  removeUser: (id: string) => void;
  updateUserStatus: (id: string, status: string) => void;
  updateUser: (id: string, updates: Partial<Omit<User, 'id' | 'lastLogin'>>) => void;
  getUserById: (id: string) => User | undefined;
}

const initialUsers: User[] = [
  { 
    id: 'USR-002', 
    name: 'Sarah Jenkins', 
    email: 's.jenkins@meditrack.com', 
    role: 'Nurse', 
    status: 'Active', 
    lastLogin: '1 hour ago',
    department: 'General Medicine',
    phone: '+1 (555) 987-6543',
    joinDate: 'Mar 05, 2024',
    bio: 'Registered Nurse specializing in acute care and patient management.'
  },
  { 
    id: 'USR-003', 
    name: 'Mark Thompson', 
    email: 'm.thompson@meditrack.com', 
    role: 'Admin', 
    status: 'On Leave', 
    lastLogin: 'Yesterday',
    department: 'IT & Infrastructure',
    phone: '+1 (555) 456-7890',
    joinDate: 'Nov 20, 2022',
    bio: 'Systems Administrator responsible for hospital network security.'
  },
  { 
    id: 'USR-004', 
    name: 'Emily Davis', 
    email: 'e.davis@meditrack.com', 
    role: 'Doctor', 
    status: 'Suspended', 
    lastLogin: '3 days ago',
    department: 'Neurology',
    phone: '+1 (555) 222-3333',
    joinDate: 'Jul 15, 2023',
    bio: 'Neurologist focused on neurodegenerative diseases and research.'
  },
];

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const addUser = (userData: Omit<User, 'id' | 'lastLogin'>) => {
    try {
      if (userData.email.includes('error')) {
        throw new AppError('Invalid email domain detected', { 
          severity: ErrorSeverity.HIGH,
          context: { email: userData.email } 
        });
      }

      const newUser: User = {
        ...userData,
        id: `USR-00${users.length + 1}`,
        lastLogin: 'Never'
      };

      setUsers([newUser, ...users]);
      toast.success('User profile created successfully');
    } catch (error) {
      handleError(error, { context: { action: 'Add User' } });
    }
  };

  const removeUser = (id: string) => {
    try {
      const user = users.find(u => u.id === id);
      setUsers(users.filter(u => u.id !== id));
      toast.success(`${user?.name} has been removed from the system`);
    } catch (error) {
      handleError(error, { context: { action: 'Remove User', userId: id } });
    }
  };

  const updateUserStatus = (id: string, status: string) => {
    try {
      setUsers(users.map(u => u.id === id ? { ...u, status } : u));
      toast.success(`User status updated to ${status}`);
    } catch (error) {
      handleError(error, { context: { action: 'Update Status', userId: id, status } });
    }
  };

  const updateUser = (id: string, updates: Partial<Omit<User, 'id' | 'lastLogin'>>) => {
    try {
      setUsers(users.map(u => u.id === id ? { ...u, ...updates } : u));
      toast.success('User profile updated successfully');
    } catch (error) {
      handleError(error, { context: { action: 'Update User', userId: id } });
    }
  };

  const getUserById = (id: string) => {
    return users.find(u => u.id === id);
  };

  return (
    <UserContext.Provider value={{ users, addUser, removeUser, updateUserStatus, updateUser, getUserById }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};
