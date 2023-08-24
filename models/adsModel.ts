import admin from 'firebase-admin';
import { catchAsync } from '../utils/catchAsync';
import { Ads } from './usersModel';

export const getAds = catchAsync(
  async (
    req: any,
    res: {
      json: (arg0: Ads[]) => void;
      status: (arg0: number) => {
        (): any;
        new (): any;
        json: { (arg0: { error: string }): void; new (): any };
      };
    },
  ) => {
    try {
      const db = admin.firestore();

      const adsSnapshot = await db.collection('ads').get();

      const ads: Ads[] = [];
      adsSnapshot.forEach(doc => {
        ads.push(doc.data() as Ads);
      });

      res.json(ads);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve ads' });
    }
  },
);
