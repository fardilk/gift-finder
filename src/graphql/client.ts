import { GraphQLClient } from 'graphql-request';

export const graphqlClient = new GraphQLClient(import.meta.env.VITE_GRAPHQL_ENDPOINT || '/graphql', {
  headers: () => ({
    // Example: attach auth token if needed
    // Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
  }),
});
