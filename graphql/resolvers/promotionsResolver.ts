import {
  addNewPromotion,
  deletePromotion,
  editPromotion,
  getAllPromotions,
  getPromotionById,
} from '../../models/adsModel';

export type PromotionInput = {
  title: string;
  description: string;
  url: string;
  fileName: string;
  category?: string;
  duration?: number;
  client: string;
};

export type EditPromotionInput = Omit<PromotionInput, 'fileName' | 'url'> & {
  id: string;
};

export const promotionsResolver = {
  Query: {
    getAllPromotions: async () => getAllPromotions(),
    getPromotionById: async (
      _: undefined,
      { promotionId }: { promotionId: string },
    ) => getPromotionById(promotionId),
  },
  Mutation: {
    addNewPromotion: async (
      _: undefined,
      { input }: { input: PromotionInput },
    ) => addNewPromotion(input),
    editPromotion: async (
      _: undefined,
      { input }: { input: EditPromotionInput },
    ) => editPromotion(input),
    deletePromotion: async (
      _: undefined,
      { promotionIds }: { promotionIds: Array<string> },
    ) => deletePromotion(promotionIds),
  },
};
