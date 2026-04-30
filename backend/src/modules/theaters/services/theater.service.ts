// src/modules/theaters/services/theater.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateTheaterDto, UpdateTheaterDto } from '../dto/theater.dto';

@Injectable()
export class TheaterService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const theaters = await this.prisma.theater.findMany({
      include: {
        rooms: {
          select: { id: true, name: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return theaters.map((t) => ({
      ...t,
      id: t.id.toString(),
      rooms: t.rooms.map((r) => ({ ...r, id: r.id.toString() })),
    }));
  }

  async findOne(id: number) {
    const theater = await this.prisma.theater.findUnique({
      where: { id: BigInt(id) },
      include: {
        rooms: {
          include: {
            seats: {
              select: { id: true, seatNumber: true },
              orderBy: { seatNumber: 'asc' },
            },
          },
        },
      },
    });

    if (!theater) throw new NotFoundException(`Rạp #${id} không tồn tại`);

    return {
      ...theater,
      id: theater.id.toString(),
      rooms: theater.rooms.map((r) => ({
        ...r,
        id: r.id.toString(),
        theaterId: r.theaterId.toString(),
        seats: r.seats.map((s) => ({ ...s, id: s.id.toString() })),
      })),
    };
  }

  async create(dto: CreateTheaterDto) {
    const theater = await this.prisma.theater.create({
      data: { name: dto.name, location: dto.location },
    });
    return { ...theater, id: theater.id.toString() };
  }

  async update(id: number, dto: UpdateTheaterDto) {
    await this.findOne(id);
    const theater = await this.prisma.theater.update({
      where: { id: BigInt(id) },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.location !== undefined && { location: dto.location }),
      },
    });
    return { ...theater, id: theater.id.toString() };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.theater.delete({ where: { id: BigInt(id) } });
    return { message: `Đã xóa rạp #${id}` };
  }
}