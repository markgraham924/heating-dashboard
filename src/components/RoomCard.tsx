import React from 'react';
import { StatusBadge } from './StatusBadge';

interface RoomCardProps {
  title: string;
  climateState?: string;
  currentTemp?: number;
  targetTemp?: number;
  humidity?: number | string;
  valvePosition?: number | string;
  battery?: number | string;
  nextSetpoint?: number | string;
  windowStatus?: string;
  heatupRate?: number | string;
  timeToSetpoint?: number | string;
  status?: string;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  title,
  climateState,
  currentTemp,
  targetTemp,
  humidity,
  valvePosition,
  battery,
  nextSetpoint,
  windowStatus,
  heatupRate,
  timeToSetpoint,
  status,
}) => {
  // Convert minutes to time of day (e.g., "09:30am")
  const formatTimeToSetpoint = (minutes: string | number | undefined) => {
    if (!minutes || minutes === 'unavailable') return undefined;
    
    const mins = parseFloat(String(minutes));
    if (isNaN(mins)) return undefined;
    
    const now = new Date();
    const futureTime = new Date(now.getTime() + mins * 60000); // Convert minutes to milliseconds
    
    return futureTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6 pb-4 border-b border-gray-700">{title}</h2>
      
      <div className="space-y-4">
        {/* Mode */}
        {climateState && (
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <span className="text-gray-300 font-medium">Mode</span>
            <StatusBadge status={climateState} />
          </div>
        )}

        {/* Temperature Section */}
        {currentTemp !== undefined && targetTemp !== undefined && (
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-gray-400 text-sm block mb-1">Current</span>
                <span className="text-3xl font-bold text-white">{currentTemp}°C</span>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-sm block mb-1">Target</span>
                <span className="text-2xl font-semibold text-blue-200">{targetTemp}°C</span>
              </div>
            </div>
          </div>
        )}

        {/* Next Setpoint */}
        {nextSetpoint !== undefined && nextSetpoint !== 'unavailable' && (
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <span className="text-gray-300 font-medium">Next Setpoint</span>
            <span className="text-white font-bold text-lg">{nextSetpoint}°C</span>
          </div>
        )}

        {/* Time to Next Setpoint */}
        {timeToSetpoint !== undefined && timeToSetpoint !== 'unavailable' && formatTimeToSetpoint(timeToSetpoint) && (
          <div className="flex items-center justify-between p-3 bg-amber-900 rounded-lg">
            <span className="text-gray-300 font-medium">Next Change</span>
            <span className="text-amber-100 font-bold">{formatTimeToSetpoint(timeToSetpoint)}</span>
          </div>
        )}

        {/* Humidity */}
        {humidity !== undefined && humidity !== 255 && humidity !== '255' && humidity !== 'unavailable' && (
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <span className="text-gray-300 font-medium">Humidity</span>
            <span className="text-white font-semibold">{humidity}%</span>
          </div>
        )}

        {/* Valve Position */}
        {valvePosition !== undefined && valvePosition !== 'unavailable' && (
          <div className="p-3 bg-gray-700 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300 font-medium">Valve Position</span>
              <span className="text-white font-bold">{valvePosition}%</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-400 to-blue-600 h-full transition-all"
                style={{ width: `${Math.min(parseFloat(String(valvePosition)), 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Battery */}
        {battery !== undefined && battery !== 'unavailable' && battery !== 'ok' && (
          <div className="flex items-center justify-between p-3 bg-green-900 rounded-lg">
            <span className="text-gray-300 font-medium">Battery</span>
            <span className="text-green-100 font-semibold">{battery}%</span>
          </div>
        )}

        {/* Battery Status */}
        {battery === 'ok' && (
          <div className="flex items-center justify-between p-3 bg-green-900 rounded-lg">
            <span className="text-gray-300 font-medium">Battery</span>
            <span className="text-green-100 font-bold">✓ Good</span>
          </div>
        )}

        {/* Window Status */}
        {windowStatus !== undefined && windowStatus !== 'unavailable' && (
          <div className="flex items-center justify-between p-3 bg-purple-900 rounded-lg">
            <span className="text-gray-300 font-medium">Window</span>
            <StatusBadge status={windowStatus} />
          </div>
        )}

        {/* Heatup Rate */}
        {heatupRate !== undefined && heatupRate !== 'unavailable' && heatupRate !== 'unknown' && (
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <span className="text-gray-300 font-medium">Heatup Rate</span>
            <span className="text-gray-100 text-sm">{heatupRate}</span>
          </div>
        )}

        {status && (
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <span className="text-gray-300 font-medium">Status</span>
            <StatusBadge status={status} />
          </div>
        )}
      </div>
    </div>
  );
};
