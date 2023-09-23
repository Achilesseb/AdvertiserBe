import {
  GetAllEntitiesArguments,
  PaginationArguments,
  addQueryModifiers,
} from './../graphql/utils/modifiers';
import {
  ClientInput,
  EditClientInput,
} from '../graphql/resolvers/clientsResolver'; // Update the import path accordingly
import { queryResultHandler } from '../graphql/utils/errorHandlers';
import supabase from '../supabase';

export type ClientModel = {
  id: string;
  name: string;
  contactEmail: string;
  phone: string;
  address: string;
  cui: string;
  city: string;
  createdAt: string;
};

export const getAllClients = async ({
  pagination,
  filters,
}: GetAllEntitiesArguments) => {
  const dataQuery = supabase
    .from('clientsAndPromotionsView')
    .select('*', { count: 'exact' });

  if (filters) {
    const filtersObject = Object.entries(filters);
    filtersObject.forEach(filter =>
      dataQuery.ilike(filter[0], `%${filter[1]}%`),
    );
  }

  const modifiedQuery = await addQueryModifiers<ClientModel[]>(dataQuery, {
    pagination,
  });

  const handledResults = queryResultHandler({
    query: modifiedQuery,
    status: 404,
  }) as ClientModel[];

  return {
    data: handledResults,
    count: modifiedQuery.count,
  };
};

export const getClientById = async (clientId: string) => {
  const dataQuery = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .single();

  const handledResults = queryResultHandler({
    query: dataQuery,
    status: 404,
  });

  return handledResults;
};

export const addNewClient = async (input: ClientInput) => {
  const dataQuery = await supabase
    .from('clients')
    .upsert(input)
    .select('*')
    .single();

  const handledResults = queryResultHandler({
    query: dataQuery,
    status: 406,
  });

  return handledResults;
};

export const editClient = async (input: EditClientInput) => {
  const { id, ...editInputs } = input;
  const dataQuery = await supabase
    .from('clients')
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

export const deleteClient = async (clientIds: Array<string>) => {
  const queryData = await supabase
    .from('clients')
    .delete({ count: 'exact' })
    .in('id', clientIds);

  queryResultHandler({ query: queryData });
  return queryData.count;
};
