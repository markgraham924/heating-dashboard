import React from 'react';

interface StatusBadgeProps {
  status: string;
  value?: string | number;
  unit?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, value, unit }) => {
  const getStatusColor = () => {
    if (value !== undefined) {
      const numValue = typeof value === 'number' ? value : parseFloat(value as string);
      if (!isNaN(numValue)) {
        if (numValue < 10) return 'bg-red-600';
        if (numValue < 30) return 'bg-orange-600';
        return 'bg-green-600';
      }
    }
    
    switch (status?.toLowerCase()) {
      case 'on':
      case 'heat':
      case 'auto':
      case 'ok':
        return 'bg-green-600';
      case 'off':
        return 'bg-gray-600';
      case 'unavailable':
        return 'bg-red-600';
      default:
        return 'bg-blue-600';
    }
  };

  return (
    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
      {value !== undefined ? `${value}${unit || ''}` : status}
    </div>
  );
};
