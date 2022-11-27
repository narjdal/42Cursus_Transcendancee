// import {
//   WebSocketGateway,
//   SubscribeMessage,
//   MessageBody,
//   WebSocketServer,
//   ConnectedSocket,
//   OnGatewayInit,
//   WsResponse,
//   OnGatewayConnection,
//   OnGatewayDisconnect
// } from '@nestjs/websockets';
// import { MessagesService } from './chat.service';
// import { CreateMessageDto } from './dto/create-message.dto';
// import { Server, Socket } from 'socket.io';
// import { arrayBuffer } from 'stream/consumers';
// import { Logger, UseGuards } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
// import { PlayerService } from 'src/player/player.service';
// import { Client } from 'socket.io/dist/client';



//from Chat Project
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
  cors: {
    origin: '*',
  },
})
export class MessagesGateway {
  @WebSocketServer() //Socket.io has already method to emit msg to all clinet
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: CreateMessageDto, @ConnectedSocket() client: Socket, ) {
    const message = await this.messagesService.create(createMessageDto, client.id,);
    
    this.server.emit('message', message);
    
    return message;
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.messagesService.findAll();
  }

  @SubscribeMessage('join')
  joinRoom(
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,) { //ConnectedSocket for msg come from

      return this.messagesService.identify(name, client.id)
  }

  // @SubscribeMessage('typing')
  // async typing(
  //   @MessageBody('isTyping') isTyping: boolean,
  //   @ConnectedSocket() client: Socket,) {
  //     const name = await this.messagesService.getClientName(client.id);

  //     //this.server.emit('message', message); => this emit can inform all clients connected // also the sender can show him self is typing
  //     client.broadcast.emit('typing', {name, isTyping});
  // }
}





// @WebSocketGateway({
//   cors: {
//     origin: '*',
//   },
//   // namespace: 'chat',
//   // transports: ['websocket'],
//   cookie: true,
// })
// export class MessagesGateway  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {


//   // @WebSocketServer() wss: Server;

//   private logger: Logger = new Logger('AppGateway');

//   afterInit(server: Server) {
//     this.logger.log('Initialized!');
//   }

//   handleDisconnect(client: Socket) {
//     this.logger.log(`Client disconnected: ${client.id}`);
//   }
  
//   handleConnection(client: Socket, ...args: any[]) {
//     console.log('client connected', client.handshake.headers);
//     this.logger.log(`Client connected: ${client.id}`);
//     //show the client cockie
//     console.log(client.handshake.headers.cookie);

//   }

//   @SubscribeMessage('MsgToClient') // This is the event name
//   handleMessage(client: Socket, text: string): WsResponse<string> { // void

//     // this.wss.emit('MsgToClient', text); // for all clients
//     // client.emit('MsgToClient', text);
//     return {event: 'msgToClient', data: 'Hello world!'};
//   }

// }


// @UseGuards(AuthGuard('jwt'))
//   @WebSocketGateway({
//     namespace: 'chat',
//     cors: {
//       origin: '*',
//     },
//     // transports: ['websocket'],
//     cookie: true,
//   })
//   export class MessagesGateway {
//     @WebSocketServer() //Socket.io has already method to emit msg to all clinet
//     server: Server;
  
//     constructor(private readonly messagesService: MessagesService,
//     private readonly playerService: PlayerService,) {}
    
//     async handleConnection(client: Socket, ...args: any[]) {  
//       // console.log('client connected', client.id);
//       client.emit('MsgToClient', 'Hello world!');
      
//       // always | validation
//       const user = this.getIdUserFromToken(client.handshake.headers.cookie);
//       if (!user) {
//         return;
//       }

//       // join room

//       const allRooms = await this.playerService.getAllRooms({nickname: user.nickname});
//       console.log('allRooms', allRooms);
//     }
//     handleDisconnect(client: Socket) {
//       console.log('client disconnected', client.id);
//     }


//     @SubscribeMessage('join-room')
//     async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
//       console.log('join-room', data);

//       const user = this.getIdUserFromToken(client.handshake.headers.cookie);
//       if (!user) {
//         return;
//       }

//       client.join(data.roomId);
//     }


//     getIdUserFromToken(cookie: string) {
//       const cookieArray = cookie.split(';');
//       const cookieObject = {};

//       if (cookieArray.length === 0)
//         return null;

//       cookieArray.forEach((cookie) => {
//         const cookieKeyValue = cookie.split('=');
//         cookieObject[cookieKeyValue[0]] = decodeURIComponent(cookieKeyValue[1]);
//       }
//       );

//       // get user id from jwt token
//       const token = cookieObject['auth-cookie'];
//       const tokenArray = token.split('.');
//       const tokenObject = JSON.parse(atob(tokenArray[1]));
      

//       return (tokenObject);
//     }


    // // DM
    // @SubscribeMessage('createMessage')
    // async createMessage(@ConnectedSocket() client: Socket,
    //                     @MessageBody() createMessageDto: CreateMessageDto) {

    //   console.log('createMessageDto', JSON.stringify(createMessageDto));

    //   // insert DM into DB
    //   const result = await this.messagesService.createMessage(createMessageDto);
    //   this.server.emit('message', result);
    // }

  
