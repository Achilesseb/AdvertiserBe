export const usersTypes = `#graphql

    type UserModel {
        id: String,
        name: String,
        address: String,
        registrationPlate: String,
        phone: String,
        team: String,
        email: String,
        carDetails: String,
        tabletId: String,
        city: String
        tablets: Int,
        role: String,

    }

    input AddUserInput {
        name: String!,
        address: String,
        registrationPlate: String,
        phone: String!,
        team: String,
        email: String!,
        carDetails: String,
        tabletId: String,
        city: String!
        tablets: Int,
    }

    input EditUserInput {
        id: String!
        name: String,
        address: String,
        registrationPlate: String,
        phone: String,
        team: String,
        email: String,
        carDetails: String,
        tabletId: String,
        city: String
        tablets: Int,
    }

    type GetAllUsersReponse {
        count: Int,
        data: [UserModel]!
    }

    type Query {
        getAllUsers: GetAllUsersReponse
        getUserById(userId: String): UserModel!
    }
    type Mutation {
        addNewUser(input: AddUserInput!): UserModel
        editUser(input: EditUserInput!): UserModel
        deleteUser(usersIds: [String]!): Int
    }


`;
