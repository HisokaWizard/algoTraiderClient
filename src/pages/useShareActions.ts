import { useCallback, useEffect, useState } from 'react';
import { localStorageTableData, TableType } from '../components';
import { ShareTicker, TickerId } from '../models';
import { useLazyGetSharesByFigiQuery } from '../store/sharesApi';

const { setCountingValuesToTableItem, getSharesTableDataArray, clearSharesTableData } =
  localStorageTableData();
const shareStep = 10;
const shareTimeout = 5000;

export const useShareActions = (
  tickersMapData: Map<TickerId, ShareTicker> | null,
  tickers: ShareTicker[],
) => {
  const [attention, setAttention] = useState(20);
  const [shares, setShares] = useState<TableType[]>([]);
  const [getShareCountingByFigi] = useLazyGetSharesByFigiQuery();
  const [isDelay, setIsDelay] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isJobComplete, setIsJobComplete] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);

  // Specific job to continue getting actual quotations
  useEffect(() => {
    if (!isDelay) return;
    setShares(getSharesTableDataArray());
    const timer = setTimeout(() => {
      setIsDelay(false);
      getShareCounting(currentPosition);
    }, shareTimeout);
    return () => {
      clearTimeout(timer);
    };
  }, [isDelay, currentPosition]);

  useEffect(() => {
    if (!isJobComplete) return;
    setIsJobComplete(false);
    setIsBusy(false);
    const result = getSharesTableDataArray();
    setShares(result);
    window.localStorage.setItem('shares', JSON.stringify(result));
  }, [isJobComplete]);

  // Specific recursive method to get quotations
  const getShareCounting = useCallback(
    async (index: number) => {
      if (index === tickers.length - 1) {
        setCurrentPosition(0);
        setIsDelay(false);
        setIsJobComplete(true);
        return;
      }
      if (index === shareStep + currentPosition) {
        setCurrentPosition(index);
        setIsDelay(true);
        return;
      }
      const ticker = tickers[index];
      const result = await getShareCountingByFigi({
        ticker: ticker.ticker,
        figi: ticker.figi,
        attention,
      });
      if (result?.error) {
        setCurrentPosition(index);
        setIsDelay(true);
        return;
      }
      if (!result?.data) return;
      setCountingValuesToTableItem(result.data);
      index++;
      getShareCounting(index);
    },
    [tickers, attention, currentPosition],
  );

  const updateShareCountingByTicker = useCallback(
    async (ticker: TickerId) => {
      const tickerData = tickersMapData?.get(ticker);
      if (!tickerData) return;
      const result = await getShareCountingByFigi({
        ticker: tickerData.ticker,
        figi: tickerData.figi,
        attention,
      });
      if (result?.error) console.error(result.error);
      if (!result?.data) return;
      setCountingValuesToTableItem(result.data);
      setShares(getSharesTableDataArray());
    },
    [tickersMapData],
  );

  return {
    getShareCounting,
    updateShareCountingByTicker,
    attention,
    setAttention,
    shares,
    isBusy,
    setShares,
    setIsBusy,
    setIsDelay,
    currentPosition,
  };
};
