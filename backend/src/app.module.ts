 
import { Module } from '@nestjs/common';
import { BookingsModule } from './modules/bookings/bookings.module';
import { RedisModule } from './redis/redis.module';
import { BookingGateway } from './gateways/booking.gateway';
import { ShowtimesModule } from './modules/showtimes/showtimes.module';
@Module({
  imports: [
    BookingsModule,
    RedisModule,
    ShowtimesModule,
  ],
 
})
export class AppModule {}