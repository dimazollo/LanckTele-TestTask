import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CurrencyType } from './currencyType.entity';

@Entity('currency_rate')
export class CurrencyRate {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @ManyToOne(() => CurrencyType, (currencyType) => currencyType.currency_id)
  @JoinColumn({ name: 'currency_id' })
  currency_type: CurrencyType;

  @Column({ type: 'integer' })
  currency_id: number;

  @Column({ type: 'datetime' })
  start_date: Date;

  @Column({ type: 'decimal' })
  rate: number;
}
