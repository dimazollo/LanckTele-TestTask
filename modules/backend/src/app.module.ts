import { Module } from '@nestjs/common';
import { CurrencyModule } from './currency/currency.module';
// import { configFactory } from './config/configuration';
// import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { join } from 'path';

@Module({
  imports: [
    // ConfigModule.forRoot({ load: [configFactory] }),
    TypeOrmModule.forRoot(),
    CurrencyModule,
  ],
})
export class AppModule {}
