module.exports = {
  api: {
    input: {
      target: 'http://localhost:3000/api-json',
    },
    output: {
      mode: 'tags-split',
      target: './src/app/api/generated',
      schemas: './src/interfaces/api',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/app/api/client.ts',
          name: 'apiClient',
        },
        query: {
          useQuery: true,
          useInfinite: true,
          useInfiniteQueryParam: 'page',
        },
      },
    },
  },
}; 