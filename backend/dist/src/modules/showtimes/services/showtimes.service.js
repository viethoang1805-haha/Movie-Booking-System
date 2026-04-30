"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowtimeService = void 0;
// src/modules/showtimes/services/showtime.service.ts
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
let ShowtimeService = class ShowtimeService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const where = {};
        if (query.movieId)
            where.movieId = BigInt(query.movieId);
        if (query.roomId)
            where.roomId = BigInt(query.roomId);
        if (query.date) {
            const start = new Date(query.date);
            const end = new Date(query.date);
            end.setDate(end.getDate() + 1);
            where.startTime = { gte: start, lt: end };
        }
        const showtimes = await this.prisma.showtime.findMany({
            where,
            include: {
                movie: { select: { id: true, title: true, duration: true, posterUrl: true } },
                room: {
                    select: {
                        id: true,
                        name: true,
                        theater: { select: { id: true, name: true, location: true } },
                    },
                },
            },
            orderBy: { startTime: 'asc' },
        });
        return showtimes.map((s) => this.serialize(s));
    }
    async findOne(id) {
        const showtime = await this.prisma.showtime.findUnique({
            where: { id: BigInt(id) },
            include: {
                movie: { select: { id: true, title: true, duration: true, posterUrl: true } },
                room: {
                    include: {
                        theater: { select: { id: true, name: true, location: true } },
                        seats: {
                            select: { id: true, seatNumber: true },
                            orderBy: { seatNumber: 'asc' },
                        },
                    },
                },
                bookings: {
                    where: { status: 'CONFIRMED' },
                    include: {
                        seats: { select: { seatId: true } },
                    },
                },
            },
        });
        if (!showtime)
            throw new common_1.NotFoundException(`Suất chiếu #${id} không tồn tại`);
        // Lấy danh sách seatId đã được đặt
        const bookedSeatIds = showtime.bookings
            .flatMap((b) => b.seats.map((s) => s.seatId.toString()));
        return {
            ...this.serialize(showtime),
            seats: showtime.room.seats.map((s) => ({
                id: s.id.toString(),
                seatNumber: s.seatNumber,
                status: bookedSeatIds.includes(s.id.toString()) ? 'booked' : 'available',
            })),
        };
    }
    async create(dto) {
        // Kiểm tra phòng có bị trùng giờ không
        const conflict = await this.prisma.showtime.findFirst({
            where: {
                roomId: BigInt(dto.roomId),
                startTime: { gte: new Date(dto.startTime) },
            },
            orderBy: { startTime: 'asc' },
        });
        if (conflict) {
            const conflictEnd = new Date(conflict.startTime);
            // Lấy duration phim để check overlap
            const movie = await this.prisma.movie.findUnique({
                where: { id: conflict.movieId },
                select: { duration: true },
            });
            if (movie) {
                conflictEnd.setMinutes(conflictEnd.getMinutes() + movie.duration);
                if (new Date(dto.startTime) < conflictEnd) {
                    throw new common_1.BadRequestException('Phòng đã có suất chiếu trong khung giờ này');
                }
            }
        }
        const showtime = await this.prisma.showtime.create({
            data: {
                movieId: BigInt(dto.movieId),
                roomId: BigInt(dto.roomId),
                startTime: new Date(dto.startTime),
                price: dto.price,
            },
        });
        return { ...showtime, id: showtime.id.toString(), movieId: showtime.movieId.toString(), roomId: showtime.roomId.toString() };
    }
    async update(id, dto) {
        await this.findOne(id);
        const showtime = await this.prisma.showtime.update({
            where: { id: BigInt(id) },
            data: {
                ...(dto.startTime !== undefined && { startTime: new Date(dto.startTime) }),
                ...(dto.price !== undefined && { price: dto.price }),
            },
        });
        return { ...showtime, id: showtime.id.toString(), movieId: showtime.movieId.toString(), roomId: showtime.roomId.toString() };
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.showtime.delete({ where: { id: BigInt(id) } });
        return { message: `Đã xóa suất chiếu #${id}` };
    }
    // Lấy ghế của showtime kèm trạng thái booked
    async getSeats(id) {
        const showtime = await this.prisma.showtime.findUnique({
            where: { id: BigInt(id) },
            include: {
                room: {
                    include: {
                        seats: { orderBy: { seatNumber: 'asc' } },
                    },
                },
                bookings: {
                    where: { status: 'CONFIRMED' },
                    include: { seats: { select: { seatId: true } } },
                },
            },
        });
        if (!showtime)
            throw new common_1.NotFoundException(`Suất chiếu #${id} không tồn tại`);
        const bookedSeatIds = showtime.bookings
            .flatMap((b) => b.seats.map((s) => s.seatId.toString()));
        return showtime.room.seats.map((s) => ({
            id: s.id.toString(),
            seatNumber: s.seatNumber,
            status: bookedSeatIds.includes(s.id.toString()) ? 'booked' : 'available',
        }));
    }
    serialize(s) {
        return {
            id: s.id.toString(),
            startTime: s.startTime,
            price: s.price,
            movieId: s.movieId.toString(),
            roomId: s.roomId.toString(),
            movie: s.movie
                ? { ...s.movie, id: s.movie.id.toString() }
                : undefined,
            room: s.room
                ? {
                    id: s.room.id.toString(),
                    name: s.room.name,
                    theater: s.room.theater
                        ? { ...s.room.theater, id: s.room.theater.id.toString() }
                        : undefined,
                }
                : undefined,
        };
    }
};
exports.ShowtimeService = ShowtimeService;
exports.ShowtimeService = ShowtimeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ShowtimeService);
//# sourceMappingURL=showtimes.service.js.map