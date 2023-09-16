import { UserModel } from './usersModel';
import {
  generateQueryResultError,
  queryResultHandler,
} from '../graphql/utils/errorHandlers';
import supabase from '../supabase';
import { UserRegistrationInputTypes } from '../graphql/resolvers/authenticationResolver';

export const confirmUserRegistration = async ({
  email,
  password,
  registrationCode,
}: UserRegistrationInputTypes) => {
  try {
    const userDataQuery = await supabase
      .from('users')
      .select<string, UserModel>('*')
      .eq('email', email)
      .single();

    const userData = queryResultHandler({ query: userDataQuery }) as UserModel;

    if (userData.registrationCode !== registrationCode)
      return generateQueryResultError({
        messageOverride: 'Invalid registration code',
        statusOverride: 403,
      });

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) throw error;

    return true;
  } catch (err) {
    return generateQueryResultError({
      messageOverride: `${err}`,
      statusOverride: 401,
    });
  }
};
