import { GetAllEntitiesArguments } from './../utils/modifiers';
import { getRole } from '../../models/rolesModel';
import {
  Roles,
  addNewUser,
  deleteUser,
  editUser,
  getAllUsers,
  getUserById,
} from '../../models/usersModel';
import { createUserRoleAssociation } from '../utils/associationsHandlers';

export type UserInput = {
  name: string;
  phone: string;
  email: string;
  city: string;
  role: string;
  address?: string;
  carDetails?: string;
  registrationPlate?: string;
  tabletId?: string;
  tablets?: number;
};

export type EditUserInput = Omit<UserInput, 'role' | 'email'> & {
  id: string;
};

export const usersResolver = {
  Query: {
    getAllUsers: (_: unknown, { input }: { input: GetAllEntitiesArguments }) =>
      getAllUsers(input ?? {}),
    getUserById: (_: undefined, { userId }: { userId: string }) =>
      getUserById(userId),
  },
  Mutation: {
    addNewUser: async (_: undefined, { input }: { input: UserInput }) => {
      const userData = await addNewUser(input);

      const roleData = await getRole(Roles.driver);

      await createUserRoleAssociation(userData.id, roleData.id);

      return userData;
    },

    editUser: (_: undefined, { input }: { input: EditUserInput }) =>
      editUser(input),
    deleteUser: (_: undefined, { usersIds }: { usersIds: Array<string> }) =>
      deleteUser(usersIds),
  },
};
