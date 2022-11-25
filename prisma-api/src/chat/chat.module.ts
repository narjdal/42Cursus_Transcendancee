import { Module } from '@nestjs/common';
import { MessagesService } from './chat.service';
import { MessagesGateway } from './chat.gateway';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [MessagesGateway, MessagesService, PrismaService]
})
export class MessagesModule {}
