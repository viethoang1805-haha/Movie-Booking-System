// src/gateways/gateway.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BookingGateway } from './booking.gateway';
import { BookingsModule } from '../modules/bookings/bookings.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    RedisModule,
    forwardRef(() => BookingsModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'supersecret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [BookingGateway],
  exports: [BookingGateway],
})
export class GatewayModule {}