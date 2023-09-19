import {
  GetAllEntitiesArguments,
  PaginationArguments,
  addQueryModifiers,
} from '../graphql/utils/modifiers';
import { queryResultHandler } from '../graphql/utils/errorHandlers';
import supabase from '../supabase';
import { EditTeamInput, TeamInput } from '../graphql/resolvers/teamsResolver';

export type TeamModel = {
  id: string;
  city: string;
  name: string;
  createdAt: string;
};

export type TeamModelView = {
  id: string;
  city: string;
  name: string;
  createdAt: string;
  totalDrivers: number;
  drivers: string;
  totalPromotions: number;
  totalDurations: number;
};

export const getAllTeams = async ({
  pagination,
  filters,
}: GetAllEntitiesArguments) => {
  const dataQuery = supabase.from('teamsView').select('*', { count: 'exact' });
  if (filters) {
    const filtersObject = Object.entries(filters);
    filtersObject.forEach(filter =>
      dataQuery.ilike(filter[0], `%${filter[1]}%`),
    );
  }
  const modifiedQuery = await addQueryModifiers<TeamModelView[]>(dataQuery, {
    pagination,
  });

  const handledResults = queryResultHandler({
    query: modifiedQuery,
    status: 404,
  }) as TeamModelView[];

  return {
    data: handledResults,
    count: modifiedQuery.count,
  };
};

export const getTeamDrivers = async ({
  pagination,
  filters,
}: GetAllEntitiesArguments) => {
  const dataQuery = supabase
    .from('users')
    .select('*', { count: 'exact' })
    .eq('teamId', filters.teamId);

  const modifiedQuery = await addQueryModifiers<TeamModelView[]>(dataQuery, {
    pagination,
  });

  const handledResults = queryResultHandler({
    query: modifiedQuery,
    status: 404,
  }) as TeamModelView[];

  return {
    data: handledResults,
    count: modifiedQuery.count,
  };
};

export const getTeamById = async (teamId: string) => {
  const dataQuery = await supabase
    .from('teamsView')
    .select('*')
    .eq('id', teamId)
    .single();

  const handledResults = queryResultHandler({
    query: dataQuery,
    status: 404,
  }) as TeamModel;

  return handledResults;
};

export const addNewTeam = async (input: TeamInput) => {
  const dataQuery = await supabase
    .from('teams')
    .upsert(input)
    .select('*')
    .single();

  const handledResults = queryResultHandler({
    query: dataQuery,
    status: 406,
  }) as TeamModel;

  return handledResults;
};

export const editTeam = async (input: EditTeamInput) => {
  const { id, ...editInputs } = input;
  const dataQuery = await supabase
    .from('teams')
    .update(editInputs)
    .eq('id', id)
    .select('*')
    .single();

  const handledResults = queryResultHandler({
    query: dataQuery,
    status: 404,
  }) as TeamModel;

  return handledResults;
};

export const deleteTeam = async (teamIds: Array<string>) => {
  const queryData = await supabase
    .from('teams')
    .delete({ count: 'exact' })
    .in('id', teamIds);

  queryResultHandler({ query: queryData });
  return queryData.count;
};

const handleDevicePromotionUpdate = () => {};
