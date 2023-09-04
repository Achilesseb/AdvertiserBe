import _ from 'lodash';
import supabase from '../../supabase';

export const doesDeviceExists = async (deviceId: string) => {
  const result = await supabase
    .from('devices')
    .select()
    .eq('id', deviceId)
    .single();

  if (_.isEmpty(result.data)) return false;

  return true;
};
