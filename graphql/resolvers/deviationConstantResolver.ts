import {
  addNewConstant,
  deleteConstants,
  editConstant,
  getConstantById,
} from './../../models/deviationConstantsModel';
import { getAllConstants } from '../../models/deviationConstantsModel';
import { GetAllEntitiesArguments } from '../utils/modifiers';

export type ConstantInput = {
  constant: number;
  identifier: string;
  inUse?: boolean;
};

export type EditConstantInput = {
  id: string;
  constant: number;
  identifier: string;
  inUse: boolean;
};

export const deviationConstantsResolver = {
  Query: {
    getAllConstants: (
      _: unknown,
      { input }: { input: GetAllEntitiesArguments },
    ) => getAllConstants(input ?? {}),
    getConstant: (_: undefined, { id }: { id: string }) => getConstantById(id),
  },
  Mutation: {
    addNewConstant: (_: undefined, { input }: { input: ConstantInput }) =>
      addNewConstant(input),
    editConstant: (_: undefined, { input }: { input: EditConstantInput }) =>
      editConstant(input),
    deleteConstants: (
      _: undefined,
      { constantsIds }: { constantsIds: Array<string> },
    ) => deleteConstants(constantsIds),
  },
};
