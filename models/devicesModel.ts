import { UserModel } from './usersModel';

export type DeviceModel = {
  id: string;
  createAt: string;
  system: string;
  location: string;
  inUse: boolean;
  driver: UserModel;
};

export type AddDeviceModelInput = Omit<DeviceModel, 'id' | 'driver'> & {
  driverId?: string;
};

export type EditDeviceModelInput = Omit<DeviceModel, 'driver'> & {
  driverId?: string;
};

export type DeviceModelReturnType = Omit<DeviceModel, 'driver'> & {
  users: UserModel;
};

import { queryResultHandler } from '../graphql/utils/errorHandlers';
import supabase from '../supabase';
import {
  GetAllEntitiesArguments,
  addQueryModifiers,
} from '../graphql/utils/modifiers';

export const getAllDevices = async ({
  pagination,
  filters,
}: GetAllEntitiesArguments) => {
  const dataQuery = supabase
    .from('devices')
    .select<string, DeviceModel>('*, users(*)', {
      count: 'exact',
    });

  const modifiedQuery = await addQueryModifiers<DeviceModel[]>(dataQuery, {
    pagination,
  });

  const handledResults = queryResultHandler({
    query: modifiedQuery,
    status: 404,
  }) as DeviceModel[];

  return {
    data: handledResults,
    count: modifiedQuery.count,
  };
};

export const getDeviceById = async (deviceId: string) => {
  const dataQuery = await supabase
    .from('devices')
    .select('*, users(*)')
    .eq('id', deviceId)
    .single();

  const handledResult = queryResultHandler({
    query: dataQuery,
    status: 404,
  }) as DeviceModelReturnType;

  const { users, ...deviceDataResult } = handledResult;

  return {
    ...deviceDataResult,
    driver: users,
  };
};

export const addNewDevice = async (deviceData: AddDeviceModelInput) => {
  const dataQuery = await supabase
    .from('devices')
    .upsert(deviceData)
    .select('*, users(*)')
    .single();

  const handledResult = queryResultHandler({
    query: dataQuery,
    status: 406,
  }) as DeviceModelReturnType;

  const { users, ...deviceDataResult } = handledResult;

  return {
    ...deviceDataResult,
    driver: users,
  };
};

export const editDevice = async (deviceData: EditDeviceModelInput) => {
  const dataQuery = await supabase
    .from('devices')
    .update(deviceData)
    .eq('id', deviceData.id)
    .select('*, users(*)')
    .single();

  const handledResult = queryResultHandler({
    query: dataQuery,
    status: 409,
  }) as DeviceModelReturnType;

  const { users, ...deviceDataResult } = handledResult;

  return {
    ...deviceDataResult,
    driver: users,
  };
};

export const deleteDevice = async (deviceId: string) => {
  const queryData = await supabase
    .from('devices')
    .delete({ count: 'exact' })
    .eq('id', deviceId);

  queryResultHandler({ query: queryData });
  return queryData.count;
};
