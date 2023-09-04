import {
  addNewPromotion,
  deletePromotion,
  editPromotion,
  getAllPromotions,
  getPromotionById,
} from '../../models/promotionsModel';
import { createPromotionsClientAssociation } from '../utils/associationsHandlers';
import { GetAllEntitiesArguments } from '../utils/modifiers';

export type PromotionInput = {
  title: string;
  description: string;
  fileName: string;
  category?: string;
  duration?: number;
  clientId: string;
};

export type EditPromotionInput = Omit<
  PromotionInput,
  'fileName' | 'url' | 'clientId'
> & {
  id: string;
};

export const promotionsResolver = {
  Query: {
    getAllPromotions: (
      _: unknown,
      { input }: { input: GetAllEntitiesArguments },
    ) => getAllPromotions(input ?? {}),
    getPromotionById: (
      _: undefined,
      { promotionId }: { promotionId: string },
    ) => getPromotionById(promotionId),
  },
  Mutation: {
    addNewPromotion: async (
      _: undefined,
      { input }: { input: PromotionInput },
    ) => {
      const { clientId } = input;
      const promotionData = await addNewPromotion(input);

      await createPromotionsClientAssociation(clientId, promotionData.id);

      return promotionData;
    },
    editPromotion: (_: undefined, { input }: { input: EditPromotionInput }) =>
      editPromotion(input),
    deletePromotion: (
      _: undefined,
      { promotionIds }: { promotionIds: Array<string> },
    ) => deletePromotion(promotionIds),
  },
};
