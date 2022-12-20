"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const game_service_1 = require("./game.service");
let GameGateway = class GameGateway {
    constructor(gameService) {
        this.gameService = gameService;
        this.roomPrefix = 'roomGameSocket';
        this.PlayersInQueue = [];
        this.PlayersLoggedIn = [];
        this.PlayersInvited = [];
        this.PlayersAccept = [];
        this.PlayersInGameFromInvite = [];
        this.GetPlayerNicknameFromSocket = [];
        this.Invates = [];
        this.InvateId = 0;
    }
    async handleConnection(client, ...args) {
        console.log("Client Game Connected", client.id);
    }
    async handleDisconnect(client) {
        console.log("Client disconnected", client.id);
        if (this.PlayersInQueue[client.id]) {
            await this.handleLeaveGameAsPlayer(client, this.PlayersInQueue[client.id]);
            this.PlayersLoggedIn[this.PlayersInQueue[client.id]] = null;
            this.PlayersInQueue[client.id] = null;
        }
        if (this.PlayersInGameFromInvite[client.id]) {
            await this.handleLeaveGameAsPlayer(client, this.PlayersInGameFromInvite[client.id]);
            console.log("deleting from PlayersInQueue List ! ");
            console.log('-----------------------------------------------');
            const leaver = this.PlayersInGameFromInvite[client.id];
            const parse = JSON.parse(leaver);
            this.PlayersInGameFromInvite[client.id] = null;
            this.PlayersInvited[parse.nickname] = null;
            console.log('-----------------------------------------------');
        }
    }
    async handleNewPlayer(client, user) {
        console.log("newPlayer", client.id, user);
        this.PlayersInQueue[client.id] = user;
        return this.gameService.newPlayer(client, user, this.PlayersInQueue);
    }
    async handleUpdate(client, user) {
        return this.gameService.update(client, user);
    }
    async handleGetAllGames(client, data) {
        console.log("inside get all games ", data);
        return this.gameService.getAllGames(client);
    }
    async handleWatchGame(client, data) {
        console.log("Inside Watch game !", data);
        return this.gameService.watchGame(client, data.user, data.gameId);
    }
    async handleLeaveGameAsPlayer(client, data) {
        console.log('-----------------------------------------------');
        console.log('-----------------------------------------------');
        return this.gameService.leaveGameAsPlayer(client, data);
    }
    async HandleAcceptInviteGame(client, data) {
        this.PlayersInGameFromInvite[client.id] = data.user;
        await this.gameService.acceptInvite(client, data.user, data.sender, this.PlayersInvited, this.PlayersAccept);
        this.PlayersInvited[data.sender] = null;
        const parsed = JSON.parse(data.user);
        const sender = data.sender;
        let inviteeNickname = parsed.nickname;
        console.log('-----------------------------------------------');
        console.log('-----------------------------------------------');
        const obj = {
            invite: inviteeNickname,
            user: sender
        };
        for (var i = 0; i < this.Invates.length; i++) {
            if (this.Invates[i].invite == inviteeNickname && this.Invates[i].user == sender) {
                this.Invates[i] = 0;
            }
        }
        this.PlayersAccept[inviteeNickname] = null;
    }
    async HandleAddOnlineGameUsersBack(client, data) {
        const parsed = JSON.parse(data.user);
        this.PlayersLoggedIn[parsed.nickname] = client;
        const nick = parsed.nickname;
        console.log('-----------------------------------------------');
        const obj = {
            invite: nick
        };
        const text = JSON.stringify(obj);
        for (var i = 0; i < this.Invates.length; i++) {
            if (this.Invates[i].invite == nick) {
                client.emit('ReceivedInvite', {
                    Sendernickname: this.Invates[i].user
                });
            }
        }
        console.log('-----------------------------------------------');
        console.log('-----------------------------------------------');
    }
    async handleInviteGame(client, data) {
        this.PlayersInGameFromInvite[client.id] = data.user;
        console.log("Inside inviteGame  !", data);
        const invite = data.invite;
        const user = JSON.parse(data.user).nickname;
        const obj = {
            invite: invite,
            user: user
        };
        const text = JSON.stringify(obj);
        this.Invates[this.InvateId++] = obj;
        return this.gameService.inviteGame(client, data.user, data.invite, this.PlayersLoggedIn);
    }
    async HandleUserAcceptGame(client, data) {
        const parsed = JSON.parse(data.user);
        this.PlayersAccept[parsed.nickname] = {
            data,
            client
        };
    }
    async HandleInvitedUser(client, data) {
        const parsed = JSON.parse(data.user);
        console.log(" : ", parsed.nickname);
        this.PlayersInvited[parsed.nickname] = {
            data,
            client
        };
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Socket)
], GameGateway.prototype, "wss", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("newPlayer"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleNewPlayer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("update"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("getAllGames"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleGetAllGames", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("watchGame"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleWatchGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("leaveGameAsPlayer"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleLeaveGameAsPlayer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("AcceptGame"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "HandleAcceptInviteGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("OnlineGameUsersBack"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "HandleAddOnlineGameUsersBack", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("inviteGame"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleInviteGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("UserAcceptGame"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "HandleUserAcceptGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("InvitedUser"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "HandleInvitedUser", null);
GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: "game",
        cors: {
            origin: "*",
        },
    }),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameGateway);
exports.GameGateway = GameGateway;
//# sourceMappingURL=game.gateway.js.map