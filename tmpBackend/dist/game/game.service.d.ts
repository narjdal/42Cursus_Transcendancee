import { Socket } from 'socket.io';
export declare class GameService {
    private games;
    private queue;
    private PlayersGames;
    private currentGames;
    private WatchersGames;
    private roomPrefix;
    newPlayer(client: Socket, user: any): any;
    update(client: Socket, user: any): any;
    getAllGames(client: Socket): any;
    watchGame(client: Socket, user: any, gameId: any): any;
    leaveGameAsPlayer(client: Socket, user: any): void;
}
