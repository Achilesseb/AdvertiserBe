import admin from 'firebase-admin';

import { Ads } from './usersModel';
import {
  EditPromotionInput,
  PromotionInput,
} from '../graphql/resolvers/adsResolver';
import { db } from '..';

export const getAllPromotions = async () => {
  try {
    const adsSnapshot = await db.collection('ads').get();

    const ads: Ads[] = [];
    adsSnapshot.forEach(doc => {
      ads.push({
        ...(doc.data() as Ads),
        id: doc.id,
      });
    });
    console.log(ads);
    return {
      data: ads,
      count: ads.length,
    };
  } catch (error) {
    console.log(error);
  }
};

export const getPromotionById = async (promotionId: string) => {
  try {
    const promotionSnapshot = await db.collection('ads').doc(promotionId).get();

    const promotionData = promotionSnapshot.data();

    return {
      ...promotionData,
      id: promotionSnapshot.id,
    };
  } catch (error) {
    console.log(error);
  }
};

export const addNewPromotion = async (input: PromotionInput) => {
  try {
    const promotionSnapshot = await (
      await db.collection('ads').add(input)
    ).get();

    const promotionData = promotionSnapshot.data();

    return {
      ...promotionData,
      id: promotionSnapshot.id,
    };
  } catch (error) {
    console.log(error);
  }
};

export const editPromotion = async (input: EditPromotionInput) => {
  try {
    const { id } = input;
    await db.collection('ads').doc(id).update(input);
    return true;
  } catch (error) {
    console.log(error);
  }
};

export const deletePromotion = async (promotionId: string) => {
  try {
    await db.collection('ads').doc(promotionId).delete();
    return true;
  } catch (error) {
    console.log(error);
  }
};
