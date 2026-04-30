 
import { Module } from '@nestjs/common';
import { BookingsModule } from './modules/bookings/bookings.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { ShowtimesModule } from './modules/showtimes/showtimes.module';
import { MoviesModule } from './modules/movies/movies.module';
import { TheatersModule } from './modules/theaters/theaters.module';
import { AdminModule } from './modules/admin/admin.module';
@Module({
  imports: [
    AuthModule,
     MoviesModule,
     TheatersModule,
    BookingsModule,
    RedisModule,
    ShowtimesModule,
    AdminModule,
  ],
 
})
export class AppModule {}