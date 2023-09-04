import { GetAllEntitiesArguments } from './../utils/modifiers';

import {
  getAllTeams,
  getTeamById,
  addNewTeam,
  editTeam,
  deleteTeam,
  getTeamDrivers,
} from '../../models/teamsModel';

export type TeamInput = {
  city: string;
  name: string;
};

export type EditTeamInput = {
  id: string;
  city?: string;
  name?: string;
};

export const teamsResolver = {
  Query: {
    getAllTeams: (_: unknown, { input }: { input: GetAllEntitiesArguments }) =>
      getAllTeams(input ?? {}),
    getTeamById: (_: undefined, { teamId }: { teamId: string }) =>
      getTeamById(teamId),
    getTeamDrivers: (
      _: unknown,
      { input }: { input: GetAllEntitiesArguments },
    ) => getTeamDrivers(input),
  },
  Mutation: {
    addNewTeam: (_: undefined, { input }: { input: TeamInput }) =>
      addNewTeam(input),
    editTeam: (_: undefined, { input }: { input: EditTeamInput }) =>
      editTeam(input),
    deleteTeam: (_: undefined, { teamIds }: { teamIds: Array<string> }) =>
      deleteTeam(teamIds),
  },
};
