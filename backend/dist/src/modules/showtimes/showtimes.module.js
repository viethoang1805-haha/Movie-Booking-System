"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowtimesModule = void 0;
// src/modules/showtimes/showtimes.module.ts
const common_1 = require("@nestjs/common");
const showtimes_controller_1 = require("../showtimes/controllers/showtimes.controller");
const showtimes_service_1 = require("./services/showtimes.service");
const prisma_service_1 = require("../../../prisma/prisma.service");
let ShowtimesModule = class ShowtimesModule {
};
exports.ShowtimesModule = ShowtimesModule;
exports.ShowtimesModule = ShowtimesModule = __decorate([
    (0, common_1.Module)({
        controllers: [showtimes_controller_1.ShowtimeController],
        providers: [showtimes_service_1.ShowtimeService, prisma_service_1.PrismaService],
        exports: [showtimes_service_1.ShowtimeService],
    })
], ShowtimesModule);
//# sourceMappingURL=showtimes.module.js.map