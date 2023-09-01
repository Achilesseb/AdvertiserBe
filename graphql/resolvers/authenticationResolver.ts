import supabase from '../../supabase';

export const authenticationRespolver = {
  Mutation: {
    loginUser: async (
      _: unknown,
      { email, password }: { email: string; password: string },
    ) => {
      try {
        const response: any = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        console.log(response.error);
        if (response.error) {
          throw new Error('Invalid credentials');
        }
        const user = response.data.user;
        const token = response.data.session?.access_token;
        console.log(response.data);
        // Return user and token in the AuthPayload
        return {
          user: {
            id: user.id,
            email: user.email,
            // Other user fields...
          },
          token,
        };
      } catch (error) {
        throw new Error('Login failed');
      }
    },

    signUpUser: async (
      _: unknown,
      { email, password }: { email: string; password: string },
    ) => {
      try {
        const { user, error }: any = await supabase.auth.signUp({
          email,
          password,
        });
        console.log(error);
        if (error) {
          throw new Error('Sign-up failed');
        }

        // Return user and token in the AuthPayload
        return {
          user: {
            id: user.id,
            email: user.email,
            // Other user fields...
          },
          token: user.access_token,
        };
      } catch (error) {
        throw new Error('Sign-up failed');
      }
    },
  },
};
