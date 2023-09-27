import dayjs from 'dayjs';
import supabase from '../supabase';
import utc from 'dayjs/plugin/utc';
import { getInUseConstant } from './deviationConstantsModel';
import {
  GetAllEntitiesArguments,
  addQueryModifiers,
} from '../graphql/utils/modifiers';
import { AVERAGE_TRIP } from '../constants/magicNumbers';
import { queryResultHandler } from '../graphql/utils/errorHandlers';

dayjs.extend(utc);

export const getClientsReports = async ({
  pagination,
  filters,
}: GetAllEntitiesArguments) => {
  const inUseConstant = await getInUseConstant();

  const { startDate, endDate, ...restFilters } = filters ?? '';
  if (!startDate && !endDate) return;

  const dataQuery = supabase.rpc(
    'GetClientsOverAllStatistics',
    {
      startDate: dayjs.utc(startDate as string).format('MM-DD-YYYY'),
      endDate: dayjs.utc(endDate as string).format('MM-DD-YYYY'),
      constant: inUseConstant.constant,
      averageTrip: AVERAGE_TRIP,
    },
    { count: 'exact' },
  );

  if (restFilters) {
    const filtersObject = Object.entries(restFilters);
    filtersObject.forEach(filter =>
      dataQuery.ilike(filter[0], `%${filter[1]}%`),
    );
  }

  const modifiedQuery = await addQueryModifiers<ClientReportsModel[]>(
    dataQuery,
    {
      pagination,
    },
  );
  const handledResults = queryResultHandler({
    query: modifiedQuery,
    status: 404,
  }) as ClientReportsModel[];

  return {
    data: handledResults.map(result => {
      const { clientId, ...rest } = result;
      return {
        id: clientId,
        ...rest,
      };
    }),
    count: modifiedQuery.count,
  };
};

export const getPromotionsReports = async ({
  pagination,
  filters,
}: GetAllEntitiesArguments) => {
  const inUseConstant = await getInUseConstant();

  const { startDate, endDate, clientId, ...restFilters } = filters ?? '';
  if ((!startDate && !endDate) || !clientId) return;
  const dataQuery = supabase.rpc(
    'GetPromotionsStatistics',
    {
      startDate: dayjs.utc(startDate as string).format('MM-DD-YYYY'),
      endDate: dayjs.utc(endDate as string).format('MM-DD-YYYY'),
      client: clientId,
      constant: inUseConstant.constant,
      averageTrip: AVERAGE_TRIP,
    },
    { count: 'exact' },
  );

  if (restFilters) {
    const filtersObject = Object.entries(restFilters);
    filtersObject.forEach(filter =>
      dataQuery.ilike(filter[0], `%${filter[1]}%`),
    );
  }

  const modifiedQuery = await addQueryModifiers<PromotionsReportsModel[]>(
    dataQuery,
    {
      pagination,
    },
  );

  const handledResults = queryResultHandler({
    query: modifiedQuery,
    status: 404,
  }) as PromotionsReportsModel[];

  return {
    data: handledResults,
    count: modifiedQuery.count,
  };
};

export type ClientReportsModel = {
  clientId: string;
  name: string;
  promotionNumber: number;
  tripsNumber: number;
  totalKilometers: number;
};

export type PromotionsReportsModel = {
  promotionsId: string;
  totalDistance: number;
  clientId: string;
  title: number;
  trips: number;
};
