// src/gateways/gateway.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { BookingGateway } from './booking.gateway';
import { BookingsModule } from '../modules/bookings/bookings.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    RedisModule,
    forwardRef(() => BookingsModule),
  ],
  providers: [BookingGateway],
  exports: [BookingGateway],
})
export class GatewayModule {}