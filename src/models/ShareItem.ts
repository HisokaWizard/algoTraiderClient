import { TickerId } from './ShareTicker';

export interface ShareItem {
  id: string;
  ticker: TickerId;
  name: string;
  figi: string;
  lot: number;
  currency: number;
  country_of_risk: string;
  country_of_risk_name: string;
}
