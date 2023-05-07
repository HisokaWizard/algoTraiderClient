import { useEffect, useMemo, useState } from 'react';
import { localStorageTableData } from '../components';
import { CountryTypeCode, ShareTicker, TickerId } from '../models';
import { useGetAllSharesQuery, useGetTickersByCountryQuery } from '../store/sharesApi';

export const useGetTickersByCountry = (country_code: CountryTypeCode | undefined) => {
  const { data, error: tickersError } = useGetTickersByCountryQuery(
    country_code ?? ('' as CountryTypeCode),
    {
      skip: !country_code,
    },
  );

  const tickersMapData = useMemo(() => {
    if (!data) return null;
    const tickersMap = new Map<TickerId, ShareTicker>();
    data.forEach((it) => {
      tickersMap.set(it.ticker, it);
    });
    return tickersMap;
  }, [data]);

  const tickers = useMemo(() => {
    if (!data) return [];
    return data;
  }, [data]);

  return {
    tickers,
    tickersMapData,
    tickersError,
  };
};

const { addNewRowItem } = localStorageTableData();

export const useGetAllSharesByCountry = (country_code: CountryTypeCode | undefined) => {
  const { data, error: sharesError } = useGetAllSharesQuery(
    country_code ?? ('' as CountryTypeCode),
    {
      skip: !country_code,
    },
  );
  const [readyToSetShares, setReadyToSetShares] = useState(false);

  if (sharesError) {
    console.error(sharesError);
  }

  useEffect(() => {
    if (!data) return;
    data.forEach((it) => {
      addNewRowItem(it);
    });
    setReadyToSetShares(true);
  }, [data]);

  return {
    readyToSetShares,
    setReadyToSetShares,
  };
};
