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
exports.ShowtimesController = void 0;
const common_1 = require("@nestjs/common");
const seat_lock_service_1 = require("../../bookings/services/seat-lock.service");
let ShowtimesController = class ShowtimesController {
    constructor(seatLockService) {
        this.seatLockService = seatLockService;
    }
    async getSeats(id) {
        const locked = await this.seatLockService.getLockedSeats(id);
        // fake danh sách ghế
        const seats = [];
        const rows = ['A', 'B', 'C'];
        for (let row of rows) {
            for (let i = 1; i <= 5; i++) {
                const seatId = `${row}${i}`;
                const found = locked.find(s => s.seatId === seatId);
                seats.push({
                    seatId,
                    status: found ? 'locked' : 'available',
                });
            }
        }
        return seats;
    }
};
exports.ShowtimesController = ShowtimesController;
__decorate([
    (0, common_1.Get)(':id/seats'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ShowtimesController.prototype, "getSeats", null);
exports.ShowtimesController = ShowtimesController = __decorate([
    (0, common_1.Controller)('showtimes'),
    __metadata("design:paramtypes", [seat_lock_service_1.SeatLockService])
], ShowtimesController);
//# sourceMappingURL=showtimes.controller.js.map