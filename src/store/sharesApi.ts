import { createApi } from '@reduxjs/toolkit/query/react';
import { CountryTypeCode, ShareItem, ShareQoutation, ShareTicker, TickerId } from '../models';
import { baseQuery } from '../utils';

export const sharesApi = createApi({
  reducerPath: 'sharesApi',
  baseQuery,
  endpoints: (builder) => ({
    getSharesByFigi: builder.query<
      ShareQoutation,
      { ticker: TickerId; figi: string; attention: number }
    >({
      query: (args) => {
        const { ticker, figi, attention } = args;
        return {
          url: '/shares_by_tickers',
          method: 'GET',
          params: {
            ticker,
            figi,
            attention,
          },
        };
      },
    }),
    getAllShares: builder.query<ShareItem[], CountryTypeCode>({
      query: (country_code) => {
        return {
          method: 'GET',
          url: '/shares',
          params: {
            country_code,
          },
        };
      },
    }),
    getTickersByCountry: builder.query<ShareTicker[], CountryTypeCode>({
      query: (country_code) => {
        return {
          method: 'GET',
          url: '/share_tickers',
          params: {
            country_code,
          },
        };
      },
    }),
  }),
});

export const {
  useGetAllSharesQuery,
  useLazyGetAllSharesQuery,
  useLazyGetSharesByFigiQuery,
  useGetTickersByCountryQuery,
} = sharesApi;
