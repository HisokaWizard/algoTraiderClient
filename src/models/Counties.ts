import { Dictionary } from './Dictionary';

export const countriesCodes = [
  'US',
  'KR',
  'RU',
  'GB',
  'IL',
  'SE',
  'CN',
  'FR',
  'KZ',
  'BM',
  'CA',
  'BE',
  'BR',
  'CH',
  'LU',
  'IN',
  'AR',
  'HK',
  'JP',
  'DE',
  'FI',
  'NL',
  'IT',
  'IE',
  'TW',
  'UY',
  'AU',
  'SG',
  'PE',
] as const;

export type CountryTypeCode = typeof countriesCodes[number];

export interface CountryType extends Dictionary {
  code: CountryTypeCode;
}

export const countriesDictionary: CountryType[] = [
  { code: 'US', name: 'Соединенные Штаты Америки' },
  { code: 'KR', name: 'Республика Корея' },
  { code: 'RU', name: 'Российская Федерация' },
  { code: 'GB', name: 'Соединенное Королевство Великобритании и Северной Ирландии' },
  { code: 'IL', name: 'Государство Израиль' },
  { code: 'SE', name: 'Королевство Швеция' },
  { code: 'CN', name: 'Китайская Народная Республика' },
  { code: 'FR', name: 'Французская Республика' },
  { code: 'KZ', name: 'Республика Казахстан' },
  { code: 'BM', name: 'Бермуды' },
  { code: 'CA', name: 'Канада' },
  { code: 'BE', name: 'Королевство Бельгии' },
  { code: 'BR', name: 'Федеративная Республика Бразилия' },
  { code: 'CH', name: 'Швейцарская Конфедерация' },
  { code: 'LU', name: 'Великое Герцогство Люксембург' },
  { code: 'IN', name: 'Республика Индия' },
  { code: 'AR', name: 'Аргентинская Республика' },
  { code: 'HK', name: 'Специальный административный регион Китая Гонконг' },
  { code: 'JP', name: 'Япония' },
  { code: 'DE', name: 'Федеративная Республика Германия' },
  { code: 'FI', name: 'Финляндская Республика' },
  { code: 'NL', name: 'Королевство Нидерландов' },
  { code: 'IT', name: 'Итальянская Республика' },
  { code: 'IE', name: 'Ирландия' },
  { code: 'TW', name: 'Тайвань' },
  { code: 'UY', name: 'Восточная Республика Уругвай' },
  { code: 'AU', name: 'Австралия' },
  { code: 'SG', name: 'Республика Сингапур' },
  { code: 'PE', name: 'Республика Перу' },
];
