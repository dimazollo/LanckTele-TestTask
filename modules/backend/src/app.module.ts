import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CurrencyModule } from './currency/currency.module';
// import { configFactory } from './config/configuration';
// import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './logger.middleware';
// import { join } from 'path';

@Module({
  imports: [
    // ConfigModule.forRoot({ load: [configFactory] }),
    TypeOrmModule.forRoot(),
    CurrencyModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
