export type TickerId = string & { _tickerBrand: void };

export interface ShareTicker {
  ticker: TickerId;
  figi: string;
  id: string;
}
