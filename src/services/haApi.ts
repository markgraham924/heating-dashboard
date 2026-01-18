import axios from 'axios';

// Get config from window.ENV (runtime) or import.meta.env (build time)
const getConfig = () => {
  if (typeof window !== 'undefined' && (window as any).ENV) {
    const env = (window as any).ENV;
    return {
      haUrl: env.VITE_HA_URL !== '__VITE_HA_URL__' ? env.VITE_HA_URL : import.meta.env.VITE_HA_URL,
      haToken: env.VITE_HA_TOKEN !== '__VITE_HA_TOKEN__' ? env.VITE_HA_TOKEN : import.meta.env.VITE_HA_TOKEN,
    };
  }
  return {
    haUrl: import.meta.env.VITE_HA_URL,
    haToken: import.meta.env.VITE_HA_TOKEN,
  };
};

const config = getConfig();
const haUrl = config.haUrl;
const haToken = config.haToken;

console.log('HA Config:', { haUrl, haToken: haToken ? 'SET' : 'MISSING' });

// Log to window for debugging since we can't see console
if (typeof window !== 'undefined') {
  (window as any).__haDebug = {
    haUrl,
    haTokenSet: !!haToken,
  };
}

const api = axios.create({
  baseURL: '/api', // Always use relative path - proxy handles routing
  headers: {
    'Authorization': `Bearer ${haToken}`,
    'Content-Type': 'application/json',
  },
});

export interface HAEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
}

export interface ClimateEntity extends HAEntity {
  attributes: {
    current_temperature?: number;
    temperature?: number;
    min_temp?: number;
    max_temp?: number;
    hvac_modes?: string[];
    preset_modes?: string[];
    friendly_name?: string;
  };
}

export interface ZoneEntity extends HAEntity {
  attributes: {
    unit_of_measurement?: string;
    friendly_name?: string;
  };
}

export const haApi = {
  // Get all entity states
  getAllStates: async (): Promise<HAEntity[]> => {
    const response = await api.get('/api/states');
    return response.data;
  },

  // Get specific entity
  getEntity: async (entityId: string): Promise<HAEntity> => {
    console.log(`[haApi] Getting entity: ${entityId}`);
    const url = `/states/${entityId}`;
    console.log(`[haApi] URL: ${url}`);
    try {
      const response = await api.get(url);
      console.log(`[haApi] Success for ${entityId}:`, response.data);
      return response.data;
    } catch (err: any) {
      console.error(`[haApi] Failed to get ${entityId}:`, {
        status: err.response?.status,
        statusText: err.response?.statusText,
        message: err.message,
        data: err.response?.data,
      });
      throw err;
    }
  },

  // Get climate entity
  getClimate: async (entityId: string): Promise<ClimateEntity> => {
    return haApi.getEntity(entityId) as Promise<ClimateEntity>;
  },

  // Get multiple entities
  getEntities: async (entityIds: string[]): Promise<Record<string, HAEntity>> => {
    console.log('Fetching entities:', entityIds);
    const responses = await Promise.all(
      entityIds.map(id => 
        haApi.getEntity(id).catch(err => {
          console.error(`Error fetching ${id}:`, err.message);
          return null;
        })
      )
    );
    
    const result: Record<string, HAEntity> = {};
    entityIds.forEach((id, idx) => {
      if (responses[idx]) {
        result[id] = responses[idx]!;
      }
    });
    console.log('Fetched entities result:', result);
    return result;
  },
};

export default haApi;
