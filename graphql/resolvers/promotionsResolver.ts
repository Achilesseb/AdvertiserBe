import {
  EditPromotionInput,
  PromotionInput,
  TeamsPromotionsInput,
  addNewPromotion,
  addNewPromotionToTeam,
  deletePromoFromTeam,
  deletePromotion,
  editPromotion,
  getAllPromotions,
  getPromotionById,
  getPromotionByTeam,
} from '../../models/promotionsModel';
import { createPromotionsClientAssociation } from '../utils/associationsHandlers';
import { GetAllEntitiesArguments } from '../utils/modifiers';

export const promotionsResolver = {
  Query: {
    getAllPromotions: (
      _: unknown,
      { input }: { input: GetAllEntitiesArguments },
    ) => getAllPromotions(input ?? {}),
    getPromotionById: (_: undefined, { id }: { id: string }) =>
      getPromotionById(id),
    getPromotionByTeam: (
      _: unknown,
      { input }: { input: GetAllEntitiesArguments },
    ) => getPromotionByTeam(input ?? {}),
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
    addNewPromotionToTeam: async (
      _: undefined,
      { input }: { input: TeamsPromotionsInput },
    ) => addNewPromotionToTeam(input),
    editPromotion: (_: undefined, { input }: { input: EditPromotionInput }) =>
      editPromotion(input),
    deletePromotion: (
      _: undefined,
      { promotionIds }: { promotionIds: Array<string> },
    ) => deletePromotion(promotionIds),
    deletePromotionsFromTeam: (
      _: undefined,
      { input }: { input: { promotionIds: Array<string>; teamId: string } },
    ) => {
      const { promotionIds, teamId } = input;
      deletePromoFromTeam(promotionIds, teamId);
    },
  },
};
