// src/modules/movies/services/movie.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateMovieDto, UpdateMovieDto, MovieQueryDto } from '../dto/movie.dto';

@Injectable()
export class MovieService {
  constructor(private readonly prisma: PrismaService) {}

  // Lấy danh sách phim (có phân trang + tìm kiếm)
  async findAll(query: MovieQueryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = query.search
      ? { title: { contains: query.search } }
      : {};

    const [movies, total] = await Promise.all([
      this.prisma.movie.findMany({
        where,
        skip,
        take: limit,
        orderBy: { releaseDate: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          duration: true,
          releaseDate: true,
          posterUrl: true,
        },
      }),
      this.prisma.movie.count({ where }),
    ]);

    return {
      data: movies.map((m) => ({ ...m, id: m.id.toString() })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Lấy 1 phim theo id
  async findOne(id: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: BigInt(id) },
      include: {
        showtimes: {
          select: {
            id: true,
            startTime: true,
            price: true,
            room: {
              select: {
                id: true,
                name: true,
                theater: {
                  select: { id: true, name: true, location: true },
                },
              },
            },
          },
          orderBy: { startTime: 'asc' },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!movie) throw new NotFoundException(`Phim #${id} không tồn tại`);

    return {
      ...movie,
      id: movie.id.toString(),
      showtimes: movie.showtimes.map((s) => ({
        ...s,
        id: s.id.toString(),
        room: {
          ...s.room,
          id: s.room.id.toString(),
          theater: {
            ...s.room.theater,
            id: s.room.theater.id.toString(),
          },
        },
      })),
      reviews: movie.reviews.map((r) => ({
        ...r,
        id: r.id.toString(),
        user: { ...r.user, id: r.user.id.toString() },
      })),
    };
  }

  // Tạo phim mới
async create(dto: CreateMovieDto) {
  const movie = await this.prisma.movie.create({
    data: {
      title: dto.title,
      description: dto.description ?? null,  // ✅ undefined → null
      duration: dto.duration,
      releaseDate: new Date(dto.releaseDate),
      posterUrl: dto.posterUrl ?? null,       // ✅ undefined → null
    },
  });

  return { ...movie, id: movie.id.toString() };
}

async update(id: number, dto: UpdateMovieDto) {
  await this.findOne(id);

  const movie = await this.prisma.movie.update({
    where: { id: BigInt(id) },
    data: {
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.description !== undefined && { description: dto.description ?? null }),
      ...(dto.duration !== undefined && { duration: dto.duration }),
      ...(dto.releaseDate !== undefined && { releaseDate: new Date(dto.releaseDate) }),
      ...(dto.posterUrl !== undefined && { posterUrl: dto.posterUrl ?? null }),
    },
  });

  return { ...movie, id: movie.id.toString() };
}

  // Xóa phim
  async remove(id: number) {
    await this.findOne(id); // check tồn tại

    await this.prisma.movie.delete({
      where: { id: BigInt(id) },
    });

    return { message: `Đã xóa phim #${id}` };
  }
}