import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    ConnectedSocket } from '@nestjs/websockets';
  import { MessagesService } from './chat.service';
  import { CreateMessageDto } from './dto/create-message.dto';
  import { Server, Socket } from 'socket.io';
import { arrayBuffer } from 'stream/consumers';
  
  
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
        @MessageBody() createMessageDto: CreateMessageDto,
    ) {
        // get token
        // args[0].token || client.handshake.headers.authorization

        // insert DM into DB
        const result = await this.messagesService.createMessage(createMessageDto);
        console.log('');
        console.log('');
        console.log('');
        console.log(result);
        console.log('');
        console.log('');
        console.log('');
        this.server.emit('message', result);
    }

    // @SubscribeMessage('createMessage')

    handleConnection(client: Socket, ...args: any[]) {
        console.log('client connected');

    }
  }
  