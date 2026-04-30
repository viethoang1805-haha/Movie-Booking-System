// src/modules/theaters/services/room.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateRoomDto, UpdateRoomDto } from '../dto/theater.dto';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) {}

  async findByTheater(theaterId: number) {
    const rooms = await this.prisma.room.findMany({
      where: { theaterId: BigInt(theaterId) },
      include: {
        seats: {
          select: { id: true, seatNumber: true },
          orderBy: { seatNumber: 'asc' },
        },
      },
    });

    return rooms.map((r) => ({
      ...r,
      id: r.id.toString(),
      theaterId: r.theaterId.toString(),
      seats: r.seats.map((s) => ({ ...s, id: s.id.toString() })),
    }));
  }

  async findOne(id: number) {
    const room = await this.prisma.room.findUnique({
      where: { id: BigInt(id) },
      include: {
        theater: { select: { id: true, name: true, location: true } },
        seats: {
          select: { id: true, seatNumber: true },
          orderBy: { seatNumber: 'asc' },
        },
      },
    });

    if (!room) throw new NotFoundException(`Phòng #${id} không tồn tại`);

    return {
      ...room,
      id: room.id.toString(),
      theaterId: room.theaterId.toString(),
      theater: { ...room.theater, id: room.theater.id.toString() },
      seats: room.seats.map((s) => ({ ...s, id: s.id.toString() })),
    };
  }

  async create(dto: CreateRoomDto) {
    const room = await this.prisma.room.create({
      data: {
        name: dto.name,
        theaterId: BigInt(dto.theaterId),
      },
    });
    return { ...room, id: room.id.toString(), theaterId: room.theaterId.toString() };
  }

  async update(id: number, dto: UpdateRoomDto) {
    await this.findOne(id);
    const room = await this.prisma.room.update({
      where: { id: BigInt(id) },
      data: { ...(dto.name !== undefined && { name: dto.name }) },
    });
    return { ...room, id: room.id.toString(), theaterId: room.theaterId.toString() };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.room.delete({ where: { id: BigInt(id) } });
    return { message: `Đã xóa phòng #${id}` };
  }

  // Tạo ghế hàng loạt cho phòng
  async createSeats(roomId: number, seatNumbers: string[]) {
    await this.findOne(roomId);

    const seats = await this.prisma.seat.createMany({
      data: seatNumbers.map((seatNumber) => ({
        seatNumber,
        roomId: BigInt(roomId),
      })),
      skipDuplicates: true,
    });

    return { created: seats.count, message: `Đã tạo ${seats.count} ghế` };
  }
}