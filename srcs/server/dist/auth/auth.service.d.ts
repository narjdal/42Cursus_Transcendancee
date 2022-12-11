import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    findORcreate(data: any): Promise<import(".prisma/client").Player>;
    getJwtToken(player: any): Promise<string>;
}
