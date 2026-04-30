// src/modules/theaters/controllers/room.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { RoomService } from '../services/room.service';
import { CreateRoomDto, UpdateRoomDto } from '../dto/theater.dto';
import { Roles, ROLES_KEY } from '../../../common/decorators/roles.decorator';
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  // GET /rooms/theater/:theaterId
  @Get('theater/:theaterId')
  findByTheater(@Param('theaterId') theaterId: string) {
    return this.roomService.findByTheater(Number(theaterId));
  }

  // GET /rooms/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(Number(id));
  }

  // POST /rooms
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateRoomDto) {
    return this.roomService.create(dto);
  }

  // PUT /rooms/:id
  @Roles('ADMIN')
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRoomDto) {
    return this.roomService.update(Number(id), dto);
  }

  // DELETE /rooms/:id
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(Number(id));
  }

  // POST /rooms/:id/seats — tạo ghế hàng loạt
  // Body: { seatNumbers: ["A1","A2",...] }
  @Roles('ADMIN')
  @Post(':id/seats')
  createSeats(
    @Param('id') id: string,
    @Body() body: { seatNumbers: string[] },
  ) {
    return this.roomService.createSeats(Number(id), body.seatNumbers);
  }
}