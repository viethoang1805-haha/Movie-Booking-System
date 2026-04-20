import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client!: Redis;

  onModuleInit() {
    this.client = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }

  // ✅ set thường
  async set(key: string, value: any, ttl: number) {
    return this.client.set(key, value, 'EX', ttl);
  }

  // ✅ set NX (dùng cho lock)
  async setNX(key: string, value: any, ttl: number) {
    return this.client.set(key, value, 'EX', ttl, 'NX');
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async del(key: string) {
    return this.client.del(key);
  }

  async keys(pattern: string) {
    return this.client.keys(pattern);
  }
}