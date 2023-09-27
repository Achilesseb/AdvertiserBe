import {
  getClientsReports,
  getPromotionsReports,
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
  },
};
