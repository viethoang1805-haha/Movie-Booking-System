// src/modules/theaters/controllers/theater.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TheaterService } from '../services/theater.service';
import { CreateTheaterDto, UpdateTheaterDto } from '../dto/theater.dto';
import { Public } from '../../../common/decorators/public.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
@Public()
@Controller('theaters')
export class TheaterController {
  constructor(private readonly theaterService: TheaterService) {}

  // GET /theaters
  @Get()
  findAll() {
    return this.theaterService.findAll();
  }

  // GET /theaters/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.theaterService.findOne(Number(id));
  }

  // POST /theaters
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateTheaterDto) {
    return this.theaterService.create(dto);
  }

  // PUT /theaters/:id
  @Roles('ADMIN')
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTheaterDto) {
    return this.theaterService.update(Number(id), dto);
  }

  // DELETE /theaters/:id
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.theaterService.remove(Number(id));
  }
}