import { Module } from '@nestjs/common';
import { MessagesService } from './chat.service';
import {  ChatGateway } from './chat.gateway';
import { PrismaService } from 'src/prisma.service';
import { PlayerService } from 'src/player/player.service';

@Module({
  providers: [ChatGateway, MessagesService, PrismaService, PlayerService],
})
export class MessagesModule {}
