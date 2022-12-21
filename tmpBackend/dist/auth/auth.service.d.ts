import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    findORcreate(data: any): Promise<any>;
    findById(PlayerId: string): Promise<any>;
    generateQrCode(playerId: string): Promise<{
        otpauth_url: any;
    }>;
    JwtAccessToken(playerId: string): Promise<string>;
}
