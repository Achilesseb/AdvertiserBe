export const authenticationTypes = `#graphql
type User {
  id: ID!
  email: String!

}

type AuthPayload {
  user: User
  token: String
}
input UserRegistrationInput {
  email: String!
  password: String!
  registrationCode: String!
}

type Mutation {
  loginUser(email: String!, password: String!): AuthPayload
  signUpUser(email: String!, password: String!): AuthPayload
  confirmUserRegistration(input: UserRegistrationInput!): Boolean
}

`;
