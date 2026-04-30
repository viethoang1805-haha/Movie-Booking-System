
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // Thống kê tổng quan cho dashboard
  async getDashboardStats() {
    const [totalMovies, totalUsers, totalBookings, totalRevenue, recentBookings] =
      await Promise.all([
        this.prisma.movie.count(),
        this.prisma.user.count(),
        this.prisma.booking.count({ where: { status: 'CONFIRMED' } }),
        this.prisma.booking.aggregate({
          where: { status: 'CONFIRMED' },
          _sum: { totalPrice: true },
        }),
        this.prisma.booking.findMany({
          where: { status: 'CONFIRMED' },
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, name: true, email: true } },
            showtime: {
              include: {
                movie: { select: { id: true, title: true } },
              },
            },
            seats: {
              include: { seat: { select: { seatNumber: true } } },
            },
          },
        }),
      ]);

    return {
      totalMovies,
      totalUsers,
      totalBookings,
      totalRevenue: totalRevenue._sum.totalPrice ?? 0,
      recentBookings: recentBookings.map((b) => ({
        id: b.id.toString(),
        totalPrice: b.totalPrice,
        status: b.status,
        createdAt: b.createdAt,
        user: { ...b.user, id: b.user.id.toString() },
        movie: b.showtime.movie.title,
        seats: b.seats.map((s) => s.seat.seatNumber),
      })),
    };
  }

  // Danh sách user
  async getUsers(query: { page?: number; limit?: number; search?: string; role?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.role) where.role = query.role;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { email: { contains: query.search } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: { select: { bookings: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users.map((u) => ({
        ...u,
        id: u.id.toString(),
        bookingCount: u._count.bookings,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Đổi role user
  async updateUserRole(userId: number, role: 'USER' | 'ADMIN') {
    const user = await this.prisma.user.update({
      where: { id: BigInt(userId) },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
    return { ...user, id: user.id.toString() };
  }

  // Xóa user
  async deleteUser(userId: number) {
    await this.prisma.user.delete({ where: { id: BigInt(userId) } });
    return { message: `Đã xóa user #${userId}` };
  }

  // Danh sách booking
  async getBookings(query: { page?: number; limit?: number; status?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status;

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true } },
          showtime: {
            include: {
              movie: { select: { id: true, title: true } },
              room: {
                select: {
                  name: true,
                  theater: { select: { name: true } },
                },
              },
            },
          },
          seats: {
            include: { seat: { select: { seatNumber: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: bookings.map((b) => ({
        id: b.id.toString(),
        totalPrice: b.totalPrice,
        status: b.status,
        createdAt: b.createdAt,
        user: { ...b.user, id: b.user.id.toString() },
        movie: b.showtime.movie.title,
        theater: b.showtime.room.theater.name,
        room: b.showtime.room.name,
        startTime: b.showtime.startTime,
        seats: b.seats.map((s) => s.seat.seatNumber),
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}