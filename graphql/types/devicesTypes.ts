export const devicesTypes = `#graphql


type DeviceModel {
  id: String!
  createAt: String!
  system: String!
  location: String!
  inUse: Boolean!
  driver: UserModel 
}

input AddDeviceInput {
  createAt: String!
  system: String!
  location: String!
  inUse: Boolean!
  driverId: String 
}

input EditDeviceInput {
  createAt: String!
  system: String!
  location: String!
  inUse: Boolean!
  driverId: String 
}

type Query {
  getAllDevices: [DeviceModel]!
  getDeviceById(deviceId: String!): Device
}

type Mutation {
  addNewDevice(input: AddDeviceInput!): Device
  editDevice(input: EditDeviceInput!): Device
  deleteDevice(deviceId: String!): Int
}

`;
