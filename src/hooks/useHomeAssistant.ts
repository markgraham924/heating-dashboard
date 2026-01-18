import { useQuery } from '@tanstack/react-query';
import haApi from '../services/haApi';

export const useHAEntity = (entityId: string | null) => {
  return useQuery({
    queryKey: ['haEntity', entityId],
    queryFn: () => (entityId ? haApi.getEntity(entityId) : Promise.resolve(null)),
    enabled: !!entityId,
    refetchInterval: 5000, // Refetch every 5 seconds
  });
};

export const useHAEntities = (entityIds: string[]) => {
  return useQuery({
    queryKey: ['haEntities', entityIds],
    queryFn: () => {
      console.log('[useHAEntities] Starting query for:', entityIds.length, 'entities');
      return haApi.getEntities(entityIds).then(result => {
        console.log('[useHAEntities] Query completed. Got', Object.keys(result).length, 'entities');
        return result;
      });
    },
    refetchInterval: 5000, // Refetch every 5 seconds
  });
};

export const useAllHAStates = () => {
  return useQuery({
    queryKey: ['allHAStates'],
    queryFn: () => haApi.getAllStates(),
    refetchInterval: 10000, // Refetch every 10 seconds
  });
};
