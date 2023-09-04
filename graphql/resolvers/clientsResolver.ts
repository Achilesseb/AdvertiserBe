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
    getAllClients: () => getAllClients(),
    getClientById: (_: undefined, { clientId }: { clientId: string }) =>
      getClientById(clientId),
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
