import { Grid } from '@mui/material';
import React, { ReactNode } from 'react';
import { ShareItem, Trend } from '../models';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import UpdateIcon from '@mui/icons-material/Update';

export type TableType = Omit<
  ShareItem,
  'id' | 'figi' | 'lot' | 'country_of_risk' | 'country_of_risk_name'
> & { get_current_values: { update: void } };

export interface Column {
  id: keyof TableType;
  label: string;
  minWidth: number;
}

export const tableColumns: Column[] = [
  { id: 'name', label: 'Наименование компании', minWidth: 250 },
  { id: 'ticker', label: 'Тикер', minWidth: 80 },
  { id: 'currency', label: 'Валюта', minWidth: 80 },
  { id: 'get_current_values', label: 'Обновить данные', minWidth: 150 },
  { id: 'strong_attention', label: 'ВНИМАНИЕ', minWidth: 100 },
  { id: 'summary_trend_by_year', label: 'Суммарный тренд за год', minWidth: 200 },
  { id: 'today_price', label: 'Текущая цена', minWidth: 200 },
  { id: 'week_ago_price', label: 'Цена 7 дней назад', minWidth: 200 },
  { id: 'month_ago_price', label: 'Цена 30 дней назад', minWidth: 200 },
  { id: 'three_month_ago_price', label: 'Цена 90 дней назад', minWidth: 200 },
  { id: 'half_year_ago_price', label: 'Цена 180 дней назад', minWidth: 200 },
  { id: 'year_ago_price', label: 'Цена 365 дней назад', minWidth: 200 },
  { id: 'actual_trend_week', label: 'Изменения за 7 дней', minWidth: 200 },
  { id: 'actual_trend_month', label: 'Изменения за 30 дней', minWidth: 200 },
  { id: 'actual_trend_three_months', label: 'Изменения за 90 дней', minWidth: 200 },
  { id: 'actual_trend_half_year', label: 'Изменения за 180 дней', minWidth: 200 },
  { id: 'actual_trend_year', label: 'Изменения за 365 дней', minWidth: 200 },
];

export const convertDataToTable = (data: ShareItem[]): TableType[] => {
  return data.map((it) => ({
    name: it.name,
    ticker: it.ticker,
    currency: it.currency,
    get_current_values: { update: undefined },
    strong_attention: it.strong_attention,
    today_price: it.today_price,
    week_ago_price: it.week_ago_price,
    month_ago_price: it.month_ago_price,
    three_month_ago_price: it.three_month_ago_price,
    half_year_ago_price: it.half_year_ago_price,
    year_ago_price: it.year_ago_price,
    actual_trend_week: it.actual_trend_week,
    actual_trend_month: it.actual_trend_month,
    actual_trend_three_months: it.actual_trend_three_months,
    actual_trend_half_year: it.actual_trend_half_year,
    actual_trend_year: it.actual_trend_year,
    summary_trend_by_year: it.summary_trend_by_year,
  }));
};

export const dataMapping = (
  item: Trend | string | number | boolean | { update: void },
  onClick: () => void,
): ReactNode | number | string | boolean => {
  if (!item) return '-';
  if (typeof item === 'number') {
    return (item as number).toFixed(2);
  }
  if (typeof item === 'boolean') {
    return <Grid item sx={{ backgroundColor: item ? 'green' : 'red', minHeight: 30 }} />;
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
        <UpdateIcon sx={{ cursor: 'pointer' }} onClick={onClick} />
      </Grid>
    );
  }
  return item as string;
};
