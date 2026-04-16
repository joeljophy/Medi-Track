import React from 'react';
import { cn } from '../lib/utils';

export const Icon = ({ name, className, fill = false, onClick }: { name: string; className?: string; fill?: boolean; onClick?: () => void }) => {
  return (
    <span 
      className={cn("material-symbols-outlined select-none", className, onClick && "cursor-pointer")}
      style={{ fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24` }}
      onClick={onClick}
    >
      {name}
    </span>
  );
};
