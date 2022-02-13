import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CurrencyRate } from './currencyRate.entity';

@Entity('currency_type')
export class CurrencyType {
  @PrimaryGeneratedColumn({ type: 'integer' })
  currency_id: number;

  @Column({ type: 'character', length: 3 })
  currency_code: string;

  @OneToMany(() => CurrencyRate, (currencyRate) => currencyRate.currency_type)
  currency_rate: CurrencyRate[];
}
