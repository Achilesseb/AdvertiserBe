export const authenticationTypes = `#graphql
type User {
  id: ID!
  email: String!
  # Other user fields...
}

type AuthPayload {
  user: User
  token: String
}

type Mutation {
  loginUser(email: String!, password: String!): AuthPayload
  signUpUser(email: String!, password: String!): AuthPayload
}

`;
