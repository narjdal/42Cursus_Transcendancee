import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  // const data = {
  //     room: ,
  //     user: ,
  //     message: ,
  // }
  async createMessage(data: CreateMessageDto) {

    // user exists
    const userExists = await this.prisma.player.findUnique({
      where: {
        id: data.senderId,
      },
    });
    if (!userExists) {
      return {
        error: 'User does not exist',
      };
      // throw new Error('User does not exist');
    }

    // room exists
    const roomExists = await this.prisma.chatRoom.findUnique({
      where: {
        id: data.roomId,
      },
    });
    if (!roomExists) {
      return {
        error: 'Room does not exist',
      };
    }

    return this.prisma.message.create({
      data: {
        senderId: data.senderId,
        roomId: data.roomId,
        msg: data.message
      },
    });
  }
}
