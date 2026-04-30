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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
// src/modules/bookings/services/booking.service.ts
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const seat_lock_service_1 = require("./seat-lock.service");
const booking_gateway_1 = require("../../../gateways/booking.gateway");
let BookingService = class BookingService {
    constructor(prisma, seatLockService, bookingGateway) {
        this.prisma = prisma;
        this.seatLockService = seatLockService;
        this.bookingGateway = bookingGateway;
    }
    // Lấy danh sách booking
    async findAll(query) {
        const where = {};
        if (query.userId)
            where.userId = BigInt(query.userId);
        if (query.showtimeId)
            where.showtimeId = BigInt(query.showtimeId);
        if (query.status)
            where.status = query.status;
        const bookings = await this.prisma.booking.findMany({
            where,
            include: {
                user: { select: { id: true, name: true, email: true } },
                showtime: {
                    include: {
                        movie: { select: { id: true, title: true, posterUrl: true } },
                        room: {
                            select: {
                                id: true,
                                name: true,
                                theater: { select: { id: true, name: true, location: true } },
                            },
                        },
                    },
                },
                seats: {
                    include: { seat: { select: { id: true, seatNumber: true } } },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return bookings.map((b) => this.serialize(b));
    }
    // Lấy 1 booking
    async findOne(id) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: BigInt(id) },
            include: {
                user: { select: { id: true, name: true, email: true } },
                showtime: {
                    include: {
                        movie: { select: { id: true, title: true, posterUrl: true } },
                        room: {
                            select: {
                                id: true,
                                name: true,
                                theater: { select: { id: true, name: true, location: true } },
                            },
                        },
                    },
                },
                seats: {
                    include: { seat: { select: { id: true, seatNumber: true } } },
                },
                payment: true,
            },
        });
        if (!booking)
            throw new common_1.NotFoundException(`Booking #${id} không tồn tại`);
        return this.serialize(booking);
    }
    // Lấy booking theo userId
    async findByUser(userId) {
        return this.findAll({ userId });
    }
    // Lấy ghế theo showtime
    async getSeats(showtimeId) {
        const showtime = await this.prisma.showtime.findUnique({
            where: { id: BigInt(showtimeId) },
            include: {
                room: {
                    include: { seats: true }, // bỏ orderBy, sort thủ công bên dưới
                },
                bookings: {
                    where: { status: 'CONFIRMED' },
                    include: { seats: { select: { seatId: true } } },
                },
            },
        });
        if (!showtime)
            return [];
        const bookedSeatIds = showtime.bookings
            .flatMap((b) => b.seats.map((s) => s.seatId.toString()));
        return showtime.room.seats
            .sort((a, b) => {
            const rowA = a.seatNumber.match(/[A-Z]+/)?.[0] ?? '';
            const rowB = b.seatNumber.match(/[A-Z]+/)?.[0] ?? '';
            const numA = parseInt(a.seatNumber.match(/\d+/)?.[0] ?? '0');
            const numB = parseInt(b.seatNumber.match(/\d+/)?.[0] ?? '0');
            return rowA !== rowB ? rowA.localeCompare(rowB) : numA - numB;
        })
            .map((s) => ({
            id: s.seatNumber,
            seatNumber: s.seatNumber,
            status: bookedSeatIds.includes(s.id.toString()) ? 'booked' : 'available',
        }));
    }
    // Xác nhận đặt vé
    async confirmBooking(userId, showtimeId, seatLabels) {
        // 1. Kiểm tra Redis
        for (const seatId of seatLabels) {
            const owner = await this.seatLockService.isSeatLocked(showtimeId, seatId);
            if (!owner)
                throw new common_1.BadRequestException(`Ghế ${seatId} chưa được giữ`);
            if (owner !== String(userId))
                throw new common_1.BadRequestException(`Ghế ${seatId} không thuộc về bạn`);
        }
        // 2. Lấy showtime
        const showtime = await this.prisma.showtime.findUnique({
            where: { id: BigInt(showtimeId) },
        });
        if (!showtime)
            throw new common_1.BadRequestException('Showtime không tồn tại');
        // 3. Lấy seat ids từ seatNumber
        const seats = await this.prisma.seat.findMany({
            where: {
                roomId: showtime.roomId,
                seatNumber: { in: seatLabels },
            },
        });
        if (seats.length !== seatLabels.length) {
            throw new common_1.BadRequestException('Một số ghế không tồn tại trong phòng');
        }
        // 4. Kiểm tra ghế chưa bị booked
        const alreadyBooked = await this.prisma.bookingSeat.findFirst({
            where: {
                seatId: { in: seats.map((s) => s.id) },
                booking: { showtimeId: BigInt(showtimeId), status: 'CONFIRMED' },
            },
        });
        if (alreadyBooked)
            throw new common_1.BadRequestException('Một số ghế đã được đặt');
        // 5. Tạo booking + BookingSeat
        const booking = await this.prisma.booking.create({
            data: {
                userId: BigInt(userId),
                showtimeId: BigInt(showtimeId),
                totalPrice: showtime.price * seatLabels.length,
                status: 'CONFIRMED',
                seats: {
                    create: seats.map((s) => ({ seatId: s.id })),
                },
            },
        });
        // 6. Unlock Redis
        for (const seatLabel of seatLabels) {
            await this.seatLockService.unlockSeat(showtimeId, seatLabel, userId);
        }
        // 7. Notify realtime
        this.bookingGateway.server
            .to(`showtime_${showtimeId}`)
            .emit('seat_booked', { seatIds: seatLabels, userId });
        return {
            bookingId: booking.id.toString(),
            totalPrice: booking.totalPrice,
        };
    }
    // Hủy booking
    async cancel(id, userId) {
        const booking = await this.findOne(id);
        if (booking.userId !== String(userId)) {
            throw new common_1.BadRequestException('Bạn không có quyền hủy booking này');
        }
        if (booking.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Booking đã bị hủy');
        }
        const updated = await this.prisma.booking.update({
            where: { id: BigInt(id) },
            data: { status: 'CANCELLED' },
        });
        return { ...updated, id: updated.id.toString(), message: 'Đã hủy booking' };
    }
    serialize(b) {
        return {
            id: b.id.toString(),
            totalPrice: b.totalPrice,
            status: b.status,
            createdAt: b.createdAt,
            userId: b.userId.toString(),
            showtimeId: b.showtimeId.toString(),
            user: b.user ? { ...b.user, id: b.user.id.toString() } : undefined,
            showtime: b.showtime
                ? {
                    id: b.showtime.id.toString(),
                    startTime: b.showtime.startTime,
                    price: b.showtime.price,
                    movie: b.showtime.movie
                        ? { ...b.showtime.movie, id: b.showtime.movie.id.toString() }
                        : undefined,
                    room: b.showtime.room
                        ? {
                            id: b.showtime.room.id.toString(),
                            name: b.showtime.room.name,
                            theater: b.showtime.room.theater
                                ? { ...b.showtime.room.theater, id: b.showtime.room.theater.id.toString() }
                                : undefined,
                        }
                        : undefined,
                }
                : undefined,
            seats: b.seats
                ? b.seats.map((s) => ({
                    id: s.seat.id.toString(),
                    seatNumber: s.seat.seatNumber,
                }))
                : [],
            payment: b.payment ?? null,
        };
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => booking_gateway_1.BookingGateway))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        seat_lock_service_1.SeatLockService,
        booking_gateway_1.BookingGateway])
], BookingService);
//# sourceMappingURL=booking.service.js.map