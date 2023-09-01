export const clientsTypes = `#graphql
  # clientsTypes.graphql

type ClientModel {
  id: String
  name: String
  contactEmail: String
  phone: String
  address: String
  cui: String
  city: String
  createdAt: String
}

type GetAllClientsResponse {
  count: Int
  data: [ClientModel]!
}

input AddClientInput {
  name: String!
  contactEmail: String!
  phone: String!
  address: String!
  cui: String!
  city: String!
}

input EditClientInput {
  id: String!
  name: String
  contactEmail: String
  phone: String
  address: String
  cui: String
  city: String
}

type Query {
  getAllClients: GetAllClientsResponse
  getClientById(clientId: String!): ClientModel!
}

type Mutation {
  addNewClient(input: AddClientInput): ClientModel
  editClient(input: EditClientInput): ClientModel
  deleteClient(clientIds: [String]!): Int
}

`;
