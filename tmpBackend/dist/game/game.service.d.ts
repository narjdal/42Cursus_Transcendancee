import Pong from './pong';
import { Socket } from 'socket.io';
import { Game } from './entities/game.entity';
export declare class GameService {
    private games;
    private queue;
    private PlayersGames;
    private currentGames;
    private invitationArray;
    private PlayerInGame;
    private invitationGames;
    private prisma;
    private WatchersGames;
    private roomPrefix;
    newPlayer(client: Socket, user: any, PlayersInQueue: any[]): Map<string, Pong>;
    update(client: Socket, user: any): any;
    getAllGames(client: Socket): any;
    watchGame(client: Socket, user: any, gameId: any): any;
    leaveGameAsWatcher(client: Socket, userId: any): void;
    leaveGameAsPlayer(client: Socket, user: any): Map<string, Pong>;
    inviteGame(client: Socket, user: any, inviteeNickname: string, PlayersLoggedIn: any[]): void;
    acceptInvite(client: Socket, user: any, inviterNickname: string, PlayersInvited: any[], PlayersAccept: any[]): Map<string, Game>;
    gameHistory(data: any): Promise<void>;
    gameAchievements(data: any): Promise<void>;
    findPlayerById(userId: string): Promise<import(".prisma/client").Player>;
    findPlayerByNickname(login: string): Promise<import(".prisma/client").Player>;
}
