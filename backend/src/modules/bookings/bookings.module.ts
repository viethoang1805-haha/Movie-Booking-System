import { Module } from '@nestjs/common';
import { BookingService } from './services/booking.service';
import { SeatLockService } from './services/seat-lock.service';
import { RedisModule } from '../../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [BookingService, SeatLockService],
  exports: [BookingService],
})
export class BookingsModule {}