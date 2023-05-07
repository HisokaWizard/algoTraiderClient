import {
  Grid,
  IconButton,
  SelectChangeEvent,
  TextField,
  Typography,
  useTheme,
  Box,
  Tooltip,
} from '@mui/material';
import UpdateIcon from '@mui/icons-material/Update';
import React, { ChangeEvent, memo, useCallback, useEffect, useState } from 'react';
import { localStorageTableData, Select, tableColumns } from '../components';
import { countriesDictionary, CountryTypeCode } from '../models';
import { TableShares } from '../components/Table';
import { useGetAllSharesByCountry, useGetTickersByCountry } from './useGetMetaData';
import { useShareActions } from './useShareActions';

const { getSharesTableDataArray, clearSharesTableData } = localStorageTableData();

const help = (
  <Box>
    <Box>1. Необходимо сделать дохера всего...</Box>
  </Box>
);

const getDataFromLocalStorage = () => {
  const result = localStorage.getItem('shares');
  if (!result) return;
  const _shares = JSON.parse(result);
  return _shares;
};

const sharesData = getDataFromLocalStorage();

export const MainPage = memo(() => {
  const [country, setCountry] = useState<CountryTypeCode>('RU');
  const { tickers, tickersMapData } = useGetTickersByCountry(!!sharesData ? undefined : country);
  const { readyToSetShares, setReadyToSetShares } = useGetAllSharesByCountry(
    !!sharesData ? undefined : country,
  );
  const {
    setShares,
    shares,
    setAttention,
    attention,
    setIsBusy,
    isBusy,
    getShareCounting,
    updateShareCountingByTicker,
    currentPosition,
  } = useShareActions(tickersMapData, tickers);
  const theme = useTheme();

  useEffect(() => {
    if (country !== 'RU' || !sharesData) return;
    setShares(sharesData);
  }, []);

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
    setReadyToSetShares(false);
    clearSharesTableData();
  }, []);

  return (
    <Grid container>
      <Grid item xs={12} pb={1}>
        <Typography
          variant='h5'
          align='center'
          sx={{ color: theme.palette.primary.dark, pt: 2, fontWeight: 'bold' }}
        >
          Алгоритмический робот (Анализ тренда на рынке по периодам за последний год)
        </Typography>
      </Grid>
      <Grid px={2} item xs={12} display={'flex'} justifyContent={'left'} alignItems={'center'}>
        <Select
          id={'selectCountry'}
          label={'Страна'}
          defaultValue={country}
          value={country}
          onChange={changeCountry}
          items={countriesDictionary}
        />
        <TextField
          label={'Исследуемое отклонение, %'}
          defaultValue={attention}
          type={'number'}
          onChange={changeAttention}
        />
        <IconButton
          title='Обновить все котировки'
          onClick={() => {
            setIsBusy(true);
            getShareCounting(0);
          }}
          disabled={isBusy}
        >
          <UpdateIcon color={isBusy ? 'disabled' : 'primary'} />
        </IconButton>
        <Tooltip title={help}>
          <Box pr={1}>Помощь</Box>
        </Tooltip>
        {isBusy && (
          <Box sx={{ color: 'whitesmoke' }} pr={1}>
            {`In process of loading... Progress: ${currentPosition}/${tickers.length}`}
          </Box>
        )}
      </Grid>
      <Grid item xs={12} px={3}>
        <TableShares
          columns={tableColumns}
          rows={shares}
          onClick={!isBusy ? updateShareCountingByTicker : undefined}
        />
      </Grid>
    </Grid>
  );
});
