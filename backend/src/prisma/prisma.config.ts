// src/database/prisma/prisma.config.ts
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'mysql://root:123456@127.0.0.1:3306/movie_booking',
    },
  },
});