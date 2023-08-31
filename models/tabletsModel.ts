// import admin from 'firebase-admin';
// import getSignedUrl from 'firebase-admin/storage';
// import { catchAsync } from '../utils/catchAsync';
// import _ from 'lodash';
// import { genereateSignedUrl } from '..';

// export type Ads = {
//   id: string;
//   uri: string;
//   poster: string;
// };
// export type User = {
//   id: string;
//   Address: string;
//   Car: string;
//   City: string;
//   Name: string;
//   Phone: number;
//   Team: string;
//   Email: string;
//   createAt: string;
// };

// export const getTablets = catchAsync(
//   async (
//     req: any,
//     res: {
//       json: (arg0: User[]) => void;
//       status: (arg0: number) => {
//         (): any;
//         new (): any;
//         json: { (arg0: { error: string }): void; new (): any };
//       };
//     },
//   ) => {
//     try {
//       const db = admin.firestore();

//       const tabletsActivitySnapshot = await db
//         .collection('tabletActivity')
//         .get();

//       const tablets: User[] = [];
//       const tabletsActivity: any[] = [];
//       for (const doc of tabletsActivitySnapshot.docs) {
//         const tabletActivity = doc.data();

//         // Resolve references to actual documents
//         const currentlyPlayingRef = tabletActivity.currentlyPlaying;
//         const driverRef = tabletActivity.driver;
//         const adGroupRef = tabletActivity.adGroup;

//         const [currentlyPlayingDoc, driverDoc, adGroupDoc] = await Promise.all([
//           currentlyPlayingRef.get(),
//           driverRef.get(),
//           adGroupRef.get(),
//         ]);

//         tabletActivity.currentlyPlaying = currentlyPlayingDoc.data();
//         tabletActivity.driver = driverDoc.data();
//         tabletActivity.adGroup = adGroupDoc.data();

//         // Resolve references in the adGroup's ads array
//         const adGroupAdsRefs = tabletActivity.adGroup.ads;
//         const adGroupAds: any[] = [];
//         for (const adRef of adGroupAdsRefs) {
//           const adDoc = await adRef.get();
//           adGroupAds.push(adDoc.data());
//         }
//         tabletActivity.adGroup.ads = adGroupAds;

//         tabletsActivity.push(tabletActivity);
//       }

//       res.json(tabletsActivity);
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to retrieve tablets' });
//     }
//   },
// );

// export const addTablets = catchAsync(
//   async (
//     req: { body: any },
//     res: {
//       status: (arg0: number) => {
//         (): any;
//         new (): any;
//         json: {
//           (arg0: { message?: string; error?: string }): void;
//           new (): any;
//         };
//       };
//     },
//   ) => {
//     try {
//       const db = admin.firestore();

//       const tabletsArray = req.body;

//       if (!tabletsArray || _.isEmpty(tabletsArray)) return;
//       await Promise.all(
//         tabletsArray.map(async (tabletsData: any) => {
//           const newData = {
//             Address: tabletsData.Address,
//             Car: tabletsData.Car,
//             City: tabletsData.City,
//             Email: tabletsData.Email,
//             Name: tabletsData.Name,
//             Phone: tabletsData.Phone,
//             Team: tabletsData.Team,
//             createAt: new Date(tabletsData.createAt), // Assuming date is passed as string
//             id: tabletsData.id,
//           };

//           await db.collection('tabletActivity').add(newData);
//         }),
//       );

//       res.status(201).json({ message: 'Tablets data inserted successfully' });
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to insert tablets data' });
//     }
//   },
// );

// export const getTabletActivity = catchAsync(
//   async (
//     req: any,
//     res: {
//       json: (arg0: User[]) => void;
//       status: (arg0: number) => {
//         (): any;
//         new (): any;
//         json: { (arg0: { error: string }): void; new (): any };
//       };
//     },
//   ) => {
//     try {
//       const db = admin.firestore();

//       const tabletsActivitySnapshot = await db
//         .collection('tabletActivity')
//         .get();

//       const tablets: User[] = [];
//       const tabletsActivity: any[] = [];
//       for (const doc of tabletsActivitySnapshot.docs) {
//         const tabletActivity = doc.data();

//         // Resolve references to actual documents
//         const currentlyPlayingRef = tabletActivity.currentlyPlaying;
//         const driverRef = tabletActivity.driver;
//         const adGroupRef = tabletActivity.adGroup;

//         const [currentlyPlayingDoc, driverDoc, adGroupDoc] = await Promise.all([
//           currentlyPlayingRef.get(),
//           driverRef.get(),
//           adGroupRef.get(),
//         ]);

//         tabletActivity.currentlyPlaying = currentlyPlayingDoc.data();
//         tabletActivity.driver = driverDoc.data();
//         tabletActivity.adGroup = adGroupDoc.data();

//         // Resolve references in the adGroup's ads array
//         const adGroupAdsRefs = tabletActivity.adGroup.ads;
//         const adGroupAds = await Promise.all(
//           adGroupAdsRefs.map(async (adRef: any) => {
//             const adDoc = await adRef.get();
//             const adData = adDoc.data();
//             const signedUrl = await genereateSignedUrl(adData.fileName);
//             return { ...adData, signedUrl };
//           }),
//         );
//         tabletActivity.adGroup.ads = adGroupAds;

//         tabletsActivity.push(tabletActivity);
//       }

//       res.json(tabletsActivity);
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ error: 'Failed to retrieve tablets' });
//     }
//   },
// );
