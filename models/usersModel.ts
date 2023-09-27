import supabase from '../supabase';
import { UserInput, EditUserInput } from '../graphql/resolvers/usersResolver';
import { queryResultHandler } from '../graphql/utils/errorHandlers';
import * as crypto from 'crypto-js';
import {
  GetAllEntitiesArguments,
  addQueryModifiers,
} from '../graphql/utils/modifiers';
import { DeviceModel } from './devicesModel';
import { TeamModel } from './teamsModel';

export enum Roles {
  driver = 'driver',
  admin = 'admin',
}
export type UserModelDBResultType = {
  id: string;
  address: string;
  registrationPlate: string;
  city: string;
  name: string;
  phone: string;
  teams: TeamModel;
  email: string;
  carDetails: string;
  tablets: number;
  role: string;
  createdAt: string;
  registrationCode: number;
  deviceId: string;
  teamId: string;
};

export type UserModel = {
  id: string;
  address: string;
  registrationPlate: string;
  city: string;
  name: string;
  phone: string;
  team: string;
  email: string;
  carDetails: string;
  tablets: number;
  role: string;
  createdAt: string;
  registrationCode: number;
  deviceId: string;
  teamId: string;
};

const userDeviceTeamsMappingFunc = (result: UserAndDeviceTeamsDBRawTypes) => {
  const { devices, teams, ...rest } = result;
  return {
    ...rest,
    device: devices,
    team: teams,
  };
};

const userAndDeviceMappingFunc = (result: UserAndDeviceDBRawTypes) => {
  const { devices, ...rest } = result;
  return {
    ...rest,
    device: devices,
  };
};

export const getAllUsers = async ({
  pagination,
  filters,
}: GetAllEntitiesArguments) => {
  const dataQuery = supabase
    .from('users')
    .select('*, teams(name)', { count: 'exact' });

  if (filters) {
    const filtersObject = Object.entries(filters);
    filtersObject.forEach(filter =>
      dataQuery.ilike(filter[0], `%${filter[1]}%`),
    );
  }
  const modifiedQuery = await addQueryModifiers<UserModelDBResultType[]>(
    dataQuery,
    {
      pagination,
    },
  );

  const handledResults = queryResultHandler({
    query: modifiedQuery,
    status: 404,
  }) as UserModelDBResultType[];

  return {
    data: handledResults.map(result => ({
      ...result,
      teamName: result.teams?.name,
    })),
    count: modifiedQuery.count,
  };
};

export const getUserById = async (userId: string) => {
  const dataQuery = await supabase
    .from('users')
    .select('*, devices(*), teams(*)')
    .eq('id', userId)
    .single();

  const handledResults = queryResultHandler({
    query: dataQuery,
    status: 404,
  }) as UserAndDeviceTeamsDBRawTypes;

  return userDeviceTeamsMappingFunc(handledResults);
};

export const getUserByEmail = async (userEmail: string) => {
  const dataQuery = await supabase
    .from('users')
    .select('*')
    .eq('email', userEmail)
    .single();

  const handledResults = queryResultHandler({
    query: dataQuery,
    status: 404,
  });

  return handledResults;
};

export const addNewUser = async (input: UserInput) => {
  const registrationCode = crypto
    .SHA256(input?.email, { blockSize: 5 })
    .toString()
    .slice(0, 6);
  const dataQuery = await supabase
    .from('users')
    .upsert({
      ...input,
      registrationCode: registrationCode,
    })
    .select('*, devices(*)')
    .single();

  const handledResult = queryResultHandler({
    query: dataQuery,
    status: 406,
  });

  return userAndDeviceMappingFunc(handledResult) as UserAndDeviceAddResultTypes;
};

export const editUser = async (input: EditUserInput) => {
  const { userId: id, ...editInputs } = input;
  const dataQuery = await supabase
    .from('users')
    .update(editInputs)
    .eq('id', id)
    .select('*, devices(*), teams(*)')
    .single();

  if (!dataQuery.data && !dataQuery.error) {
    const userDataQuery = await supabase
      .from('users')
      .select('*, devices(*)')
      .eq('id', id)
      .single();

    const handledUserResults = queryResultHandler({
      query: userDataQuery,
      status: 404,
    });

    return userDeviceTeamsMappingFunc(
      handledUserResults,
    ) as UserAndDeviceEditResultTypes;
  }
  const handledResults = queryResultHandler({
    query: dataQuery,
    status: 404,
  });

  return userAndDeviceMappingFunc(
    handledResults,
  ) as UserAndDeviceEditResultTypes;
};

export const deleteUser = async (usersIds: Array<string>) => {
  const queryData = await supabase.from('users').delete().in('id', usersIds);

  queryResultHandler({ query: queryData });

  return queryData.count;
};

export const getAllAvailableUsers = async ({
  pagination,
  filters,
}: GetAllEntitiesArguments) => {
  const dataQuery = supabase.from('users').select('*', { count: 'exact' });

  if (filters) {
    const filtersObject = Object.entries(filters);
    filtersObject.forEach(filter =>
      dataQuery.ilike(filter[0], `%${filter[1]}%`),
    );
  }
  const modifiedQuery = await addQueryModifiers<UserModel[]>(dataQuery, {
    pagination: {
      entitiesPerPage: 1000,
    },
  });

  const handledResults = queryResultHandler({
    query: modifiedQuery,
    status: 404,
  }) as UserModel[];

  const filteredUsers = handledResults.filter(users => users.deviceId === null);
  return {
    data: filteredUsers,
    count: filteredUsers.length,
  };
};

export const getAllUnTeamedUsers = async ({
  pagination,
  filters,
}: GetAllEntitiesArguments) => {
  const dataQuery = supabase.from('users').select('*', { count: 'exact' });

  if (filters) {
    const filtersObject = Object.entries(filters);
    filtersObject.forEach(filter =>
      dataQuery.ilike(filter[0], `%${filter[1]}%`),
    );
  }
  const modifiedQuery = await addQueryModifiers<UserModel[]>(dataQuery, {
    pagination: {
      entitiesPerPage: 1000,
    },
  });

  const handledResults = queryResultHandler({
    query: modifiedQuery,
    status: 404,
  }) as UserModel[];

  const filteredUsers = handledResults.filter(users => users.teamId === null);
  return {
    data: filteredUsers,
    count: filteredUsers.length,
  };
};

export const deleteUserFromTeam = async (userIds: string[]) => {
  const dataQuery = await supabase
    .from('users')
    .update({ teamId: null }, { count: 'exact' })
    .in('id', userIds)
    .select('*');

  queryResultHandler({
    query: dataQuery,
    status: 404,
  });
  return {
    count: dataQuery?.count ?? 0,
  };
};

export type UserDBRawTypes = {
  name: string;
  phone: string;
  email: string;
  city: string;
  role: string;
  address: string;
  carDetails: string;
  registrationPlate: string;
  driverId: string;
};

export type UserAndDeviceDBRawTypes = UserDBRawTypes & {
  devices: DeviceModel;
};
export type UserAndDeviceTeamsDBRawTypes = UserDBRawTypes & {
  devices: DeviceModel;
  teams: TeamModel;
};
export type UserAndDeviceEditResultTypes = UserDBRawTypes & {
  device: DeviceModel;
};

export type UserAndDeviceAddResultTypes = UserAndDeviceEditResultTypes & {
  registrationCode: string;
};
