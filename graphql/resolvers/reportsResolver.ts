import {
  getClientsReports,
  getDriversReports,
  getPromotionsReports,
  getUniqueDriverReports,
} from '../../models/reportsModel';
import { GetAllEntitiesArguments } from '../utils/modifiers';

export const reportsResolver = {
  Query: {
    getClientReports: (
      _parent: undefined,
      { input }: { input: GetAllEntitiesArguments },
    ) => getClientsReports(input ?? {}),
    getPromotionsReports: (
      _parent: undefined,
      { input }: { input: GetAllEntitiesArguments },
    ) => getPromotionsReports(input),
    getDriversReports: (
      _parent: undefined,
      { input }: { input: GetAllEntitiesArguments },
    ) => getDriversReports(input),
    getUniqueDriverReports: (
      _parent: undefined,
      { input }: { input: GetAllEntitiesArguments },
    ) => getUniqueDriverReports(input),
  },
};
