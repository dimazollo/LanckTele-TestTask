import {
  createConnection,
  getRepository,
} from 'typeorm';
import { seedCurrencyRate, seedCurrencyType } from '../utils/seeds';
import { CurrencyRate, CurrencyType } from '../currency/entity';

async function seedDb(): Promise<void> {
  const connection = await createConnection({
    type: 'better-sqlite3',
    database: 'lanck-db.sqlite',
    entities: [CurrencyType, CurrencyRate]
  });
  await connection.synchronize(true)

  const currencyTypes = await seedCurrencyType();
  const saveResult1 = await getRepository(CurrencyType).save(currencyTypes);
  console.log('currencyTypes saving result: ', saveResult1);

  const currencyRates = await seedCurrencyRate();
  const saveResult2 = await getRepository(CurrencyRate).save(currencyRates);
  console.log('currencyRates saving result: ', saveResult2);
}

seedDb()
