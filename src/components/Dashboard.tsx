import React from 'react';
import { useHAEntities } from '../hooks/useHomeAssistant';
import { RoomCard } from './RoomCard';

export const Dashboard: React.FC = () => {
  // Entity IDs for all rooms
  const entityIds = [
    // Dining Room (ZN1 + Device 3)
    'climate.living_room',
    'sensor.zn1_humidity',
    'sensor.zn1_valve_position',
    'sensor.zn1_next_setpoint',
    'sensor.zn1_timetonextsetpoint',
    'sensor.zn1_open_window_detection_status',
    'sensor.zn1_optimum_start_heatup_rate',
    'sensor.device3_valve_position_2',
    'sensor.device3_etrv_status_2',
    'sensor.device3_battery_2',
    
    // Marks Bedroom (ZN4 + Device 4)
    'climate.main_bedroom',
    'sensor.zn4_humidity',
    'sensor.zn4_valve_position',
    'sensor.zn4_next_setpoint',
    'sensor.zn4_timetonextsetpoint',
    'sensor.zn4_open_window_detection_status',
    'sensor.zn4_optimum_start_heatup_rate',
    'sensor.device4_valve_position_2',
    'sensor.device4_etrv_status_2',
    'sensor.device4_battery_2',
    
    // Front Room (ZN2 + Device 5)
    'climate.front_room',
    'sensor.zn2_humidity_2',
    'sensor.zn2_valve_position_2',
    'sensor.zn2_next_setpoint_2',
    'sensor.zn2_timetonextsetpoint_2',
    'sensor.zn2_open_window_detection_status_2',
    'sensor.zn2_optimum_start_heatup_rate_2',
    'sensor.device5_valve_position',
    'sensor.device5_etrv_status',
    'sensor.device5_battery',
  ];

  const { data: entities, isLoading, error } = useHAEntities(entityIds);

  console.log('Dashboard state:', { isLoading, error, entities });

  // Test if proxy is working
  const [proxyTest, setProxyTest] = React.useState<string>('Testing...');
  React.useEffect(() => {
    console.log('[Dashboard] Testing API proxy...');
    const token = import.meta.env.VITE_HA_TOKEN;
    fetch('/api/states/climate.living_room', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
      .then(r => {
        console.log('[Dashboard] Response status:', r.status);
        return r.json();
      })
      .then(d => {
        console.log('[Dashboard] Proxy test SUCCESS:', d);
        setProxyTest('SUCCESS: Proxy working, data flowing');
      })
      .catch(e => {
        console.error('[Dashboard] Proxy test FAILED:', e);
        setProxyTest(`FAILED: ${e.message}`);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-xl text-gray-400">
          <div>Loading heating system data...</div>
          <div className="text-sm text-gray-500 mt-2">Check browser console for details</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-xl text-red-400">
          <div>Error loading data:</div>
          <div className="text-sm mt-2">{(error as Error).message}</div>
          <div className="text-sm text-gray-500 mt-2">Check browser console for more details</div>
        </div>
      </div>
    );
  }

  if (!entities) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-xl text-gray-400">
          <div>No data available</div>
          <div className="text-sm text-gray-500 mt-2">Entities object is empty</div>
        </div>
      </div>
    );
  }

  // Extract room data
  const getRoomData = (roomName: string) => {
    let climateId, humidityId, valveId, batteryId, setpointId, windowId, rateId, timeId;
    
    if (roomName === 'dining') {
      climateId = 'climate.living_room';
      humidityId = 'sensor.zn1_humidity';
      valveId = 'sensor.zn1_valve_position';
      batteryId = 'sensor.device3_battery_2';
      setpointId = 'sensor.zn1_next_setpoint';
      windowId = 'sensor.zn1_open_window_detection_status';
      rateId = 'sensor.zn1_optimum_start_heatup_rate';
      timeId = 'sensor.zn1_timetonextsetpoint';
    } else if (roomName === 'marks') {
      climateId = 'climate.main_bedroom';
      humidityId = 'sensor.zn4_humidity';
      valveId = 'sensor.zn4_valve_position';
      batteryId = 'sensor.device4_battery_2';
      setpointId = 'sensor.zn4_next_setpoint';
      windowId = 'sensor.zn4_open_window_detection_status';
      rateId = 'sensor.zn4_optimum_start_heatup_rate';
      timeId = 'sensor.zn4_timetonextsetpoint';
    } else if (roomName === 'front') {
      climateId = 'climate.front_room';
      humidityId = 'sensor.zn2_humidity_2';
      valveId = 'sensor.zn2_valve_position_2';
      batteryId = 'sensor.device5_battery';
      setpointId = 'sensor.zn2_next_setpoint_2';
      windowId = 'sensor.zn2_open_window_detection_status_2';
      rateId = 'sensor.zn2_optimum_start_heatup_rate_2';
      timeId = 'sensor.zn2_timetonextsetpoint_2';
    }

    const climate = entities[climateId!];
    const humidity = entities[humidityId!];
    const valve = entities[valveId!];
    const battery = entities[batteryId!];
    const nextSetpoint = entities[setpointId!];
    const windowStatus = entities[windowId!];
    const heatupRate = entities[rateId!];
    const timeToSetpoint = entities[timeId!];

    return {
      climate,
      humidity: humidity?.state,
      valve: valve?.state,
      battery: battery?.state,
      nextSetpoint: nextSetpoint?.state,
      windowStatus: windowStatus?.state,
      heatupRate: heatupRate?.state,
      timeToSetpoint: timeToSetpoint?.state,
    };
  };

  const diningData = getRoomData('dining');
  const marksData = getRoomData('marks');
  const frontData = getRoomData('front');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">🏠 Heating System Dashboard</h1>
          <p className="text-gray-400 text-lg">Real-time heating system monitoring</p>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Status Bar */}
        <div className="mb-8 p-4 bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-gray-400 text-sm">Status:</span>
              <span className="ml-2 text-green-400 font-semibold">● Online</span>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Entities:</span>
              <span className="ml-2 text-white font-semibold">{entities ? Object.keys(entities).length : 0} / {entityIds.length}</span>
            </div>
          </div>
          <div>
            <details className="cursor-pointer">
              <summary className="text-gray-400 text-sm hover:text-gray-300 font-medium">Debug Info</summary>
              <div className="mt-3 p-3 bg-gray-700 rounded text-xs text-gray-300 space-y-1 absolute right-8 w-64 z-10">
                <div>Proxy: {proxyTest}</div>
                <div>Loading: {isLoading ? 'yes' : 'no'}</div>
                <div>Error: {error ? (error as Error).message : 'none'}</div>
              </div>
            </details>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Dining Room */}
          <RoomCard
            title="Dining Room"
            climateState={diningData.climate?.state}
            currentTemp={diningData.climate?.attributes?.current_temperature}
            targetTemp={diningData.climate?.attributes?.temperature}
            humidity={diningData.humidity}
            valvePosition={diningData.valve}
            battery={diningData.battery}
            nextSetpoint={diningData.nextSetpoint}
            windowStatus={diningData.windowStatus}
            heatupRate={diningData.heatupRate}
            timeToSetpoint={diningData.timeToSetpoint}
          />

          {/* Marks Bedroom */}
          <RoomCard
            title="Marks Bedroom"
            climateState={marksData.climate?.state}
            currentTemp={marksData.climate?.attributes?.current_temperature}
            targetTemp={marksData.climate?.attributes?.temperature}
            humidity={marksData.humidity}
            valvePosition={marksData.valve}
            battery={marksData.battery}
            nextSetpoint={marksData.nextSetpoint}
            windowStatus={marksData.windowStatus}
            heatupRate={marksData.heatupRate}
            timeToSetpoint={marksData.timeToSetpoint}
          />

          {/* Front Room */}
          <RoomCard
            title="Front Room"
            climateState={frontData.climate?.state}
            currentTemp={frontData.climate?.attributes?.current_temperature}
            targetTemp={frontData.climate?.attributes?.temperature}
            humidity={frontData.humidity}
            valvePosition={frontData.valve}
            battery={frontData.battery}
            nextSetpoint={frontData.nextSetpoint}
            windowStatus={frontData.windowStatus}
            heatupRate={frontData.heatupRate}
            timeToSetpoint={frontData.timeToSetpoint}
          />
        </div>

        {/* Status Footer */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700 flex items-center justify-between">
          <div>
            <p className="text-gray-300 font-medium">
              Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p className="text-gray-500 text-sm mt-1">Data refreshes every 5 seconds</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-semibold">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};
