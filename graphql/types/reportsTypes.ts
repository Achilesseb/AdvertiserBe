export const reportsTypes = `#graphql
    type ClientsReportsTypes {
        id: String
        name: String
        promotionNumber: Int
        tripsNumber: Int
        totalKilometers: Int
    }
   type PromotionsReportTypes {
        promotionsId: String
        totalDistance: Int
        clientId: String
        title: String
        name:String
        trips: Int
    }

    type ClientReportsTypeResponse {
        data: [ClientsReportsTypes]
        count:Int
    }

    input GetClientReportTypesFilters {
        startDate: String
        endDate: String
        name: String
    }

    input GetClientReportsTypeInput {
        pagination: PaginationArguments
        filters: GetClientReportTypesFilters
    }


    type ClientPromotionsTypeResponse {
        data: [PromotionsReportTypes]
        count:Int
    }

    input GetClientPromotionsTypesFilters {
        startDate: String
        endDate: String
        title: String
        clientId: String!
    }

    input GetClientPromotionsTypeInput {
        pagination: PaginationArguments
        filters: GetClientPromotionsTypesFilters!
    }

    type Query {
        getClientReports(input: GetClientReportsTypeInput): ClientReportsTypeResponse 
        getPromotionsReports(input: GetClientPromotionsTypeInput!): ClientPromotionsTypeResponse 
    }

   
`;
