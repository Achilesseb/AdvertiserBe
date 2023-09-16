import dayjs from 'dayjs';
import {
  AddDeviceActivityInput,
  AddDeviceModelInput,
  EditDeviceModelInput,
  addDeviceActivity,
  addNewDevice,
  deleteDevice,
  editDevice,
  getAllDevices,
  getDeviceById,
  getDevicePromotions,
} from '../../models/devicesModel';
import supabase from '../../supabase';
import { doesDeviceExists } from '../utils/checkValuesHandlers';
import { generateQueryResultError } from '../utils/errorHandlers';

import { GetAllEntitiesArguments } from '../utils/modifiers';

import { PubSub } from 'graphql-subscriptions';

// Define types for your PubSub instance
interface MyPubSubInstance {
  publish: (triggerName: string, payload: any) => void;
  asyncIterator: (triggers: string | string[]) => AsyncIterator<any>;
  subscribe: (
    triggers: string,
    onMessage: (message: any) => void,
  ) => Promise<number>;
  unsubscribe: (subscriptionId: number) => void;
  // Add any other methods or properties specific to your PubSub instance
}

// Create an instance of your PubSub
const pubsub: MyPubSubInstance = new PubSub();

export const devicesResolver = {
  Subscription: {
    deviceStatusChanged: {
      subscribe: (_parent: unknown, { groupId }: { groupId: string }) => {
        return pubsub?.asyncIterator(['DEVICE_STATUS_CHANGED', groupId]);
      },
      resolve: (
        payload: { groupId: string; deviceStatusChanged: unknown },
        args: { groupId: string },
      ) => {
        if (payload.groupId === args.groupId) {
          return {
            deviceId: payload.deviceStatusChanged,
            groupId: payload.groupId,
          };
        }
        return null;
      },
    },
  },
  Query: {
    getAllDevices: (
      _: unknown,
      { input }: { input: GetAllEntitiesArguments },
    ) => getAllDevices(input ?? {}),
    getDeviceById: (_: undefined, { deviceId }: { deviceId: string }) =>
      getDeviceById(deviceId),

    getDevicePromotions: async (
      _: undefined,
      { deviceId }: { deviceId: string },
    ) => {
      const devicePromotionsByDriver = await getDevicePromotions(deviceId);

      const promotionIdsArray = devicePromotionsByDriver.data.map(
        (obj: Record<string, string | unknown>) => obj.promotionId,
      );

      await supabase.rpc('updateDevicePromosInstances', {
        deviceIdArg: deviceId,
        dateArg: dayjs().format('YYYY-MM-DD'),
        promotionIdsArg: promotionIdsArray,
      });

      return devicePromotionsByDriver;
    },
  },
  Mutation: {
    addNewDevice: (_: undefined, { input }: { input: AddDeviceModelInput }) =>
      addNewDevice(input),

    addDeviceActivity: async (
      _: undefined,
      { input }: { input: AddDeviceActivityInput },
    ) => {
      const deviceExists = await doesDeviceExists(input.deviceId);

      if (!deviceExists)
        return generateQueryResultError({
          messageOverride: 'Device with this id not found',
          statusOverride: 404,
        });

      const result = await addDeviceActivity(input);

      return true;
    },

    editDevice: async (
      _: undefined,
      { input }: { input: EditDeviceModelInput },
    ) => {
      console.log(input);
      const data = await editDevice(input);

      const teamId = data.driver.teamId;
      pubsub.publish('DEVICE_STATUS_CHANGED', {
        deviceStatusChanged: input.id,
        groupId: teamId,
      });
      return data;
    },

    deleteDevice: (_: undefined, { deviceId }: { deviceId: string }) =>
      deleteDevice(deviceId),
  },
};
