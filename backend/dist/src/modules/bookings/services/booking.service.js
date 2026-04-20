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
const common_1 = require("@nestjs/common");
const seat_lock_service_1 = require("./seat-lock.service");
const booking_gateway_1 = require("../../../gateways/booking.gateway");
const prisma_service_1 = require("../../../../prisma/prisma.service");
let BookingService = class BookingService {
    constructor(prisma, seatLockService, bookingGateway) {
        this.prisma = prisma;
        this.seatLockService = seatLockService;
        this.bookingGateway = bookingGateway;
    }
    async confirmBooking(userId, showtimeId, seatLabels) {
        // 1. Kiểm tra Redis
        for (const seatId of seatLabels) {
            const owner = await this.seatLockService.isSeatLocked(showtimeId, seatId);
            if (!owner)
                throw new common_1.BadRequestException(`Ghế ${seatId} chưa được giữ`);
            if (owner !== String(userId))
                throw new common_1.BadRequestException(`Ghế ${seatId} không thuộc về bạn`);
        }
        // 2. Lấy showtime + room
        const showtime = await this.prisma.showtime.findUnique({
            where: { id: BigInt(showtimeId) },
        });
        if (!showtime)
            throw new common_1.BadRequestException('Showtime không tồn tại');
        // 3. Lấy seat ids từ seatNumber (A1, A2...)
        const seats = await this.prisma.seat.findMany({
            where: {
                roomId: showtime.roomId,
                seatNumber: { in: seatLabels },
            },
        });
        if (seats.length !== seatLabels.length) {
            throw new common_1.BadRequestException('Một số ghế không tồn tại trong phòng');
        }
        // 4. Tạo booking + BookingSeat
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
        // 5. Unlock Redis
        for (const seatLabel of seatLabels) {
            await this.seatLockService.unlockSeat(showtimeId, seatLabel, userId);
        }
        // 6. Notify realtime
        this.bookingGateway.server
            .to(`showtime_${showtimeId}`)
            .emit('seat_booked', { seatIds: seatLabels, userId });
        return {
            bookingId: booking.id.toString(),
            totalPrice: booking.totalPrice,
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