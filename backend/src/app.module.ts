 
import { Module } from '@nestjs/common';
import { BookingsModule } from './modules/bookings/bookings.module';
import { RedisModule } from './redis/redis.module';
import { BookingGateway } from './gateways/booking.gateway';

@Module({
  imports: [
    BookingsModule,
    RedisModule,
  ],
  providers: [BookingGateway],
})
export class AppModule {}