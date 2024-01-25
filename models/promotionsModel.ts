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
  const { clientId, ...restFilters } = filters ?? {};
  const dataQuery = supabase
    .from('promotions')
    .select<string, PromotionModel>('*, clients(*)', {
      count: 'exact',
    });

  if (clientId) {
    dataQuery.eq('clientId', clientId);
  }

  if (restFilters) {
    const filtersObject = Object.entries(restFilters);
    filtersObject.forEach(filter =>
      dataQuery.ilike(filter[0], `%${filter[1]}%`),
    );
  }

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

export const getPromotionById = async (id: string) => {
  const dataQuery = await supabase
    .from('promotions')
    .select('*, clients(*)')
    .eq('id', id)
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

export const getPromotionByTeam = async ({
  pagination,
  filters,
}: GetAllEntitiesArguments) => {
  const { teamId, ...restFilters } = filters ?? {};
  const dataQuery = supabase
    .from('teamsPromotionsView')
    .select<string, TeamsPromotionsView>('*', {
      count: 'exact',
    });

  if (teamId) {
    dataQuery.eq('teamId', teamId);
  }

  if (restFilters) {
    const filtersObject = Object.entries(restFilters);
    filtersObject.forEach(filter =>
      dataQuery.ilike(filter[0], `%${filter[1]}%`),
    );
  }

  const modifiedQuery = await addQueryModifiers<TeamsPromotionsView[]>(
    dataQuery,
    {
      pagination,
    },
  );

  const handledResults = queryResultHandler({
    query: modifiedQuery,
    status: 404,
  }) as TeamsPromotionsView[];

  return {
    data: handledResults,
    count: modifiedQuery.count,
  };
};

export const addNewPromotionToTeam = async (input: TeamsPromotionsInput) => {
  const dataQuery = await supabase
    .from('teamPromotions')
    .upsert(input)
    .select('*')
    .single();
  return queryResultHandler({
    query: dataQuery,
    status: 406,
  });
};

export const deletePromoFromTeam = async (
  promotionsIds: string[],
  teamId: string,
) => {
  const dataQuery = await supabase
    .from('teamPromotions')
    .delete()
    .in('promotionId', promotionsIds)
    .eq('teamId', teamId)
    .select('*');

  queryResultHandler({
    query: dataQuery,
    status: 404,
  });

  return {
    count: dataQuery?.count ?? 0,
  };
};

export type TeamsPromotionsView = {
  id: string;
  title: string;
  fileName: string;
  teamId: string;
  name: string;
};

export type TeamsPromotionsInput = {
  promotionId: string;
  teamId: string;
  startDate?: string;
};
