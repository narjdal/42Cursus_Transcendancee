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
const uuid_1 = require("uuid");
const socket_io_1 = require("socket.io");
let GameService = class GameService {
    constructor() {
        this.games = new Map();
        this.queue = [];
        this.PlayersGames = [];
        this.WatchersGames = [];
        this.roomPrefix = 'roomGameSocket';
    }
    newPlayer(client, user) {
        this.queue.push({ user: user, client: socket_io_1.Socket });
        if (this.queue.length === 2) {
            let gameId = (0, uuid_1.v4)();
        }
        return { client: client, user: user };
    }
};
GameService = __decorate([
    (0, common_1.Injectable)()
], GameService);
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map