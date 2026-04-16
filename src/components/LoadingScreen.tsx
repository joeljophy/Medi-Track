import React from 'react';
import { motion } from 'motion/react';
import { Icon } from './Icon';

export const LoadingScreen = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-surface-container-lowest"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary-container flex items-center justify-center rounded-xl animate-pulse">
          <Icon name="medical_services" className="text-on-primary text-3xl" />
        </div>
        <span className="text-3xl font-headline font-extrabold text-primary-container tracking-tight">MediTrack</span>
      </div>
      <div className="w-48 h-1 bg-surface-container-high rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-primary-container"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <p className="mt-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest animate-pulse">
        Initializing Clinical Environment...
      </p>
    </motion.div>
  );
};
