import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,
        private jwtService:JwtService) {}
    
    async findORcreate(data: any) {
        
    console.log("inside find or create auth services")

        const player = await this.prisma.player.findUnique({
            where: { nickname: data.nickname }
        });
    
        if (!player)
        return this.prisma.player.create
        ({
            data :{
                nickname : data.nickname,
                firstName : data.firstName,
                lastName : data.lastName,
                avatar    : data.avatar,
                email: data.email,}
        });

        return player;
    }

    public async getJwtToken(player: any) : Promise<string> {
        return this.jwtService.signAsync(player);
    }
}

