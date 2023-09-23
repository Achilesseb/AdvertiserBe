import {
  addNewClient,
  deleteClient,
  editClient,
  getAllClients,
  getClientById,
} from '../../models/clientsModel';
import { GetAllEntitiesArguments } from '../utils/modifiers';

export type ClientInput = {
  name: string;
  contactEmail: string;
  phone: string;
  address: string;
  cui: string;
  city: string;
};

export type EditClientInput = ClientInput & {
  id: string;
};

export const clientsResolver = {
  Query: {
    getAllClients: (
      _: unknown,
      { input }: { input: GetAllEntitiesArguments },
    ) => getAllClients(input ?? {}),
    getClientById: (_: undefined, { id }: { id: string }) => getClientById(id),
  },
  Mutation: {
    addNewClient: (_: undefined, { input }: { input: ClientInput }) =>
      addNewClient(input),
    editClient: (_: undefined, { input }: { input: EditClientInput }) =>
      editClient(input),
    deleteClient: (_: undefined, { clientIds }: { clientIds: Array<string> }) =>
      deleteClient(clientIds),
  },
};
