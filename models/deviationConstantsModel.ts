import {
  GetAllEntitiesArguments,
  addQueryModifiers,
} from '../graphql/utils/modifiers';
import { queryResultHandler } from '../graphql/utils/errorHandlers';
import supabase from '../supabase';
import { ConstantInput } from '../graphql/resolvers/deviationConstantResolver';

export type ConstantsModel = {
  id: string;
  float: number;
  identifier: string;
};

export const getAllConstants = async ({
  pagination,
  filters,
}: GetAllEntitiesArguments) => {
  const dataQuery = supabase
    .from('deviationConstants')
    .select('*', { count: 'exact' });

  if (filters) {
    const filtersObject = Object.entries(filters);
    filtersObject.forEach(filter =>
      dataQuery.ilike(filter[0], `%${filter[1]}%`),
    );
  }
  const modifiedQuery = await addQueryModifiers<ConstantsModel[]>(dataQuery, {
    pagination,
  });

  const handledResults = queryResultHandler({
    query: modifiedQuery,
    status: 404,
  }) as ConstantsModel[];

  return {
    data: handledResults,
    count: modifiedQuery.count,
  };
};

export const getConstantById = async (constantId: string) => {
  const dataQuery = await supabase
    .from('deviationConstants')
    .select('*')
    .eq('id', constantId)
    .single();

  const handledResults = queryResultHandler({
    query: dataQuery,
    status: 404,
  }) as ConstantsModel;

  return handledResults;
};

export const addNewConstant = async (input: ConstantInput) => {
  const dataQuery = await supabase
    .from('deviationConstants')
    .upsert(input)
    .select('*')
    .single();

  const handledResults = queryResultHandler({
    query: dataQuery,
    status: 406,
  }) as ConstantsModel;

  if (input?.inUse) {
    await supabase
      .from('deviationConstants')
      .update({ inUse: false })
      .neq('id', handledResults.id);
  }

  return handledResults;
};

export const editConstant = async (input: EditConstantInput) => {
  const { id, inUse, ...editInputs } = input;
  if (inUse) {
    await supabase
      .from('deviationConstants')
      .update({ inUse: false })
      .neq('id', id);
  }

  const dataQuery = await supabase
    .from('deviationConstants')
    .update({
      inUse,
      ...editInputs,
    })
    .eq('id', id)
    .select('*')
    .single();

  const handledResults = queryResultHandler({
    query: dataQuery,
    status: 404,
  }) as ConstantsModel;

  return handledResults;
};

export const deleteConstants = async (constantsIds: Array<string>) => {
  const queryData = await supabase
    .from('deviationConstants')
    .delete({ count: 'exact' })
    .in('id', constantsIds);

  queryResultHandler({ query: queryData });
  return queryData.count;
};

export const getInUseConstant = async () => {
  const queryData = await supabase
    .from('deviationConstants')
    .select('*')
    .eq('inUse', true)
    .single();

  queryResultHandler({ query: queryData });
  return queryData.data;
};

export type EditConstantInput = {
  id: string;
  inUse?: boolean;
  identifier: string;
  constant: number;
};
