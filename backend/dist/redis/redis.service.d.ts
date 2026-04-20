import { OnModuleInit } from '@nestjs/common';
export declare class RedisService implements OnModuleInit {
    private client;
    onModuleInit(): void;
    set(key: string, value: any, ttl: number): Promise<"OK">;
    setNX(key: string, value: any, ttl: number): Promise<"OK" | null>;
    get(key: string): Promise<string | null>;
    del(key: string): Promise<number>;
    keys(pattern: string): Promise<string[]>;
}
//# sourceMappingURL=redis.service.d.ts.map