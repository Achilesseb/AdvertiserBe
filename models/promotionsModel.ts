import { queryResultHandler } from '../graphql/utils/errorHandlers';
import supabase from '../supabase';
import _ from 'lodash';

import {
  GetAllEntitiesArguments,
  addQueryModifiers,
} from '../graphql/utils/modifiers';
import { ClientModel } from './clientsModel';

export type PromotionInput = {
  title: string;
  description: string;
  fileName: string;
  category?: string;
  duration?: number;
  clientId: string;
};

export type EditPromotionInput = Omit<
  PromotionInput,
  'fileName' | 'url' | 'clientId'
> & {
  id: string;
};

type PromotionModel = {
  id: string;
  title: string;
  description: string;
  url: string;
  duration: number;
  category: string;
  fileName: string;
  clients: ClientModel;
};

const promotionMapppingFunction = (results: { clients: ClientModel }) => {
  const { clients: client, ...data } = results;
  return {
    ...data,
    client,
  };
};

export const getAllPromotions = async ({
  pagination,
  filters,
}: GetAllEntitiesArguments) => {
  const dataQuery = supabase
    .from('promotions')
    .select<string, PromotionModel>('*, clients(*)', {
      count: 'exact',
    });

  const modifiedQuery = await addQueryModifiers<PromotionModel[]>(dataQuery, {
    pagination,
  });

  const handledResults = queryResultHandler({
    query: modifiedQuery,
    status: 404,
  }) as PromotionModel[];

  return {
    data: handledResults.map(promotionMapppingFunction),
    count: modifiedQuery.count,
  };
};

export const getPromotionById = async (promotionId: string) => {
  const dataQuery = await supabase
    .from('promotions')
    .select('*, clients(*)')
    .eq('id', promotionId)
    .single();

  const handledResults = queryResultHandler({
    query: dataQuery,
    status: 404,
  });

  return promotionMapppingFunction(handledResults);
};

export const addNewPromotion = async (
  input: Omit<PromotionInput, 'clientId'>,
) => {
  const dataQuery = await supabase
    .from('promotions')
    .upsert(input)
    .select('*')
    .single();

  return queryResultHandler({
    query: dataQuery,
    status: 406,
  });
};

export const editPromotion = async (input: EditPromotionInput) => {
  const { id, ...editInputs } = input;
  const dataQuery = await supabase
    .from('promotions')
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

export const deletePromotion = async (promotionIds: Array<string>) => {
  const queryData = await supabase
    .from('promotions')
    .delete({ count: 'exact' })
    .in('id', promotionIds);

  queryResultHandler({ query: queryData });
  return queryData.count;
};
