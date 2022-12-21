import { Socket } from "socket.io";
import { GameService } from './game.service';
export declare class GameGateway {
    private readonly gameService;
    wss: Socket;
    private roomPrefix;
    private PlayersInQueue;
    private PlayersLoggedIn;
    private PlayersInvited;
    private PlayersAccept;
    private PlayersInGameFromInvite;
    private PlayerInGame;
    private GetPlayerNicknameFromSocket;
    private Invates;
    private InvateId;
    constructor(gameService: GameService);
    handleConnection(client: Socket, ...args: any[]): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleNewPlayer(client: Socket, user: any): Promise<void>;
    handleUpdate(client: Socket, user: any): Promise<void>;
    handleGetAllGames(client: Socket, data: any): Promise<void>;
    handleWatchGame(client: Socket, data: any): Promise<void>;
    handleLeaveGameAsPlayer(client: Socket, data: any): Promise<void>;
    HandleAcceptInviteGame(client: Socket, data: any): Promise<void>;
    HandleAddOnlineGameUsersBack(client: Socket, data: any): Promise<void>;
    handleInviteGame(client: Socket, data: any): Promise<void>;
    HandleUserAcceptGame(client: Socket, data: any): Promise<void>;
    HandleInvitedUser(client: Socket, data: any): Promise<void>;
}
