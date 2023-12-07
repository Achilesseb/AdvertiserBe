import { UserModel } from './usersModel';

import { queryResultHandler } from '../graphql/utils/errorHandlers';
import supabase from '../supabase';
import {
  GetAllEntitiesArguments,
  addQueryModifiers,
} from '../graphql/utils/modifiers';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';
import { TeamModel } from './teamsModel';
import _ from 'lodash';

dayjs.extend(utc);
dayjs.extend(tz);
const devicesMappingFunctions = (result: DeviceModelReturnType) => {
  const { users, ...deviceDataResult } = result;
  console.log(deviceDataResult, users);
  return {
    ...deviceDataResult,
    ...(users && { driver: users }),
  };
};

const devicesJoinedTablesMappingFunction = (
  result: DeviceModelJoinedReturnType,
) => {
  const { users, ...deviceDataResult } = result;
  const { teams, ...userData } = users?.[0] ?? {};
  return {
    ...deviceDataResult,
    driver: userData,
    team: teams,
  };
};

export const getAllDevices = async ({
  pagination,
  filters,
}: GetAllEntitiesArguments) => {
  console.log(filters, pagination);
  const dataQuery = supabase
    .from('devices')
    .select<string, DeviceModelReturnType>('*, users(*)', {
      count: 'exact',
    });
  console.log(!_.isEmpty(filters));
  if (!_.isEmpty(filters)) {
    const filtersObject = Object.entries(filters);
    filtersObject.forEach(filter =>
      dataQuery.ilike(filter[0], `%${filter[1]}%`),
    );
  }
  const modifiedQuery = await addQueryModifiers<DeviceModelReturnType[]>(
    dataQuery,
    {
      pagination,
    },
  );
  console.log(modifiedQuery);
  const handledResults = queryResultHandler({
    query: modifiedQuery,
    status: 404,
  }) as DeviceModelReturnType[];

  return {
    data: handledResults.map(devicesMappingFunctions),
    count: modifiedQuery.count,
  };
};

export const getAllAvailableDevices = async ({
  filters,
}: GetAllEntitiesArguments) => {
  const dataQuery = supabase
    .from('devices')
    .select('*, users(id)', { count: 'exact' });

  if (filters) {
    const filtersObject = Object.entries(filters);
    filtersObject.forEach(filter =>
      dataQuery.ilike(filter[0], `%${filter[1]}%`),
    );
  }
  const modifiedQuery = await addQueryModifiers<DeviceModelReturnType[]>(
    dataQuery,
    {
      pagination: {
        entitiesPerPage: 1000,
      },
    },
  );

  const handledResults = queryResultHandler({
    query: modifiedQuery,
    status: 404,
  }) as DeviceModelReturnType[];

  const filteredDevices = handledResults.filter(devices =>
    _.isEmpty(devices.users),
  );
  return {
    data: filteredDevices,
    count: filteredDevices.length,
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

export const getDeviceByDeviceUniqueId = async (deviceUniqueId: string) => {
  const dataQuery = await supabase
    .from('devices')
    .select('*, users(*)')
    .eq('identifier', deviceUniqueId)
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
  const { deviceId, ...editFields } = deviceData;
  const dataQuery = await supabase
    .from('devices')
    .update(editFields)
    .eq('id', deviceData.deviceId)
    .select<string, DeviceModelJoinedReturnType>(
      `
    *, users(*, teams(*))

  `,
    )
    .single();

  const handledResult = queryResultHandler({
    query: dataQuery,
    status: 409,
  }) as DeviceModelJoinedReturnType;
  return devicesJoinedTablesMappingFunction(handledResult);
};

export const deleteDevice = async (devicesIds: string[]) => {
  const queryData = await supabase
    .from('devices')
    .delete({ count: 'exact' })
    .in('id', devicesIds);

  queryResultHandler({ query: queryData });
  return queryData.count;
};

export const addDeviceActivity = async (input: AddDeviceActivityInput) => {
  const queryData = await supabase.from('deviceActivityData').insert({
    userId: input.userId,
    deviceId: input.deviceId,
    latitude: input.latitude,
    longitude: input.longitude,
    distanceDriven: input.distanceDriven,
    broadcastingDay: dayjs.tz(
      input.broadcastingDay ? dayjs(Number(input.broadcastingDay)) : dayjs(),
      'Europe/Bucharest',
    ),
  });

  queryResultHandler({ query: queryData });

  return true;
};

export const getDevicePromotions = async (deviceId: string) => {
  const dataQuery = await supabase
    .from('devicesPromotionsView')
    .select('*', { count: 'exact' })
    .eq('deviceId', deviceId);

  const handledResult = queryResultHandler({
    query: dataQuery,
    status: 409,
  });

  return {
    data: handledResult,
    count: dataQuery.count,
  };
};

export const getDevicesLivePosition = async ({
  filters,
}: GetAllEntitiesArguments) => {
  const { date, ...restFilters } = filters;
  const dataQuery = supabase.rpc(
    'GetLastDeviceData',
    {
      date,
    },
    { count: 'exact' },
  );

  if (restFilters) {
    const filtersObject = Object.entries(restFilters);
    filtersObject.forEach(filter =>
      dataQuery.ilike(filter[0], `%${filter[1]}%`),
    );
  }
  const modifiedQuery = await addQueryModifiers<DeviceActivityReturnType[]>(
    dataQuery,
    {
      pagination: {
        entitiesPerPage: 1000,
      },
    },
  );

  const handledResults = queryResultHandler({
    query: modifiedQuery,
    status: 404,
  }) as DeviceActivityReturnType[];

  return {
    data: handledResults,
    count: modifiedQuery.count,
  };
};

export type DeviceSimpleModel = {
  id: string;
  createAt: string;
  system: string;
  location: string;
  inUse: boolean;
  identifier: string;
};

export type DBDeviceModel = {
  id: string;
  createAt: string;
  system: string;
  location: string;
  inUse: boolean;
  driver: UserModel;
  identifier: string;
};

export type DeviceModel = {
  deviceId: string;
  createAt: string;
  system: string;
  location: string;
  inUse: boolean;
  driver: UserModel;
  identifier: string;
};

export type AddDeviceModelInput = Omit<DeviceModel, 'id' | 'driver'> & {
  driverId?: string;
};

export type EditDeviceModelInput = Omit<DeviceModel, 'driver'>;

export type DeviceModelReturnType = Omit<DeviceModel, 'driver'> & {
  users: Array<UserModel>;
};
export type DeviceModelJoinedReturnType = DeviceModel & {
  users: Array<UserModel & { teams: TeamModel }>;
};
export type AddDeviceActivityInput = {
  userId: string;
  deviceId: string;
  latitude: number;
  longitude: number;
  broadcastingDay: string;
  distanceDriven: number;
};

export type DeviceActivityReturnType = {
  deviceId: string;
  lastTimeCreated: string;
  latitude: number;
  longitude: number;
  name: string;
  teamName: string;
};
