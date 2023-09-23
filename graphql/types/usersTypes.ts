export const usersTypes = `#graphql

    type UserModel {
        id: String,
        name: String,
        address: String,
        registrationPlate: String,
        phone: String,
        teamName: String,
        email: String,
        car: String,
        deviceId: String,
        city: String
        tablets: Int,
        role: String,
        createdAt: String
    
    }

    input AddUserInput {
        name: String!,
        address: String,
        registrationPlate: String,
        phone: String!,
        teamId: String,
        email: String!,
        car: String,
        deviceId: String,
        city: String!
   
    }

    input EditUserInput {
        userId: String!
        name: String,
        address: String,
        registrationPlate: String,
        phone: String,
        teamId: String,
        email: String,
        car: String,
        deviceId: String,
        city: String
     
    }

    type GetAllUsersReponse {
        count: Int,
        data: [UserModel]!
    }
    input UsersFilters {
        name: String
        city: String
    }

    input GetAllUsersInput {
    pagination: PaginationArguments
    filters: UsersFilters
}

    type UserAndDeviceResultTypes {
        name: String
        phone: String
        email: String
        city: String
        role: String
        address: String
        car: String
        registrationPlate: String
        driverId: String
        device: DeviceSimpleModel
        team: TeamModel
    }
    type DeleteUsersFromTeamsResponse {
        count: Int
    }
    type Query {
        getAllUsers(input: GetAllUsersInput): GetAllUsersReponse
        getAllAvailableUsers(input: GetAllUsersInput): GetAllUsersReponse
        getAllUnTeamedUsers(input: GetAllUsersInput): GetAllUsersReponse
        getUserById(userId: String): UserAndDeviceResultTypes
        getUserByEmail(userEmail: String): UserModel!
    }
    type Mutation {
        addNewUser(input: AddUserInput!): UserAndDeviceResultTypes
        editUser(input: EditUserInput!): UserAndDeviceResultTypes
        deleteUserFromTeam(usersIds: [String]!): DeleteUsersFromTeamsResponse
        deleteUser(usersIds: [String]!): Int
    }


`;
