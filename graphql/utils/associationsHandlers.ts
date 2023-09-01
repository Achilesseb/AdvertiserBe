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
  queryResultHandler({ query: queryData });
};
