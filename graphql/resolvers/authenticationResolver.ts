import { PostgrestError, UserMetadata } from '@supabase/supabase-js';
import {
  ERROR_LOGIN_FAILED,
  ERROR_SIGNUP_FAILED,
} from '../../constants/queryErrorMessages';
import supabase from '../../supabase';
import { generateQueryResultError } from '../utils/errorHandlers';

export const authenticationRespolver = {
  Mutation: {
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
        const response = await supabase.auth.signUp({
          email,
          password,
        });
        if (response.error) {
          return generateQueryResultError({
            messageOverride: ERROR_SIGNUP_FAILED,
            error: response.error as unknown as PostgrestError,
            statusOverride: 409,
          });
        }
        const { user }: UserMetadata = response;
        return {
          user: {
            id: user.id,
            email: user.email,
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
