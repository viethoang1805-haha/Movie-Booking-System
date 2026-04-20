import { Injectable, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisSubscriber implements OnModuleInit {
  private sub = new Redis();

  onModuleInit() {
    // subscribe event expire
    this.sub.psubscribe('__keyevent@0__:expired');

    this.sub.on('pmessage', (pattern, channel, message) => {
      console.log('EXPIRED:', message);
    });
  }
}