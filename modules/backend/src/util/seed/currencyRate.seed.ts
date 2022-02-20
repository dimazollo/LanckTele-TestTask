import { readCsv } from './csvParser.service';
import { resolve } from 'path';

export async function seedCurrencyRate() {
  const mapper = (val: {
    currency_id: string;
    start_date: string;
    rate: string;
  }) => {
    const [date, month, year] = val.start_date
      .split('.')
      .map((val) => parseInt(val, 10));

    return {
      currency_id: parseInt(val.currency_id, 10),
      start_date: new Date(Date.UTC(year, month - 1, date)),
      rate: parseFloat(val.rate),
    };
  };
  return await readCsv(
    resolve(__dirname, '../../../../../currency_rates.csv'),
    mapper,
  );
}
