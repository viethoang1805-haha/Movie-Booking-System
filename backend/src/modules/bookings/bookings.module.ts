import { Module, forwardRef } from '@nestjs/common';
import { BookingService } from './services/booking.service';
import { SeatLockService } from './services/seat-lock.service';
import { BookingController } from './controllers/booking.controller';
import { RedisModule } from '../../redis/redis.module';
import { GatewayModule } from '../../gateways/gateway.module';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  imports: [
    RedisModule,
    forwardRef(() => GatewayModule),
  ],
  controllers: [BookingController],
  providers: [BookingService, SeatLockService, PrismaService], // ✅ thêm PrismaService
  exports: [BookingService, SeatLockService],
})
export class BookingsModule {}