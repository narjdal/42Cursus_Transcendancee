import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    ConnectedSocket } from '@nestjs/websockets';
  import { MessagesService } from './chat.service';
  import { CreateMessageDto } from './dto/create-message.dto';
  import { Server, Socket } from 'socket.io';
  
  
  @WebSocketGateway({
    // namespace: 'chat',
    cors: {
      origin: '*',
    },
  })
  export class MessagesGateway {
    @WebSocketServer() //Socket.io has already method to emit msg to all clinet
    server: Server;
  
    constructor(private readonly messagesService: MessagesService) {}

    // DM
    @SubscribeMessage('createMessage')
    async createMessage(
        @ConnectedSocket() client: Socket,
        ...args: any[]
    ) {
        // get token
        // args[0].token || client.handshake.headers.authorization

        // get sent DM
        const data = {
            roomId: args[0].roomId,
            senderId: args[0].sender,
            message: args[0].msg,
        }

        // insert DM into DB
        const result = await this.messagesService.createMessage(data);
        console.log('');
        console.log('');
        console.log('');
        console.log(result);
        console.log('');
        console.log('');
        console.log('');
    }
  }
  