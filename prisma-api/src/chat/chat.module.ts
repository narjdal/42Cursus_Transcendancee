import { Module } from '@nestjs/common';
import { MessagesService } from './chat.service';
import { MessagesGateway } from './chat.gateway';
import { PrismaService } from 'src/prisma.service';
import { PlayerService } from 'src/player/player.service';

@Module({
  providers: [MessagesGateway, MessagesService, PrismaService, PlayerService],
})
export class MessagesModule {}
