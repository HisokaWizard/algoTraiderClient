import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query';

type RestQuery = 'get' | 'post';

interface RTKQConfig {
  headers: {};
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  url: string;
}

export const axiosQuery: Record<RestQuery, (url: string, body?: any) => RTKQConfig> = {
  get: (url: string) => {
    return {
      headers: {
        'Accept-Content': 'application/json',
      },
      method: 'GET',
      url,
    };
  },
  post: (url: string, body: any) => {
    return {
      headers: {
        'Accept-Content': 'application/json',
      },
      method: 'POST',
      body,
      url,
    };
  },
};

export const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5005/',
});
