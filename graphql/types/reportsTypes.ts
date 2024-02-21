export const reportsTypes = `#graphql

    # ///////////////////////////////////////////////////////////////////////////
    # Base types
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

    type DriversReportTypes {
        id: String
        totalDistance: Int
        driverName: String
        fleet: String
        car: String
        trips: Int
    }

    type UniqueDriverReportTypes {
        id: String
        totalDistance: Int
        driverName: String
        fleet: String
        car: String
        trips: Int
        day: String
    }

    # ///////////////////////////////////////////////////////////////////////////
    # Filters types

    input GetClientReportTypesFilters {
        startDate: String
        endDate: String
        name: String
    }

    input GetClientPromotionsTypesFilters {
        startDate: String
        endDate: String
        title: String
        clientId: String!
    }

    input GetDriversReportTypesFilters {
        startDate: String
        endDate: String
        driverName: String
    }

    input GetUniqueDriverReportTypesFilters {
        startDate: String
        endDate: String
        driverId: String!
    }

    # ///////////////////////////////////////////////////////////////////////////
    # INPUTS types

    input GetClientReportsTypeInput {
        pagination: PaginationArguments
        filters: GetClientReportTypesFilters
    }

    input GetClientPromotionsTypeInput {
        pagination: PaginationArguments
        filters: GetClientPromotionsTypesFilters!
    }

    input GetDriversReportsTypeInput {
        pagination: PaginationArguments
        filters: GetDriversReportTypesFilters
    }

    input GetUniqueDriverReportsTypeInput {
        pagination: PaginationArguments
        filters: GetUniqueDriverReportTypesFilters
    }

    # ///////////////////////////////////////////////////////////////////////////
    # Response types
    type DriversReportsTypeResponse {
        data: [DriversReportTypes]
        count:Int
    }

    type ClientPromotionsTypeResponse {
        data: [PromotionsReportTypes]
        count:Int
    }

    type ClientReportsTypeResponse {
        data: [ClientsReportsTypes]
        count:Int
    }

    type UniqueDriverReportsTypeResponse {
        data: [UniqueDriverReportTypes]
        count:Int
    }

    # ///////////////////////////////////////////////////////////////////////////
    # QUERIES
    type Query {
        getClientReports(input: GetClientReportsTypeInput): ClientReportsTypeResponse 
        getPromotionsReports(input: GetClientPromotionsTypeInput!): ClientPromotionsTypeResponse 
        getDriversReports(input: GetDriversReportsTypeInput): DriversReportsTypeResponse 
        getUniqueDriverReports(input: GetUniqueDriverReportsTypeInput): UniqueDriverReportsTypeResponse
    }   
`;
