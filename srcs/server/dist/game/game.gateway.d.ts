import { Socket } from "socket.io";
import { GameService } from './game.service';
import { PlayerService } from "src/player/player.service";
export declare class GameGateway {
    private readonly gameService;
    private readonly playerservice;
    wss: Socket;
    constructor(gameService: GameService, playerservice: PlayerService);
    handleConnection(client: Socket, ...args: any[]): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleNewPlayer(client: Socket, data: any): Promise<void>;
    handleOnUpdate(client: Socket, data: any): Promise<void>;
    handleJoinRoom(client: Socket, data: any): Promise<void>;
}
