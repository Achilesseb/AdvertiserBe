import { UserModel, editUser } from './usersModel';
import {
  generateQueryResultError,
  queryResultHandler,
} from '../graphql/utils/errorHandlers';
import supabase from '../supabase';
import { UserRegistrationInputTypes } from '../graphql/resolvers/authenticationResolver';
import { EditUserInput } from '../graphql/resolvers/usersResolver';

export const confirmUserRegistration = async ({
  email,
  password,
  registrationCode,
}: UserRegistrationInputTypes) => {
  console.log('Started confirming user registration..');
  try {
    const userDataQuery = await supabase
      .from('users')
      .select<string, UserModel>('*')
      .eq('email', email)
      .single();

    const userData = queryResultHandler({ query: userDataQuery }) as UserModel;

    console.log('User found in database..');

    if (userData.registrationCode !== registrationCode)
      return generateQueryResultError({
        messageOverride: 'Invalid registration code',
        statusOverride: 403,
      });

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    console.log(error);
    if (error) throw error;

    editUser({
      userId: userData.id,
      registrationCode: null,
    } as EditUserInput);

    console.log('Supabase signUp successfull..');

    return true;
  } catch (err) {
    return generateQueryResultError({
      messageOverride: `${err}`,
      statusOverride: 401,
    });
  }
};
