import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { GenericSchema } from '@supabase/supabase-js/dist/module/lib/types';

export type PaginationArguments = {
  page?: number;
  entitiesPerPage?: number;
};

export type GetAllEntitiesArguments = {
  pagination: PaginationArguments;
  filters: Record<string, unknown>;
};

const addPaginationModifiers = <ResultModel>(
  baseQuery: PostgrestFilterBuilder<
    GenericSchema,
    Record<string, unknown>,
    ResultModel
  >,
  pagination: PaginationArguments,
) => {
  const entitiesPerPage = pagination?.entitiesPerPage ?? 10;
  const page = pagination?.page ?? 1;
  const startingIndex = entitiesPerPage * (page - 1);
  const endingIndex = entitiesPerPage * page - 1;

  return baseQuery.range(startingIndex, endingIndex);
};

export const addQueryModifiers = async <ResultModel>(
  baseQuery: PostgrestFilterBuilder<
    GenericSchema,
    Record<string, unknown>,
    ResultModel
  >,
  modifiers: {
    pagination?: PaginationArguments;
  },
) => {
  const modifiersMapper: Record<string, typeof addPaginationModifiers> = {
    pagination: addPaginationModifiers,
  };
  return Object.entries(modifiers).reduce(
    (query, [modifier, modifierArgs]) =>
      modifiersMapper?.[modifier]<ResultModel>(query, modifierArgs),
    baseQuery,
  );
};
