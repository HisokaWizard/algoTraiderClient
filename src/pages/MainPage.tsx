import {
  Grid,
  IconButton,
  SelectChangeEvent,
  TextField,
  Typography,
  useTheme,
  Box,
} from '@mui/material';
import UpdateIcon from '@mui/icons-material/Update';
import React, { ChangeEvent, memo, useCallback, useEffect, useState } from 'react';
import { localStorageTableData, Select, tableColumns, TableType } from '../components';
import { countriesDictionary, CountryTypeCode, TickerId } from '../models';
import { TableShares } from '../components/Table';
import { useGetAllSharesByCountry, useGetTickersByCountry } from './useGetMetaData';
import { useLazyGetSharesByFigiQuery } from '../store/sharesApi';

const { setCountingValuesToTableItem, getSharesTableDataArray, clearSharesTableData } =
  localStorageTableData();
const shareStep = 10;
const shareTimeout = 5000;

export const MainPage = memo(() => {
  const [country, setCountry] = useState<CountryTypeCode>('RU');
  const { tickers, tickersMapData } = useGetTickersByCountry(country);
  const [attention, setAttention] = useState(20);
  const [shares, setShares] = useState<TableType[]>([]);
  const { readyToSetShares } = useGetAllSharesByCountry(country);
  const [getShareCountingByFigi] = useLazyGetSharesByFigiQuery();
  const [isDelay, setIsDelay] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isJobComplete, setIsJobComplete] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    if (!readyToSetShares) return;
    setShares(getSharesTableDataArray());
  }, [readyToSetShares]);

  const changeAttention = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!event.target.value) return;
      setAttention(+event.target.value);
    },
    [],
  );

  const changeCountry = useCallback((event: SelectChangeEvent<unknown>) => {
    const newCountry = event.target.value as CountryTypeCode;
    if (!newCountry) return;
    setCountry(newCountry);
    clearSharesTableData();
  }, []);

  // Specific job to continue getting actual quotations
  useEffect(() => {
    if (!isDelay) return;
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
    setShares(getSharesTableDataArray());
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

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography
          variant='h5'
          align='center'
          sx={{ color: theme.palette.primary.light, pt: 2, fontWeight: 'bold' }}
        >
          Алгоритмический робот (Анализ тренда на рынке по периодам за последний год)
        </Typography>
      </Grid>
      <Grid px={2} item xs={12} display={'flex'} justifyContent={'left'} alignItems={'center'}>
        <Select
          id={'selectCountry'}
          defaultValue={country}
          value={country}
          onChange={changeCountry}
          items={countriesDictionary}
          sx={{ backgroundColor: 'lightgray' }}
          disabled={false}
        />
        <TextField
          sx={{ backgroundColor: 'lightgray', borderRadius: 1 }}
          defaultValue={attention}
          type={'number'}
          onChange={changeAttention}
        />
        <IconButton
          onClick={() => {
            setIsBusy(true);
            getShareCounting(0);
          }}
          disabled={isBusy}
        >
          <UpdateIcon color={isBusy ? 'disabled' : 'primary'} />
        </IconButton>
      </Grid>
      <Grid item xs={12} px={3}>
        {isBusy && (
          <Box sx={{ color: 'whitesmoke', py: 1 }}>
            {`In process of loading... Progress: ${currentPosition}/${tickers.length}`}
          </Box>
        )}
        <TableShares
          columns={tableColumns}
          rows={shares}
          onClick={!isBusy ? updateShareCountingByTicker : undefined}
        />
      </Grid>
    </Grid>
  );
});
