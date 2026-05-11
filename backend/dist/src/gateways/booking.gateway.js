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
// src/gateways/booking.gateway.ts
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const socket_io_1 = require("socket.io");
const seat_lock_service_1 = require("../modules/bookings/services/seat-lock.service");
const booking_service_1 = require("../modules/bookings/services/booking.service");
let BookingGateway = class BookingGateway {
    constructor(seatLockService, jwtService, bookingService) {
        this.seatLockService = seatLockService;
        this.jwtService = jwtService;
        this.bookingService = bookingService;
    }
    //  Verify JWT khi client connect
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token ||
                client.handshake.headers?.authorization?.replace('Bearer ', '');
            if (!token) {
                client.emit('auth_error', { message: 'Thiếu token' });
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET ?? 'supersecret',
            });
            // ✅ Lưu userId vào socket data để dùng sau
            client.data.userId = Number(payload.sub);
            client.data.role = payload.role;
            console.log(`Client ${client.id} connected — userId=${client.data.userId}`);
        }
        catch {
            client.emit('auth_error', { message: 'Token không hợp lệ' });
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        console.log(`Client ${client.id} disconnected`);
    }
    async handleJoin(client, showtimeId) {
        client.join(`showtime_${showtimeId}`);
        console.log(`Client ${client.id} joined showtime_${showtimeId}`);
        // Gửi lại danh sách ghế đang locked cho client vừa join
        const lockedSeats = await this.seatLockService.getLockedSeats(showtimeId);
        for (const seat of lockedSeats) {
            client.emit('seat_locked', { seatId: seat.seatId, userId: seat.userId });
        }
    }
    async handleSelectSeat(client, data) {
        const showtimeId = Number(data.showtimeId);
        const userId = client.data.userId; // Lấy từ token, không nhận từ client
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
        const userId = client.data.userId; //  Lấy từ token
        const { seatId } = data;
        const success = await this.seatLockService.unlockSeat(showtimeId, seatId, userId);
        if (!success) {
            client.emit('seat_error', { seatId, message: 'Không thể bỏ ghế' });
            return;
        }
        this.server.to(`showtime_${showtimeId}`).emit('seat_unlocked', { seatId });
    }
    async handleConfirmBooking(client, data) {
        const showtimeId = Number(data.showtimeId);
        const userId = client.data.userId; // Lấy từ token
        const { seatIds } = data;
        console.log(`[confirm_booking] showtimeId=${showtimeId} userId=${userId} seatIds=${seatIds}`);
        try {
            const result = await this.bookingService.confirmBooking(userId, showtimeId, seatIds);
            console.log('[confirm_booking] success:', result);
            client.emit('booking_success', { bookingId: result.bookingId, totalPrice: result.totalPrice });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Đặt vé thất bại';
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
    __metadata("design:returntype", Promise)
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
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' } }),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => booking_service_1.BookingService))),
    __metadata("design:paramtypes", [seat_lock_service_1.SeatLockService,
        jwt_1.JwtService,
        booking_service_1.BookingService])
], BookingGateway);
//# sourceMappingURL=booking.gateway.js.map