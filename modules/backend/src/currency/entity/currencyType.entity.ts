import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CurrencyRate } from './currencyRate.entity';
import { Sortable } from '../../util/decorator';

@Entity('currency_type')
export class CurrencyType {
  @PrimaryGeneratedColumn({ type: 'integer' })
  currency_id: number;

  @Sortable()
  @Column({ type: 'character', length: 3 })
  currency_code: string;

  @OneToMany(() => CurrencyRate, (currencyRate) => currencyRate.currency_type)
  currency_rate: CurrencyRate[];

  constructor(
    currencyId?: number,
    currencyCode?: string,
    currencyRate?: CurrencyRate[],
  ) {
    this.currency_id = currencyId;
    this.currency_code = currencyCode;
    this.currency_rate = currencyRate;
  }
}
