export declare class GameService {
    private games;
    private queue;
    private PlayersGames;
    newPlayer(user: any): void;
    onUpdate(player: any, position: number): void;
    update(gameId: string): any;
    getAllGames(): any;
    watchGame(gameId: string, userId: string): any;
    leaveGameAsWatcher(gameId: string, userId: string): void;
    leaveGameAsPlayer(gameId: string, userId: string): void;
}
