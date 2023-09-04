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
    addNewDevice: (_: undefined, { input }: { input: AddDeviceModelInput }) =>
      addNewDevice(input),

    editDevice: (_: undefined, { input }: { input: EditDeviceModelInput }) =>
      editDevice(input),

    deleteDevice: (_: undefined, { deviceId }: { deviceId: string }) =>
      deleteDevice(deviceId),
  },
};
