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

type ClientModelView {
  id: String
  name: String
  contactEmail: String
  phone: String
  address: String
  cui: String
  city: String
  createdAt: String
  totalPromotions: Int
  promotions: String
  totalDuration: Int
}

type GetAllClientsResponse {
  count: Int
  data: [ClientModelView]!
}

input AddClientInput {
  name: String!
  contactEmail: String!
  phone: String
  address: String
  cui: String
  city: String
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
input ClientsFiltersInput {
  city: String
  name: String
}
input GetAllClientsInput {
 pagination: PaginationArguments
 filters: ClientsFiltersInput
 }
type Query {
  getAllClients(input: GetAllClientsInput): GetAllClientsResponse
  getClientById(id: String!): ClientModel!
}

type Mutation {
  addNewClient(input: AddClientInput): ClientModel
  editClient(input: EditClientInput): ClientModel
  deleteClient(clientIds: [String]!): Int
}

`;
