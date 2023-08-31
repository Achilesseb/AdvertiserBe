import { GraphQLError } from 'graphql';

type PostgrestResponseBase = {
  status: number;
  statusText: string;
};
type PostgrestError = {
  message: string;
  details: string;
  hint: string;
  code: string;
};
type PostgrestResponseSuccess<T> = PostgrestResponseBase & {
  error: null;
  data: T[];
  count: number | null;
};
type PostgrestResponseFailure = PostgrestResponseBase & {
  error: PostgrestError;
  data: null;
  count: null;
};
type PostgrestSingleResponseSuccess<T> = PostgrestResponseBase & {
  error: null;
  data: T;
  count: number | null;
};

export type QueryResponse<T> =
  | PostgrestResponseSuccess<T>
  | PostgrestSingleResponseSuccess<T>
  | PostgrestResponseFailure;

export type DataBaseResultHandle<T> = {
  query: QueryResponse<T>;
  status?: number;
  messageOverride?: string;
};

export const queryResultHandler = <T>({
  query,
  status = 500,
  messageOverride,
}: DataBaseResultHandle<T>) => {
  const { error, data } = query;
  if (error) {
    throw new GraphQLError(messageOverride ?? error?.message ?? '', {
      extensions: {
        code: undefined,
        http: {
          status: status,
        },
      },
    });
  }
  return data;
};
