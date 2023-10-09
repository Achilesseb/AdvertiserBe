export const deviationTypes = `#graphql
    type Constant {
        id: String
        constant: String
        identifier: String
        inUse: Boolean
    }

    input EditConstant {
        id: String!
        constant: String
        identifier: String
        inUse: Boolean
    }

    input AddConstant {
        constant: String!
        identifier: String!
        inUse: Boolean
    }

    type DeviationConstantsResponse {
        data: [Constant]
        count:Int
    }

    type Query {
        getConstant(id:String!): Constant
        getAllConstants(pagination: PaginationArguments):  DeviationConstantsResponse
    }

    type Mutation {
        editConstant(input: EditConstant): Constant
        addNewConstant(input: AddConstant): Constant
        deleteConstants(constantsIds: [String!]!): Int
    }
`;
