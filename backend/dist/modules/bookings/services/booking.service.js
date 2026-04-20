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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const seat_lock_service_1 = require("./seat-lock.service");
const booking_gateway_1 = require("../../../gateways/booking.gateway");
const db_1 = __importDefault(require("../../../config/db"));
let BookingService = class BookingService {
    constructor(seatLockService, bookingGateway) {
        this.seatLockService = seatLockService;
        this.bookingGateway = bookingGateway;
    }
    async confirmBooking(userId, showtimeId, seats) {
        const conn = await db_1.default.getConnection();
        try {
            await conn.beginTransaction();
            // 1. Kiểm tra Redis — tất cả ghế phải thuộc userId này
            for (const seatId of seats) {
                const owner = await this.seatLockService.isSeatLocked(showtimeId, seatId);
                if (!owner) {
                    throw new common_1.BadRequestException(`Ghế ${seatId} chưa được giữ`);
                }
                if (owner !== String(userId)) {
                    throw new common_1.BadRequestException(`Ghế ${seatId} không thuộc về bạn`);
                }
            }
            // 2. Lấy giá showtime
            const [rows] = await conn.query('SELECT price FROM Showtime WHERE id = ?', [showtimeId]);
            if (!rows.length) {
                throw new common_1.BadRequestException('Showtime không tồn tại');
            }
            const price = rows[0].price;
            const totalPrice = price * seats.length;
            // 3. Tạo booking
            const [result] = await conn.query(`INSERT INTO Booking (user_id, showtime_id, total_price, status)
         VALUES (?, ?, ?, 'CONFIRMED')`, [userId, showtimeId, totalPrice]);
            const bookingId = result.insertId;
            // 4. Insert từng ghế vào Booking_Seats + unlock Redis
            for (const seatId of seats) {
                await conn.query(`INSERT INTO Booking_Seat (booking_id, seat_id) VALUES (?, ?)`, [bookingId, seatId]);
                await this.seatLockService.unlockSeat(showtimeId, seatId, userId);
            }
            await conn.commit();
            // 5. Notify realtime cho tất cả client trong phòng — ghế chuyển sang "booked"
            this.bookingGateway.server
                .to(`showtime_${showtimeId}`)
                .emit('seat_booked', { seatIds: seats, userId });
            return { bookingId, totalPrice };
        }
        catch (err) {
            await conn.rollback();
            throw err;
        }
        finally {
            conn.release();
        }
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => booking_gateway_1.BookingGateway))),
    __metadata("design:paramtypes", [seat_lock_service_1.SeatLockService,
        booking_gateway_1.BookingGateway])
], BookingService);
//# sourceMappingURL=booking.service.js.map