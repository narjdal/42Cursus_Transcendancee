import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "socket.io";

//get the client id by jwt token
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma.service";
import { PlayerService } from "src/player/player.service";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


function getIdUserFromToken(cookie: string) {

	if (!cookie) {
		// if the user not connected with intranet return null
		return null;
	}
	const cookieArray = cookie.split(';');
	const cookieObject = {};

	if (cookieArray.length === 0)
		return null;

	cookieArray.forEach((cookie) => {
		const cookieKeyValue = cookie.split('=');
		cookieObject[cookieKeyValue[0]] = decodeURIComponent(cookieKeyValue[1]);
	}
	);

	// get user id from jwt token
	const token = cookieObject['auth-cookie'];
	const tokenArray = token.split('.');
	const tokenObject = JSON.parse(atob(tokenArray[1]));

	return (tokenObject);
}

//

// @UseGuards(AuthGuard('jwt'))
@WebSocketGateway({
	namespace: "chat",
	cors: {
		origin: "*",
	},
})
export class ChatGateway {
	@WebSocketServer() wss: Socket;

	constructor(private readonly playerservice: PlayerService) { }

	async handleConnection(client: Socket, ...args: any[]) {
		console.log("Client connected", client.id);

		let userLog = getIdUserFromToken(client.handshake.headers.cookie)

		// discconnect socket
		// if(!userLog){
		//   this.wss.to(client.id).emit("EventAlmerdi", "You are not connected");
		//   client.disconnect(); 
		//   return;
		// }
		userLog = { id: 1, nickname: "mlabrayj" }


		const allrooms = await this.playerservice.getAllRooms(userLog);
		let allmsgs = [];

		// room
		for (let room of allrooms) {
			let roomId = 'roomSocket' + room.id;
			client.join(roomId);

			const msgofroom = await this.playerservice.getMessagesOfRoom(userLog, room.id);

			allmsgs.push({
				...room,
				messages: msgofroom,
			});
		}

		console.log('ALL MSGS', allmsgs[0]);

		this.wss.to(client.id).emit("La7sen", allmsgs);
	}


	@SubscribeMessage("dm")
	handleMessage2(client: Socket, data: any): void {
		console.log("Message received", data);

		let roomId = 'roomSocket';
		this.wss.to(roomId).emit("EventAlmerdi", data);
	}

	@SubscribeMessage("message")
	handleMessage(client: Socket, payload: any): void {
		console.log("Message received", payload);
		this.wss.to(client.id).emit("EventAlmerdi", payload);
	}

	async handleDisconnect(client: Socket) {
		console.log("Client disconnected", client.id);
	}
}
