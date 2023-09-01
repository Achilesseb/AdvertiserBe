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

    type GetAllPromotionsReponse {
        count: Int,
        data: [PromotionModel]
    }

    input AddPromotionInput {
        title: String!,
        description: String!,
        fileName: String!,
        category: String,
        duration: Int,
        clientId: String!
    }

    input EditPromotionInput {
        id: String!,
        title: String,
        description: String,
        category: String,
        duration: Int,
        clientId: String
    }
    type Query {
        getAllPromotions: GetAllPromotionsReponse,
        getPromotionById(promotionId: String!): PromotionModel! 
    }

    type Mutation {
        addNewPromotion(input: AddPromotionInput): PromotionModel
        editPromotion(input: EditPromotionInput): PromotionModel
        deletePromotion(promotionIds: [String]!): Int
    }
`;
