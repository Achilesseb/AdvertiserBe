export const devicesTypes = `#graphql

type DeviceSimpleModel {
  id: String!
  createdAt: String!
  system: String!
  location: String!
  inUse: Boolean!
  identifier: String
}

type DeviceModel {
  id: String!
  createdAt: String!
  system: String!
  location: String!
  inUse: Boolean!
  driver: UserModel 
  identifier: String
}

input AddDeviceInput {
  system: String!
  location: String!
  inUse: Boolean!
  driverId: String 
  identifier: String!
}

input EditDeviceInput {
  deviceId:String!
  system: String
  location: String
  inUse: Boolean
  identifier: String
}

input AddDeviceActivityInput{
  userId: String!
  deviceId: String!
  latitude: Float!
  longitude: Float!
  distanceDriven: Float!
  broadcastingDay: String
}

type DevicePromotionModel {
  driverId: String
  teamId:String
  fileName: String
  title: String
  duration: Int
  promotionId: String
  clientId: String,
  clientName: String,
  clientPage: String
}

type GetDevicePromotionsResponse {
  data: [DevicePromotionModel]!
  count: Int
}

type GetAllDevicesResponse {
  data: [DeviceModel]!
  count: Int!
}

input DeviceFilter {
  location: String
  identifier: String
}

 input GetAllDevicesInput {
 pagination: PaginationArguments
 filters: DeviceFilter
 }

type DeviceSubsciptionReturnType {
  deviceId: String,
  groupId: String,
}
 type Subscription {
  deviceStatusChanged(groupId: String!): DeviceSubsciptionReturnType
}

type Query {

  getAllDevices(input: GetAllDevicesInput): GetAllDevicesResponse!
  getAllAvailableDevices(input: GetAllDevicesInput):GetAllDevicesResponse
  getDeviceById(deviceId: String!): DeviceModel
  getDeviceByDeviceUniqueId(identifier: String!): DeviceModel
  getDevicePromotions(deviceId: String!): GetDevicePromotionsResponse
}

type Mutation {
  addNewDevice(input: AddDeviceInput!): DeviceModel
  addDeviceActivity(input: AddDeviceActivityInput!): Boolean
  editDevice(input: EditDeviceInput!): DeviceModel
  deleteDevice(devicesIds: [String!]!): Int
}

`;
