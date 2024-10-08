import { PaginationArguments } from './../utils/modifiers';
export const teamsTypes = `#graphql
type TeamModel {
    id: String,
    city: String,
    name: String
    createdAt: String,
}
type TeamModelView {
    id: String,
    city: String,
    teamName: String
    createdAt: String,
    totalDrivers:Int,
    drivers: String,
    totalPromotions: Int,
    totalDuration: Int
}

input GetTeamDriversFilters {
    teamId: String!,
}

input GetAllEntitiesArguments {
    pagination: PaginationArguments,
    filters: GetTeamDriversFilters!
}

type GetAllTeamsResponse {
  count: Int
  data: [TeamModelView]!
}

type GetTeamDriversResponse {
    data: [UserModel]!,
    count:Int
}

input AddTeamInput {
  name: String
  city: String
}

input EditTeamInput {
  id: String!
  name: String
  city: String
}

input GetAllTeamFiltersInput { 
  teamName: String
}

input GetAllTeamTypesInput { 
  pagination: PaginationArguments
  filters: GetAllTeamFiltersInput 
}

type Query {
  getAllTeams(input: GetAllTeamTypesInput): GetAllTeamsResponse
  getTeamById(id: String!): TeamModelView!
  getTeamDrivers(input:GetAllEntitiesArguments!): GetTeamDriversResponse
}

type Mutation {
  addNewTeam(input: AddTeamInput): TeamModel
  editTeam(input: EditTeamInput): TeamModel
  deleteTeam(teamIds: [String]!): Int
}

`;
