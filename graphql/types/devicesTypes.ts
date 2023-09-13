export const devicesTypes = `#graphql


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
  id:String!
  system: String
  location: String
  inUse: Boolean
  driverId: String 
  identifier: String
}

input AddDeviceActivityInput{
  deviceId: String!
  latitude: Float!
  longitude: Float!
  broadcastingDay: String
}

type DevicePromotionModel {
  driverId: String
  teamId:String
  fileName: String
  title: String
  duration: Int
  promotionId: String
}

type GetDevicePromotionsResponse {
  data: [DevicePromotionModel]!
  count: Int
}

type GetAllDevicesResponse {
  data: [DeviceModel]!
  count: Int!
}

 input GetAllDevicesInput {
 pagination: PaginationArguments
 }

type Query {

  getAllDevices(input: GetAllDevicesInput): GetAllDevicesResponse!
  getDeviceById(deviceId: String!): DeviceModel
  getDevicePromotions(deviceId: String!): GetDevicePromotionsResponse
}

type Mutation {
  addNewDevice(input: AddDeviceInput!): DeviceModel
  addDeviceActivity(input: AddDeviceActivityInput!): Boolean
  editDevice(input: EditDeviceInput!): DeviceModel
  deleteDevice(deviceId: String!): Int
}

`;
