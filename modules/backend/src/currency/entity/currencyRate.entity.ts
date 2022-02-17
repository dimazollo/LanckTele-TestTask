import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CurrencyType } from './currencyType.entity';
import { Sortable } from '../../util/decorator';

@Entity('currency_rate')
export class CurrencyRate {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @ManyToOne(() => CurrencyType, (currencyType) => currencyType.currency_id)
  @JoinColumn({ name: 'currency_id' })
  currency_type: CurrencyType;

  @Column({ type: 'integer' })
  currency_id: number;

  @Sortable()
  @Column({ type: 'datetime' })
  start_date: Date;

  @Sortable()
  @Column({ type: 'decimal' })
  rate: number;

  constructor(
    id?: number,
    currencyType?: CurrencyType,
    currencyId?: number,
    startDate?: Date,
    rate?: number,
  ) {
    this.id = id;
    this.currency_type = currencyType;
    this.currency_id = currencyId;
    this.start_date = startDate;
    this.rate = rate;
  }
}
