"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayModule = void 0;
// src/gateways/gateway.module.ts
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const booking_gateway_1 = require("./booking.gateway");
const bookings_module_1 = require("../modules/bookings/bookings.module");
const redis_module_1 = require("../redis/redis.module");
let GatewayModule = class GatewayModule {
};
exports.GatewayModule = GatewayModule;
exports.GatewayModule = GatewayModule = __decorate([
    (0, common_1.Module)({
        imports: [
            redis_module_1.RedisModule,
            (0, common_1.forwardRef)(() => bookings_module_1.BookingsModule),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET ?? 'supersecret',
                signOptions: { expiresIn: '7d' },
            }),
        ],
        providers: [booking_gateway_1.BookingGateway],
        exports: [booking_gateway_1.BookingGateway],
    })
], GatewayModule);
//# sourceMappingURL=gateway.module.js.map