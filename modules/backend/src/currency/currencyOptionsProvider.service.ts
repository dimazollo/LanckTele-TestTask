import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CurrencyOptionsProvider {
    constructor(private configService: ConfigService) {}
    get() {
        // return this.configService.get<RconOptions>('minecraft.rcon');
    }
}
