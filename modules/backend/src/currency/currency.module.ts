import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyType, CurrencyRate } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([CurrencyType, CurrencyRate])],
  providers: [CurrencyService],
  controllers: [CurrencyController],
})
export class CurrencyModule {}
