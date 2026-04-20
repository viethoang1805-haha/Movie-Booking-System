import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../redis/redis.service';
import { REDIS_KEYS } from '../../../redis/redis.constants';
@Injectable()
export class SeatLockService {
  constructor(private readonly redisService: RedisService) {}

  // Lock ghế (atomic - chỉ set nếu chưa tồn tại)
async lockSeat(showtimeId: number, seatId: string, userId: number): Promise<boolean> {
  const key = REDIS_KEYS.SEAT(showtimeId, seatId);
  const result = await this.redisService.setNX(key, userId, 300);
  
  console.log(`[lockSeat] key=${key} result=`, result, typeof result); // ← thêm dòng này
  
  
  return result === 'OK'; 
}
  // Unlock có check owner
  async unlockSeat(showtimeId: number, seatId: string, userId: number): Promise<boolean> {
    const key = REDIS_KEYS.SEAT(showtimeId, seatId);
    const owner = await this.redisService.get(key);

    if (owner === String(userId)) {
      const result = await this.redisService.del(key);
      return result > 0; // Return true if at least one key was deleted
    }

    return false;
  }

  // Trả về userId nếu ghế đang bị lock, null nếu trống
  async isSeatLocked(showtimeId: number, seatId: string): Promise<string | null> {
    const key = REDIS_KEYS.SEAT(showtimeId, seatId);
    return await this.redisService.get(key);
  }

  // Lấy danh sách tất cả ghế đang bị lock của 1 showtime
async getLockedSeats(showtimeId: number): Promise<{ seatId: string; userId: string }[]> {
  const keys = await this.redisService.keys(`seat:${showtimeId}:*`);
  const result: { seatId: string; userId: string }[] = [];

  for (const key of keys) {
    const seatId = key.split(':')[2] ?? '';  // Gán giá trị mặc định là chuỗi rỗng nếu undefined
    const userId = await this.redisService.get(key);
    if (userId) result.push({ seatId, userId });
  }

  return result;
}
}