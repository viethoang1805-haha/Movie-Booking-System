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
exports.BookingGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const seat_lock_service_1 = require("../modules/bookings/services/seat-lock.service");
const booking_service_1 = require("../modules/bookings/services/booking.service");
let BookingGateway = class BookingGateway {
    constructor(seatLockService, bookingService) {
        this.seatLockService = seatLockService;
        this.bookingService = bookingService;
    }
    handleJoin(client, showtimeId) {
        client.join(`showtime_${showtimeId}`);
        console.log(`Client ${client.id} joined showtime_${showtimeId}`);
    }
    async handleSelectSeat(client, data) {
        // ✅ Ép kiểu — dữ liệu từ socket.io có thể bị serialize sai kiểu
        const showtimeId = Number(data.showtimeId);
        const userId = Number(data.userId);
        const { seatId } = data;
        console.log(`[select_seat] showtimeId=${showtimeId} seatId=${seatId} userId=${userId}`);
        const locked = await this.seatLockService.isSeatLocked(showtimeId, seatId);
        if (locked) {
            client.emit('seat_error', { seatId, message: 'Ghế đã có người giữ' });
            return;
        }
        const success = await this.seatLockService.lockSeat(showtimeId, seatId, userId);
        console.log(`[select_seat] lockSeat result=${success}`);
        if (!success) {
            client.emit('seat_error', { seatId, message: 'Không thể giữ ghế, vui lòng thử lại' });
            return;
        }
        this.server.to(`showtime_${showtimeId}`).emit('seat_locked', { seatId, userId });
    }
    async handleUnselectSeat(client, data) {
        const showtimeId = Number(data.showtimeId);
        const userId = Number(data.userId);
        const { seatId } = data;
        const success = await this.seatLockService.unlockSeat(showtimeId, seatId, userId);
        if (!success) {
            client.emit('seat_error', { seatId, message: 'Không thể bỏ ghế (ghế không thuộc về bạn)' });
            return;
        }
        this.server.to(`showtime_${showtimeId}`).emit('seat_unlocked', { seatId });
    }
    async handleConfirmBooking(client, data) {
        // ✅ Ép kiểu
        const showtimeId = Number(data.showtimeId);
        const userId = Number(data.userId);
        const { seatIds } = data;
        console.log(`[confirm_booking] showtimeId=${showtimeId} userId=${userId} seatIds=${seatIds}`);
        try {
            const result = await this.bookingService.confirmBooking(userId, showtimeId, seatIds);
            console.log('[confirm_booking] success:', result);
            client.emit('booking_success', {
                bookingId: result.bookingId,
                totalPrice: result.totalPrice,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Đặt vé thất bại, vui lòng thử lại';
            console.error('[confirm_booking] error:', message);
            client.emit('booking_error', { message });
        }
    }
};
exports.BookingGateway = BookingGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], BookingGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_showtime'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Number]),
    __metadata("design:returntype", void 0)
], BookingGateway.prototype, "handleJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('select_seat'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], BookingGateway.prototype, "handleSelectSeat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unselect_seat'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], BookingGateway.prototype, "handleUnselectSeat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('confirm_booking'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], BookingGateway.prototype, "handleConfirmBooking", null);
exports.BookingGateway = BookingGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
    }),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => booking_service_1.BookingService))),
    __metadata("design:paramtypes", [seat_lock_service_1.SeatLockService,
        booking_service_1.BookingService])
], BookingGateway);
//# sourceMappingURL=booking.gateway.js.map