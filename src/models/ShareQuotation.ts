import { TickerId } from './ShareTicker';
import { Trend } from './Trend';

export interface ShareQoutation {
  ticker: TickerId;
  year_ago_price: number;
  half_year_ago_price: number;
  three_month_ago_price: number;
  month_ago_price: number;
  week_ago_price: number;
  today_price: number;
  strong_attention: boolean;
  actual_trend_year: Trend;
  actual_trend_half_year: Trend;
  actual_trend_three_months: Trend;
  actual_trend_month: Trend;
  actual_trend_week: Trend;
  summary_trend_by_year: Trend;
}
