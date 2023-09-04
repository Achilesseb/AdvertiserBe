import {
  AddDeviceModelInput,
  EditDeviceModelInput,
  addNewDevice,
  deleteDevice,
  editDevice,
  getAllDevices,
  getDeviceById,
} from '../../models/devicesModel';
import { createDeviceUserAssociation } from '../utils/associationsHandlers';
import { GetAllEntitiesArguments } from '../utils/modifiers';

export const devicesResolver = {
  Query: {
    getAllDevices: (
      _: unknown,
      { input }: { input: GetAllEntitiesArguments },
    ) => getAllDevices(input ?? {}),
    getDeviceById: (_: undefined, { deviceId }: { deviceId: string }) =>
      getDeviceById(deviceId),
  },
  Mutation: {
    addNewDevice: async (
      _: undefined,
      { input }: { input: AddDeviceModelInput },
    ) => {
      const { driverId } = input ?? {};
      const deviceData = await addNewDevice(input);

      if (driverId) {
        await createDeviceUserAssociation(driverId, deviceData.id);
      }

      return deviceData;
    },
    editTablet: async (
      _: undefined,
      { input }: { input: EditDeviceModelInput },
    ) => {
      const { driverId } = input ?? {};
      const deviceData = await editDevice(input);

      if (driverId) {
        await createDeviceUserAssociation(driverId, deviceData.id);
      }
      return deviceData;
    },
    deleteTablet: (_: undefined, { deviceId }: { deviceId: string }) =>
      deleteDevice(deviceId),
  },
};
