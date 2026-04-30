// src/modules/movies/movies.module.ts
import { Module } from '@nestjs/common';
import { MovieController } from './controllers/movie.controller';
import { MovieService } from './services/movie.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  controllers: [MovieController],
  providers: [MovieService, PrismaService],
  exports: [MovieService],
})
export class MoviesModule {}