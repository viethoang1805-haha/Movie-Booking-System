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
exports.ShowtimeController = void 0;
// src/modules/showtimes/controllers/showtime.controller.ts
const common_1 = require("@nestjs/common");
const showtimes_service_1 = require("../../showtimes/services/showtimes.service");
const showtime_dto_1 = require("../dto/showtime.dto");
const public_decorator_1 = require("../../../common/decorators/public.decorator");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
let ShowtimeController = class ShowtimeController {
    constructor(showtimeService) {
        this.showtimeService = showtimeService;
    }
    // GET /showtimes?movieId=1&date=2026-04-20
    findAll(query) {
        return this.showtimeService.findAll(query);
    }
    // GET /showtimes/:id
    findOne(id) {
        return this.showtimeService.findOne(Number(id));
    }
    // GET /showtimes/:id/seats — lấy ghế + trạng thái booked
    getSeats(id) {
        return this.showtimeService.getSeats(Number(id));
    }
    // POST /showtimes
    create(dto) {
        return this.showtimeService.create(dto);
    }
    // PUT /showtimes/:id
    update(id, dto) {
        return this.showtimeService.update(Number(id), dto);
    }
    // DELETE /showtimes/:id
    remove(id) {
        return this.showtimeService.remove(Number(id));
    }
};
exports.ShowtimeController = ShowtimeController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [showtime_dto_1.ShowtimeQueryDto]),
    __metadata("design:returntype", void 0)
], ShowtimeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShowtimeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/seats'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShowtimeController.prototype, "getSeats", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [showtime_dto_1.CreateShowtimeDto]),
    __metadata("design:returntype", void 0)
], ShowtimeController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, showtime_dto_1.UpdateShowtimeDto]),
    __metadata("design:returntype", void 0)
], ShowtimeController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShowtimeController.prototype, "remove", null);
exports.ShowtimeController = ShowtimeController = __decorate([
    (0, common_1.Controller)('showtimes'),
    __metadata("design:paramtypes", [showtimes_service_1.ShowtimeService])
], ShowtimeController);
//# sourceMappingURL=showtimes.controller.js.map