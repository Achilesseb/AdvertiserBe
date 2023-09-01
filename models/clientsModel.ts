import {
  ClientInput,
  EditClientInput,
} from '../graphql/resolvers/clientsResolver'; // Update the import path accordingly
import { queryResultHandler } from '../graphql/utils/errorHandlers';
import supabase from '../supabase';

export const getAllClients = async () => {
  const dataQuery = await supabase.from('clientsandpromotions').select('*');

  const handledResults = queryResultHandler({
    query: dataQuery,
    status: 404,
  });

  return {
    data: handledResults,
    count: handledResults.length,
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
