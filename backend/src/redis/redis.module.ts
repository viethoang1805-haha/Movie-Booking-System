import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisSubscriber } from './redis.subscriber';
@Module({
  providers: [RedisService, RedisSubscriber],
  exports: [RedisService],
})
export class RedisModule {}