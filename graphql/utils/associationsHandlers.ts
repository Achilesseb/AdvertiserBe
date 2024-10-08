import supabase from '../../supabase';
import { queryResultHandler } from './errorHandlers';

export const createUserRoleAssociation = async (
  userId: string,
  roleId: string,
) => {
  if (!userId || !roleId) return;
  const queryData = await supabase.from('usersRoles').insert({
    userId,
    roleId,
  });
  return queryResultHandler({ query: queryData });
};

export const createPromotionsClientAssociation = async (
  clientId: string,
  promotionId: string,
) => {
  if (!clientId || !promotionId) return;
  const queryData = await supabase.from('clientsPromotions').insert({
    clientId,
    promotionId,
  });
  queryResultHandler({ query: queryData });
};

export const createDeviceUserAssociation = async (
  driverId?: string,
  deviceId?: string,
) => {
  if (!driverId || !deviceId) return;
  const queryData = await supabase
    .from('users')
    .update({
      deviceId,
    })
    .eq('id', driverId);

  queryResultHandler({ query: queryData });
};
