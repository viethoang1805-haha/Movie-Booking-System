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
exports.SeatLockService = void 0;
const common_1 = require("@nestjs/common");
const redis_service_1 = require("../../../redis/redis.service");
const redis_constants_1 = require("../../../redis/redis.constants");
let SeatLockService = class SeatLockService {
    constructor(redisService) {
        this.redisService = redisService;
    }
    // Lock ghế (atomic - chỉ set nếu chưa tồn tại)
    async lockSeat(showtimeId, seatId, userId) {
        const key = redis_constants_1.REDIS_KEYS.SEAT(showtimeId, seatId);
        const result = await this.redisService.setNX(key, userId, 300);
        console.log(`[lockSeat] key=${key} result=`, result, typeof result); // ← thêm dòng này
        return result === 'OK';
    }
    // Unlock có check owner
    async unlockSeat(showtimeId, seatId, userId) {
        const key = redis_constants_1.REDIS_KEYS.SEAT(showtimeId, seatId);
        const owner = await this.redisService.get(key);
        if (owner === String(userId)) {
            const result = await this.redisService.del(key);
            return result > 0; // Return true if at least one key was deleted
        }
        return false;
    }
    // Trả về userId nếu ghế đang bị lock, null nếu trống
    async isSeatLocked(showtimeId, seatId) {
        const key = redis_constants_1.REDIS_KEYS.SEAT(showtimeId, seatId);
        return await this.redisService.get(key);
    }
    // Lấy danh sách tất cả ghế đang bị lock của 1 showtime
    async getLockedSeats(showtimeId) {
        const keys = await this.redisService.keys(`seat:${showtimeId}:*`);
        const result = [];
        for (const key of keys) {
            const seatId = key.split(':')[2] ?? ''; // Gán giá trị mặc định là chuỗi rỗng nếu undefined
            const userId = await this.redisService.get(key);
            if (userId)
                result.push({ seatId, userId });
        }
        return result;
    }
};
exports.SeatLockService = SeatLockService;
exports.SeatLockService = SeatLockService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], SeatLockService);
//# sourceMappingURL=seat-lock.service.js.map