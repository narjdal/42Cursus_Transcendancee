"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const pong_1 = require("./pong");
const uuid_1 = require("uuid");
let GameService = class GameService {
    constructor() {
        this.games = new Map();
        this.queue = [];
        this.PlayersGames = [];
    }
    newPlayer(user) {
        this.queue.push(user);
        if (this.queue.length === 2) {
            let gameId = (0, uuid_1.v4)();
            const id_1 = this.queue.shift();
            const id_2 = this.queue.shift();
            const game = new pong_1.default(id_1, id_2);
            this.games.set(gameId, game);
            this.PlayersGames[id_2] = gameId;
            this.PlayersGames[id_1] = gameId;
        }
    }
    onUpdate(player, position) {
        const gameId = this.PlayersGames[player];
        const game = this.games.get(gameId);
        if (game) {
            game.onUpdate(player, position);
        }
    }
    update(gameId) {
        const game = this.games.get(gameId);
        if (game) {
            return game.update();
        }
    }
    getAllGames() {
        let games = [];
        this.games.forEach((game, key) => {
            games.push({
                id: key,
                player_left: game.player_left,
                player_right: game.player_right,
            });
        });
        return games;
    }
    watchGame(gameId, userId) {
        const game = this.games.get(gameId);
        if (game) {
            game.spectators.add(userId);
        }
    }
    leaveGameAsWatcher(gameId, userId) {
        const game = this.games.get(gameId);
        if (game) {
            game.spectators.delete(userId);
        }
    }
    leaveGameAsPlayer(gameId, userId) {
        const game = this.games.get(gameId);
        if (game) {
            if (game.player_left.id === userId) {
                this.games.delete(gameId);
            }
            else if (game.player_right.id === userId) {
                this.games.delete(gameId);
            }
        }
    }
};
GameService = __decorate([
    (0, common_1.Injectable)()
], GameService);
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map