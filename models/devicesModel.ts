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
export type AddDeviceActivityInput = {
  deviceId: string;
  latitude: number;
  longitude: number;
  broadcastingDay: string;
};

import { queryResultHandler } from '../graphql/utils/errorHandlers';
import supabase from '../supabase';
import {
  GetAllEntitiesArguments,
  addQueryModifiers,
} from '../graphql/utils/modifiers';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(tz);
const devicesMappingFunctions = (result: DeviceModelReturnType) => {
  const { users, ...deviceDataResult } = result;
  return {
    ...deviceDataResult,
    driver: users,
  };
};

export const getAllDevices = async ({
  pagination,
  filters,
}: GetAllEntitiesArguments) => {
  const dataQuery = supabase
    .from('devices')
    .select<string, DeviceModelReturnType>('*, users(*)', {
      count: 'exact',
    });

  const modifiedQuery = await addQueryModifiers<DeviceModelReturnType[]>(
    dataQuery,
    {
      pagination,
    },
  );

  const handledResults = queryResultHandler({
    query: modifiedQuery,
    status: 404,
  }) as DeviceModelReturnType[];

  return {
    data: handledResults.map(devicesMappingFunctions),
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

  return devicesMappingFunctions(handledResult);
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

  return devicesMappingFunctions(handledResult);
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

  return devicesMappingFunctions(handledResult);
};

export const deleteDevice = async (deviceId: string) => {
  const queryData = await supabase
    .from('devices')
    .delete({ count: 'exact' })
    .eq('id', deviceId);

  queryResultHandler({ query: queryData });
  return queryData.count;
};

export const addDeviceActivity = async (input: AddDeviceActivityInput) => {
  const queryData = await supabase.from('deviceActivityData').insert({
    deviceId: input.deviceId,
    latitude: input.latitude,
    longitude: input.longitude,
    broadcastingDay: dayjs.tz(
      input?.broadcastingDay ?? dayjs(),
      'Europe/Bucharest',
    ),
  });

  queryResultHandler({ query: queryData });

  return true;
};
