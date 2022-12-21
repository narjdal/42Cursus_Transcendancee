import { Socket } from 'socket.io';
export declare class GameService {
    private games;
    private queue;
    private PlayersGames;
    private currentGames;
    private invitationArray;
    private invitationGames;
    private prisma;
    private WatchersGames;
    private roomPrefix;
    newPlayer(client: Socket, user: any, PlayersInQueue: any[]): any;
    update(client: Socket, user: any): any;
    getAllGames(client: Socket): any;
    watchGame(client: Socket, user: any, gameId: any): any;
    leaveGameAsWatcher(client: Socket, userId: any): void;
    leaveGameAsPlayer(client: Socket, user: any): void;
    inviteGame(client: Socket, user: any, inviteeNickname: string, PlayersLoggedIn: any[]): void;
    acceptInvite(client: Socket, user: any, inviterNickname: string, PlayersInvited: any[], PlayersAccept: any[]): void;
    gameHistory(data: any): Promise<void>;
    gameAchievements(data: any): Promise<void>;
    findPlayerById(userId: string): Promise<any>;
    findPlayerByNickname(login: string): Promise<any>;
}
