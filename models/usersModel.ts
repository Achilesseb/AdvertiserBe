import admin from 'firebase-admin';
import { catchAsync } from '../utils/catchAsync';
import _ from 'lodash';

export type Ads = {
  id: string;
  uri: string;
  poster: string;
};
export type User = {
  id: string;
  Address: string;
  Car: string;
  City: string;
  Name: string;
  Phone: number;
  Team: string;
  Email: string;
  createAt: string;
};

export const getUsers = catchAsync(
  async (
    req: any,
    res: {
      json: (arg0: User[]) => void;
      status: (arg0: number) => {
        (): any;
        new (): any;
        json: { (arg0: { error: string }): void; new (): any };
      };
    },
  ) => {
    try {
      const db = admin.firestore();

      const usersSnapshot = await db.collection('users').get();

      const users: User[] = [];
      usersSnapshot.forEach(doc => {
        users.push(doc.data() as User);
      });

      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve users' });
    }
  },
);

export const addUsers = catchAsync(
  async (
    req: { body: any },
    res: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        json: {
          (arg0: { message?: string; error?: string }): void;
          new (): any;
        };
      };
    },
  ) => {
    try {
      const db = admin.firestore();

      const userArray = req.body;

      if (!userArray || _.isEmpty(userArray)) return;
      await Promise.all(
        userArray.map(async (userData: User) => {
          const newData = {
            Address: userData.Address,
            Car: userData.Car,
            City: userData.City,
            Email: userData.Email,
            Name: userData.Name,
            Phone: userData.Phone,
            Team: userData.Team,
            createAt: new Date(userData.createAt), // Assuming date is passed as string
            id: userData.id,
          };

          await db.collection('users').add(newData);
        }),
      );

      res.status(201).json({ message: 'User data inserted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to insert user data' });
    }
  },
);
