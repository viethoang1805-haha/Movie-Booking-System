// src/modules/showtimes/controllers/showtime.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ShowtimeService } from '../../showtimes/services/showtimes.service';
import { CreateShowtimeDto, UpdateShowtimeDto, ShowtimeQueryDto } from '../dto/showtime.dto';
import { Public } from '../../../common/decorators/public.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';


@Controller('showtimes')
export class ShowtimeController {
  constructor(private readonly showtimeService: ShowtimeService) {}

  // GET /showtimes?movieId=1&date=2026-04-20
    @Public()
  @Get()
  findAll(@Query() query: ShowtimeQueryDto) {
    return this.showtimeService.findAll(query);
  }

  // GET /showtimes/:id
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showtimeService.findOne(Number(id));
  }

  // GET /showtimes/:id/seats — lấy ghế + trạng thái booked
  
  @Get(':id/seats')
  getSeats(@Param('id') id: string) {
    return this.showtimeService.getSeats(Number(id));
  }

  // POST /showtimes
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateShowtimeDto) {
    return this.showtimeService.create(dto);
  }

  // PUT /showtimes/:id
  @Roles('ADMIN')
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateShowtimeDto) {
    return this.showtimeService.update(Number(id), dto);
  }

  // DELETE /showtimes/:id
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.showtimeService.remove(Number(id));
  }
}