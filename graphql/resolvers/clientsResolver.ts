import {
  addNewClient,
  deleteClient,
  editClient,
  getAllClients,
  getClientById,
} from '../../models/clientsModel';

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
    getAllClients: async () => getAllClients(),
    getClientById: async (_: undefined, { clientId }: { clientId: string }) =>
      getClientById(clientId),
  },
  Mutation: {
    addNewClient: async (_: undefined, { input }: { input: ClientInput }) =>
      addNewClient(input),
    editClient: async (_: undefined, { input }: { input: EditClientInput }) =>
      editClient(input),
    deleteClient: async (
      _: undefined,
      { clientIds }: { clientIds: Array<string> },
    ) => deleteClient(clientIds),
  },
};
