import supabase from '../supabase';
import { UserInput, EditUserInput } from '../graphql/resolvers/usersResolver';
import { queryResultHandler } from '../graphql/utils/errorHandlers';
import crypto from 'crypto';
import {
  GetAllEntitiesArguments,
  addQueryModifiers,
} from '../graphql/utils/modifiers';

export enum Roles {
  driver = 'driver',
  admin = 'admin',
}
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
  tabletId: string;
  tablets: number;
  role: string;
  createdAt: string;
};

export const getAllUsers = async ({
  pagination,
  filters,
}: GetAllEntitiesArguments) => {
  const dataQuery = supabase.from('users').select('*', { count: 'exact' });

  const modifiedQuery = await addQueryModifiers<UserModel[]>(dataQuery, {
    pagination,
  });

  const handledResults = queryResultHandler({
    query: modifiedQuery,
    status: 404,
  }) as UserModel[];

  return {
    data: handledResults,
    count: modifiedQuery.count,
  };
};

export const getUserById = async (userId: string) => {
  const dataQuery = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  const handledResults = queryResultHandler({
    query: dataQuery,
    status: 404,
  });

  return handledResults;
};

export const addNewUser = async (input: UserInput) => {
  const registrationCode = crypto
    .createHash('shake256', { outputLength: 5 })
    .update(input?.email)
    .digest('hex');

  const dataQuery = await supabase
    .from('users')
    .upsert({
      ...input,
      registrationCode: registrationCode,
    })
    .select('*')
    .single();

  return queryResultHandler({
    query: dataQuery,
    status: 406,
  });
};

export const editUser = async (input: EditUserInput) => {
  const { id, ...editInputs } = input;
  const dataQuery = await supabase
    .from('users')
    .update(editInputs)
    .eq('id', id)
    .select('*')
    .single();

  const handledResults = queryResultHandler({
    query: dataQuery,
    status: 404,
  });

  return handledResults;
};

export const deleteUser = async (usersIds: Array<string>) => {
  const queryData = await supabase.from('users').delete().in('id', usersIds);

  queryResultHandler({ query: queryData });

  return queryData.count;
};
