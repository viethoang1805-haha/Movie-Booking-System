// src/modules/showtimes/showtimes.module.ts
import { Module } from '@nestjs/common';
import { ShowtimeController } from '../showtimes/controllers/showtimes.controller';
import { ShowtimeService } from './services/showtimes.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  controllers: [ShowtimeController],
  providers: [ShowtimeService, PrismaService],
  exports: [ShowtimeService],
})
export class ShowtimesModule {}