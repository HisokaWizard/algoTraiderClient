import { Grid } from '@mui/material';
import React, { ReactNode } from 'react';
import { ShareItem, ShareQoutation, TickerId, Trend } from '../models';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import UpdateIcon from '@mui/icons-material/Update';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';

export type TableType = ShareQoutation &
  Omit<ShareItem, 'id' | 'figi' | 'lot' | 'country_of_risk' | 'country_of_risk_name'> & {
    get_current_values: { update: void };
  };

export interface Column {
  id: keyof TableType;
  label: string;
  minWidth: number;
}

export const tableColumns: Column[] = [
  { id: 'name', label: 'Наименование компании', minWidth: 200 },
  { id: 'ticker', label: 'Тикер', minWidth: 80 },
  { id: 'currency', label: 'Валюта', minWidth: 80 },
  { id: 'get_current_values', label: 'Обновить данные', minWidth: 80 },
  { id: 'strong_attention', label: 'ВНИМАНИЕ', minWidth: 80 },
  { id: 'summary_trend_by_year', label: 'Суммарный тренд за год', minWidth: 100 },
  { id: 'today_price', label: 'Текущая цена', minWidth: 100 },
  { id: 'week_ago_price', label: 'Цена 7 дней назад', minWidth: 100 },
  { id: 'month_ago_price', label: 'Цена 30 дней назад', minWidth: 100 },
  { id: 'three_month_ago_price', label: 'Цена 90 дней назад', minWidth: 100 },
  { id: 'half_year_ago_price', label: 'Цена 180 дней назад', minWidth: 100 },
  { id: 'year_ago_price', label: 'Цена 365 дней назад', minWidth: 100 },
  { id: 'actual_trend_week', label: 'Изменения за 7 дней', minWidth: 100 },
  { id: 'actual_trend_month', label: 'Изменения за 30 дней', minWidth: 100 },
  { id: 'actual_trend_three_months', label: 'Изменения за 90 дней', minWidth: 100 },
  { id: 'actual_trend_half_year', label: 'Изменения за 180 дней', minWidth: 100 },
  { id: 'actual_trend_year', label: 'Изменения за 365 дней', minWidth: 100 },
];

const initTrend: Trend = { trend: false, power: 0 };

export const convertShareToTableItem = (it: ShareItem): TableType => ({
  name: it.name,
  ticker: it.ticker,
  currency: it.currency,
  get_current_values: { update: undefined },
  strong_attention: false,
  today_price: 0,
  week_ago_price: 0,
  month_ago_price: 0,
  three_month_ago_price: 0,
  half_year_ago_price: 0,
  year_ago_price: 0,
  actual_trend_week: initTrend,
  actual_trend_month: initTrend,
  actual_trend_three_months: initTrend,
  actual_trend_half_year: initTrend,
  actual_trend_year: initTrend,
  summary_trend_by_year: initTrend,
});

export const dataMapping = (
  item: Trend | string | number | boolean | { update: void },
  onClick?: () => void,
): ReactNode | number | string | boolean => {
  if (!item) return '-';
  if (typeof item === 'number') {
    return (item as number).toFixed(4);
  }
  if (typeof item === 'boolean') {
    return (
      <Grid item>
        <NotificationImportantIcon color='success' />
      </Grid>
    );
  }
  if (typeof item === 'object' && 'trend' in (item as Trend) && 'power' in (item as Trend)) {
    const it = item as Trend;
    return (
      <Grid item display={'flex'} justifyContent={'center'}>
        {it.power.toFixed(4)}{' '}
        {it.trend ? <ArrowUpwardIcon color='success' /> : <ArrowDownwardIcon color='error' />}
      </Grid>
    );
  }
  if (typeof item === 'object' && 'update' in (item as { update: void })) {
    return (
      <Grid item>
        <UpdateIcon
          sx={{ cursor: onClick ? 'pointer' : 'default' }}
          color={onClick ? 'primary' : 'disabled'}
          onClick={onClick}
        />
      </Grid>
    );
  }
  return item as string;
};

const tableShareData = new Map<TickerId, TableType>();

export const localStorageTableData = () => {
  const addNewRowItem = (shareItem: ShareItem) => {
    if (tableShareData.has(shareItem.ticker)) return;
    tableShareData.set(shareItem.ticker, convertShareToTableItem(shareItem));
  };

  const getSharesTableData = (): Map<TickerId, TableType> => {
    return tableShareData;
  };

  const getSharesTableDataArray = (): TableType[] => {
    return Array.from(tableShareData).map((it) => it[1]);
  };

  const clearSharesTableData = () => {
    tableShareData.clear();
  };

  const setCountingValuesToTableItem = (shareQuotation: ShareQoutation) => {
    if (!tableShareData.has(shareQuotation.ticker)) return;
    const item = tableShareData.get(shareQuotation.ticker);
    if (!item) return;
    item.today_price = shareQuotation.today_price;
    item.week_ago_price = shareQuotation.week_ago_price;
    item.month_ago_price = shareQuotation.month_ago_price;
    item.three_month_ago_price = shareQuotation.three_month_ago_price;
    item.half_year_ago_price = shareQuotation.half_year_ago_price;
    item.year_ago_price = shareQuotation.year_ago_price;
    item.actual_trend_week = shareQuotation.actual_trend_week;
    item.actual_trend_month = shareQuotation.actual_trend_month;
    item.actual_trend_three_months = shareQuotation.actual_trend_three_months;
    item.actual_trend_half_year = shareQuotation.actual_trend_half_year;
    item.actual_trend_year = shareQuotation.actual_trend_year;
    item.summary_trend_by_year = shareQuotation.summary_trend_by_year;
    item.strong_attention = shareQuotation.strong_attention;
    tableShareData.set(item.ticker, item);
  };

  return {
    addNewRowItem,
    getSharesTableData,
    getSharesTableDataArray,
    clearSharesTableData,
    setCountingValuesToTableItem,
  };
};
