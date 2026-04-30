// src/modules/movies/controllers/movie.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { MovieService } from '../services/movie.service';
import { CreateMovieDto, UpdateMovieDto, MovieQueryDto } from '../dto/movie.dto';
import { Public } from '../../../common/decorators/public.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
@Public()
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  // GET /movies?page=1&limit=10&search=avengers
  @Get()
  findAll(@Query() query: MovieQueryDto) {
    return this.movieService.findAll(query);
  }

  // GET /movies/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movieService.findOne(Number(id));
  }

  // POST /movies
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateMovieDto) {
    return this.movieService.create(dto);
  }

  // PUT /movies/:id
  @Roles('ADMIN')
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMovieDto) {
    return this.movieService.update(Number(id), dto);
  }

  // DELETE /movies/:id
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movieService.remove(Number(id));
  }
}