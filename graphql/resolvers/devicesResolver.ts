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

export const devicesResolver = {
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

    editDevice: (_: undefined, { input }: { input: EditDeviceModelInput }) =>
      editDevice(input),

    deleteDevice: (_: undefined, { deviceId }: { deviceId: string }) =>
      deleteDevice(deviceId),
  },
};
