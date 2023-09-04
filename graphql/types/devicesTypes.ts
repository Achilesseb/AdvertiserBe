export const devicesTypes = `#graphql


type DeviceModel {
  id: String!
  createdAt: String!
  system: String!
  location: String!
  inUse: Boolean!
  driver: UserModel 
}

input AddDeviceInput {
  system: String!
  location: String!
  inUse: Boolean!
  driverId: String 
  identificator: String!
}

input EditDeviceInput {
  id:String!
  system: String
  location: String
  inUse: Boolean
  driverId: String 
  identificator: String
}

type GetAllDevicesResponse {
  data: [DeviceModel]!
  count: Int!
}
type Query {

  getAllDevices: GetAllDevicesResponse!
  getDeviceById(deviceId: String!): DeviceModel
}

type Mutation {
  addNewDevice(input: AddDeviceInput!): DeviceModel
  editDevice(input: EditDeviceInput!): DeviceModel
  deleteDevice(deviceId: String!): Int
}

`;
