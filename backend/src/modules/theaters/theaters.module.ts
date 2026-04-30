// src/modules/theaters/theaters.module.ts
import { Module } from '@nestjs/common';
import { TheaterController } from './controllers/theater.controller';
import { RoomController } from './controllers/room.controller';
import { TheaterService } from './services/theater.service';
import { RoomService } from './services/room.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  controllers: [TheaterController, RoomController],
  providers: [TheaterService, RoomService, PrismaService],
  exports: [TheaterService, RoomService],
})
export class TheatersModule {}