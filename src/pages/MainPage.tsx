import {
  Grid,
  IconButton,
  SelectChangeEvent,
  Skeleton,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import UpdateIcon from '@mui/icons-material/Update';
import React, {
  ChangeEvent,
  ChangeEventHandler,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useGetSharesByTickersMutation, useLazyGetAllSharesQuery } from '../store/sharesApi';
import { convertDataToTable, Select, tableColumns, TableType } from '../components';
import { countriesDictionary, CountryTypeCode } from '../models/Counties';
import { ruTickers, ShareItem } from '../models';
import { TableShares } from '../components/Table';

export const MainPage = memo(() => {
  const [country, setCountry] = useState<CountryTypeCode>('RU');
  const [attention, setAttention] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsSize, setRowsSize] = useState(10);
  const [shares, setShares] = useState<TableType[]>([]);
  const [getSharesByCountry, { data, isFetching }] = useLazyGetAllSharesQuery();
  const [getShareByTickers, { isLoading }] = useGetSharesByTickersMutation();
  const theme = useTheme();

  useEffect(() => {
    getSharesByCountry(country);
  }, []);

  useEffect(() => {
    if (!data) return;
    setShares(convertDataToTable(data));
  }, [data]);

  const changeAttention = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!event.target.value) return;
      setAttention(+event.target.value);
    },
    [],
  );

  const getTablePageState = useCallback((page: number, rowsPerPage: number) => {
    setCurrentPage(page);
    setRowsSize(rowsPerPage);
  }, []);

  const changeCountry = useCallback((event: SelectChangeEvent<unknown>) => {
    const newCountry = event.target.value as CountryTypeCode;
    if (!newCountry) return;
    setCountry(newCountry);
    getSharesByCountry(newCountry);
  }, []);

  const updateData = useCallback(
    async (ticker: string) => {
      try {
        const response = await getShareByTickers({
          codes: [ticker],
          country_code: country,
          attention,
        });
        if (!response) return;
        const items = (response as any).data as ShareItem[];
        const item = convertDataToTable(items)[0];
        const newShares = shares.map((it) => (it.ticker === item.ticker ? item : it));
        setShares(newShares);
      } catch (error) {
        console.error(error);
      }
    },
    [country, shares, attention],
  );

  const updatePageShares = useCallback(async () => {
    try {
      const tickers = ruTickers.slice(currentPage * rowsSize, currentPage * rowsSize + rowsSize);
      const response = await getShareByTickers({
        codes: tickers,
        country_code: country,
        attention,
      });
      if (!response) return;
      const items = (response as any).data as ShareItem[];
      const tableItems = convertDataToTable(items);
      const newShares = shares.map((it) => {
        const item = tableItems.find((_it) => _it.ticker === it.ticker);
        return !!item ? item : it;
      });
      setShares(newShares);
    } catch (error) {
      console.error(error);
    }
  }, [rowsSize, currentPage, shares, attention]);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant='h4' align='center' sx={{ color: theme.palette.primary.light, pt: 2 }}>
          Algo traiding bot for analyst(right now)
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
          disabled
        />
        <TextField
          sx={{ backgroundColor: 'lightgray', borderRadius: 1 }}
          defaultValue={attention}
          type={'number'}
          onChange={changeAttention}
        />
        <IconButton onClick={updatePageShares}>
          <UpdateIcon color='primary' />
        </IconButton>
      </Grid>
      <Grid item xs={12} px={3}>
        {isLoading || isFetching ? (
          <Skeleton
            variant='rectangular'
            width={'100%'}
            height={450}
            sx={{ backgroundColor: 'whitesmoke' }}
          />
        ) : (
          <TableShares
            columns={tableColumns}
            rows={shares}
            onClick={updateData}
            getTablePageState={getTablePageState}
          />
        )}
      </Grid>
    </Grid>
  );
});
