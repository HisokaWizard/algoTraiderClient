import { createApi } from '@reduxjs/toolkit/query/react';
import { ShareItem } from '../models';
import { CountryTypeCode } from '../models/Counties';
import { axiosQuery, baseQuery } from '../utils';

export const sharesApi = createApi({
  reducerPath: 'sharesApi',
  baseQuery,
  endpoints: (builder) => ({
    getSharesByTickers: builder.mutation<
      ShareItem[],
      { codes: string[]; attention: number; country_code: CountryTypeCode }
    >({
      query: (args) => {
        const { codes, attention, country_code } = args;
        return {
          url: '/shares_by_tickers',
          method: 'POST',
          params: {
            country_code,
            attention,
          },
          body: codes,
        };
      },
    }),
    getAllShares: builder.query<ShareItem[], CountryTypeCode>({
      query: (arg) => {
        const country_code = arg;
        return {
          method: 'GET',
          url: '/shares',
          params: {
            country_code,
          },
        };
      },
    }),
  }),
});

export const { useGetAllSharesQuery, useLazyGetAllSharesQuery, useGetSharesByTickersMutation } =
  sharesApi;
