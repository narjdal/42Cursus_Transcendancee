import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "socket.io";

@WebSocketGateway({
  namespace: "chat",
  cors: {
    origin: "*",
  },
})
export class ChatGateway {
  @WebSocketServer() wss : Socket;

  constructor() {}

  async handleConnection(client: Socket, ...args: any[]) {
    console.log("Client connected", client.id);
  }

  async handleDisconnect(client: Socket) {
    console.log("Client disconnected", client.id);
  }

  @SubscribeMessage("message")
  handleMessage(client: Socket, payload: any): void {
    console.log("Message received", payload);
  }
}
