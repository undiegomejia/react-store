import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';

// Base API setup with authentication
export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: '/api', // We'll mock this with MSW later
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: ['Product', 'User', 'Order', 'Review', 'Cart'],
});