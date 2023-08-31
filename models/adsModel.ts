import { query } from 'express';
import {
  PromotionInput,
  EditPromotionInput,
} from '../graphql/resolvers/promotionsResolver';
import { queryResultHandler } from '../graphql/utils/errorHandlers';
import supabase from '../supabase';

export const getAllPromotions = async () => {
  const dataQuery = await supabase.from('promotions').select('*');

  const handledResults = queryResultHandler({
    query: dataQuery,
    status: 404,
  });

  return {
    data: handledResults,
    count: handledResults.length,
  };
};

export const getPromotionById = async (promotionId: string) => {
  const dataQuery = await supabase
    .from('promotions')
    .select('*')
    .eq('id', promotionId)
    .single();

  const handledResults = queryResultHandler({
    query: dataQuery,
    status: 404,
  });

  return handledResults;
};

export const addNewPromotion = async (input: PromotionInput) => {
  const dataQuery = await supabase
    .from('promotions')
    .upsert(input)
    .select('*')
    .single();

  const handledResults = queryResultHandler({
    query: dataQuery,
    status: 406,
  });

  return handledResults;
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
