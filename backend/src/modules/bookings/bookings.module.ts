// src/modules/bookings/bookings.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { BookingController } from './controllers/booking.controller';
import { BookingService } from './services/booking.service';
import { SeatLockService } from './services/seat-lock.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { RedisModule } from '../../redis/redis.module';
import { GatewayModule } from '../../gateways/gateway.module';

@Module({
  imports: [
    RedisModule,
    forwardRef(() => GatewayModule),
  ],
  controllers: [BookingController],
  providers: [BookingService, SeatLockService, PrismaService],
  exports: [BookingService, SeatLockService],
})
export class BookingsModule {}