import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../../prisma/prisma.service';
import { RegisterDto, LoginDto } from '../dto/auth.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        token: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
        };
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
        };
    }>;
    loginWithGoogle(googleUser: {
        id: string;
        email: string;
        name: string | null;
        role: string;
    }): Promise<{
        token: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
        };
    }>;
    getMe(userId: string): Promise<{
        id: string;
        createdAt: Date;
        name: string | null;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
    private generateToken;
    private serializeUser;
}
//# sourceMappingURL=auth.service.d.ts.map