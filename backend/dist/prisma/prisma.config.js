"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
// src/database/prisma/prisma.config.ts
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL || 'mysql://root:123456@127.0.0.1:3306/movie_booking',
        },
    },
});
//# sourceMappingURL=prisma.config.js.map