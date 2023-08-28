export const adsTypes = `#graphql
  type PromotionModel   {
        id: String,
        title: String,
        description: String,
        url: String,
        client: String,
        duration: Int,
        category: String,
        fileName: String,
    }

    type GetAllPromotionsReponse {
        count: Int,
        data: [PromotionModel]
    }

    input AddPromotionInput {
        title: String!,
        description: String!,
        url: String!,
        fileName: String!,
        category: String,
        duration: Int,
        client: String!
    }

    input EditMutationInput {
        id: String!,
        title: String,
        description: String,
        category: String,
        duration: Int,
        client: String
    }
    type Query {
        getAllPromotions: GetAllPromotionsReponse,
        getPromotionById(promotionId: String): PromotionModel! 
    }

    type Mutation {
        addNewPromotion(input: AddPromotionInput): PromotionModel!
        editPromotion(input: EditMutationInput): Boolean!
    }
`;
