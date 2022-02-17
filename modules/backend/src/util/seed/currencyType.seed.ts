import { readCsv } from './csvParser.service';
import { resolve } from 'path';

export async function seedCurrencyType() {
  const mapper = (val: { currency_id: string; currency_code: string }) => ({
    currency_id: parseInt(val.currency_id, 10),
    currency_code: val.currency_code,
  });
  return await readCsv(
    resolve(__dirname, '../../../../../currency_types.csv'),
    mapper,
  );
}
