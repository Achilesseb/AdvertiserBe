import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { GenericSchema } from '@supabase/supabase-js/dist/module/lib/types';

const addPaginationModifiers = <ResultModel>(
  baseQuery: PostgrestFilterBuilder<GenericSchema, any, ResultModel>,
  pagination: PaginationArguments,
) => {
  const entitiesPerPage = pagination?.entitiesPerPage ?? 10;
  const page = pagination?.page ?? 1;
  const startingIndex = entitiesPerPage * (page - 1);
  const endingIndex = entitiesPerPage * page - 1;

  return baseQuery.range(startingIndex, endingIndex);
};

const addSortingModifiers = <ResultModel>(
  baseQuery: PostgrestFilterBuilder<GenericSchema, any, ResultModel>,
  sort: SortingArguments,
) => {
  const sortDirection = sort?.direction === 'asc' || false;
  return baseQuery.order(sort.field, { ascending: !sortDirection });
};

export const addQueryModifiers = async <ResultModel>(
  baseQuery: PostgrestFilterBuilder<GenericSchema, any, ResultModel>,
  modifiers: {
    pagination?: PaginationArguments;
    sort?: SortingArguments;
  },
) => {
  const modifiersMapper: ModifierMapperTypes = {
    pagination: addPaginationModifiers,
    sort: addSortingModifiers,
  };
  return Object.entries(modifiers).reduce(
    (query, [modifier, modifierArgs]) =>
      modifiersMapper?.[modifier as keyof ModifierMapperTypes]<ResultModel>(
        query,
        modifierArgs as any,
      ),
    baseQuery,
  );
};

type ModifierMapperTypes = {
  pagination: typeof addPaginationModifiers;
  sort: typeof addSortingModifiers;
};

export type PaginationArguments = {
  page?: number;
  entitiesPerPage?: number;
};

export type SortingArguments = {
  field: string;
  direction: string;
};

export type GetAllEntitiesArguments = {
  pagination: PaginationArguments;
  sort: SortingArguments;
  filters: Record<string, unknown>;
};
