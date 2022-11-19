import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PlayerService {
    constructor(private prisma: PrismaService) {}

    async findORcreate(data: any) {
    console.log("inside find or create auth player service")

        const player = await this.prisma.player.findUnique({
            where: { nickname: data.nickname }
        });

        if (!player)
            return this.prisma.player.create({
                data :{
                nickname : data.nickname,
                firstName : data.firstName,
                lastName : data.lastName,
                avatar    : data.avatar,
                email: data.email,}
            });
        return player;
    }
}
