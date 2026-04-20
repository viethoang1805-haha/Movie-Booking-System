"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REDIS_KEYS = void 0;
exports.REDIS_KEYS = {
    SEAT: (showtimeId, seatId) => `seat:${showtimeId}:${seatId}`,
};
//# sourceMappingURL=redis.constants.js.map