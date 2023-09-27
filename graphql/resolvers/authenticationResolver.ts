import { PostgrestError, UserMetadata } from '@supabase/supabase-js';
import {
  ERROR_LOGIN_FAILED,
  ERROR_SIGNUP_FAILED,
} from '../../constants/queryErrorMessages';
import supabase from '../../supabase';
import { generateQueryResultError } from '../utils/errorHandlers';
import { confirmUserRegistration } from '../../models/authenticationModel';

export const authenticationRespolver = {
  Mutation: {
    confirmUserRegistration: (
      _: unknown,
      { input }: { input: UserRegistrationInputTypes },
    ) => confirmUserRegistration(input),
    loginUser: async (
      _: unknown,
      { email, password }: { email: string; password: string },
    ) => {
      try {
        const response = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (response.error) {
          return generateQueryResultError({
            messageOverride: ERROR_LOGIN_FAILED,
            error: response.error as unknown as PostgrestError,
            statusOverride: 401,
          });
        }
        const user = response.data.user;
        const token = response.data.session?.access_token;

        return {
          user: {
            id: user.id,
            email: user.email,
          },
          token,
        };
      } catch (error) {
        return generateQueryResultError({
          messageOverride: ERROR_LOGIN_FAILED,
          error: error as unknown as PostgrestError,
          statusOverride: 401,
        });
      }
    },

    signUpUser: async (
      _: unknown,
      { email, password }: { email: string; password: string },
    ) => {
      try {
        const { data, error } = await supabase.auth.admin.createUser({
          email,
          password,
          user_metadata: { role: 'admin' },
          email_confirm: true,
        });
        if (error) {
          return generateQueryResultError({
            messageOverride: ERROR_SIGNUP_FAILED,
            error: error as unknown as PostgrestError,
            statusOverride: 409,
          });
        }

        const { user }: UserMetadata = data;

        return {
          user: {
            ...user,
            role: user.user_metadata.role.role,
          },
        };
      } catch (error) {
        return generateQueryResultError({
          messageOverride: ERROR_SIGNUP_FAILED,
          error: error as unknown as PostgrestError,
          statusOverride: 409,
        });
      }
    },
  },
};
export type UserRegistrationInputTypes = {
  email: string;
  password: string;
  registrationCode: number;
};
