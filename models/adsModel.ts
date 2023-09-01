import { query } from 'express';
import {
  PromotionInput,
  EditPromotionInput,
} from '../graphql/resolvers/promotionsResolver';
import { queryResultHandler } from '../graphql/utils/errorHandlers';
import supabase from '../supabase';
import _ from 'lodash';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { GenericSchema } from '@supabase/postgrest-js/dist/module/types';

const promotionMapppingFunction = (results: { clients: unknown }) => {
  const { clients: client, ...data } = results;
  return {
    ...data,
    client,
  };
};

const addPaginationModifiers = (
  baseQuery: PostgrestFilterBuilder<
    GenericSchema,
    Record<string, unknown>,
    unknown[]
  >,
  pagination: {
    entitiesPerPage: number;
    page: number;
  },
) => {
  const entitiesPerPage = pagination.entitiesPerPage ?? 10;
  const page = pagination.page ?? 1;
  const startingIndex = entitiesPerPage * (page - 1);
  const endingIndex = entitiesPerPage * page;

  return baseQuery.range(startingIndex, endingIndex);
};

export const addQueryModifiers = async (
  baseQuery: PostgrestFilterBuilder<
    GenericSchema,
    Record<string, unknown>,
    unknown[]
  >,
  modifiers: {
    pagination: {
      entitiesPerPage: number;
      page: number;
    };
  },
) => {
  const modifiersMapper = {
    pagination: addPaginationModifiers,
  };
  return Object.entries(modifiers).reduce((query, [modifier, modifierArgs]) => {
    modifiersMapper[modifier](query, modifierArgs);
  }, baseQuery);
};

export const getAllPromotions = async (input: unknown) => {
  const dataQuery = supabase
    .from('promotions')
    .select('*, clients(*)')
    .eq('id', '123123213')
    .range(0, 10);

  // if (!_.isEmpty(filters)) {
  console.log(dataQuery);
  // }
  // const modifiedQuery =
  // const handledResults = queryResultHandler({
  //   query: dataQuery,
  //   status: 404,
  // });

  // return {
  //   data: handledResults.map(promotionMapppingFunction),
  //   count: handledResults.length,
  // };
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
