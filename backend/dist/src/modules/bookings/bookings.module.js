"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsModule = void 0;
// src/modules/bookings/bookings.module.ts
const common_1 = require("@nestjs/common");
const booking_controller_1 = require("./controllers/booking.controller");
const booking_service_1 = require("./services/booking.service");
const seat_lock_service_1 = require("./services/seat-lock.service");
const prisma_service_1 = require("../../../prisma/prisma.service");
const redis_module_1 = require("../../redis/redis.module");
const gateway_module_1 = require("../../gateways/gateway.module");
let BookingsModule = class BookingsModule {
};
exports.BookingsModule = BookingsModule;
exports.BookingsModule = BookingsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            redis_module_1.RedisModule,
            (0, common_1.forwardRef)(() => gateway_module_1.GatewayModule),
        ],
        controllers: [booking_controller_1.BookingController],
        providers: [booking_service_1.BookingService, seat_lock_service_1.SeatLockService, prisma_service_1.PrismaService],
        exports: [booking_service_1.BookingService, seat_lock_service_1.SeatLockService],
    })
], BookingsModule);
//# sourceMappingURL=bookings.module.js.map