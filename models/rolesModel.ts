import { queryResultHandler } from '../graphql/utils/errorHandlers';
import supabase from '../supabase';

export const getRole = async (roleName: string) => {
  const queryData = await supabase
    .from('roles')
    .select('*')
    .eq('roleName', roleName)
    .single();

  const handledResult = queryResultHandler({ query: queryData });

  return handledResult;
};
