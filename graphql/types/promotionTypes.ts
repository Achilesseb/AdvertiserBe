export const promotionTypes = `#graphql
  type PromotionModel   {
        id: String,
        title: String,
        description: String,
        url: String,
        duration: Int,
        category: String,
        fileName: String,
        client: ClientModel
    }

    type PromotionTeamsModel   {
        id: String,
        title: String,
        description: String, 
        fileName: String,
        name: String,
    }

    type GetAllPromotionsReponse {
        count: Int,
        data: [PromotionModel]
    }

    type GetAllTeamsPromotionsReponse {
        count: Int,
        data: [PromotionTeamsModel]
    }
    input AddPromotionInput {
        title: String!,
        description: String,
        fileName: String!,
        category: String,
        duration: Int,
        clientId: String!,
        url: String
    }

    input EditPromotionInput {
        id: String!,
        title: String,
        description: String,
        fileName: String,
        category: String,
        duration: Int,
        url: String
       
    }

    input PromotionsFiltersInput {
        title: String
        clientId: String
    }


    input PromotionsByTeamFiltersInput {
        title: String
        teamId: String
    }

    input GetAllPromotionsInput {
        pagination: PaginationArguments
        filters: PromotionsFiltersInput
    }

    input GetAllPromotionsByTeamInput {
        pagination: PaginationArguments
        filters: PromotionsByTeamFiltersInput
    }

    input AddPromotionToTeamInput {
        promotionId: String!
        teamId: String!
        startingDate: String
    }
    
    type Query {
        getAllPromotions(input: GetAllPromotionsInput): GetAllPromotionsReponse,
        getPromotionById(id: String!): PromotionModel! 
        getPromotionByTeam(input: GetAllPromotionsByTeamInput): GetAllTeamsPromotionsReponse,
    }

    type Mutation {
        addNewPromotion(input: AddPromotionInput): PromotionModel
        addNewPromotionToTeam(input: AddPromotionToTeamInput): PromotionModel
        editPromotion(input: EditPromotionInput): PromotionModel
        deletePromotion(promotionIds: [String]!): Int
    }
`;
