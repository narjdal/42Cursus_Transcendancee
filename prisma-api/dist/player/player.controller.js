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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerController = void 0;
const common_1 = require("@nestjs/common");
const player_service_1 = require("./player.service");
const passport_1 = require("@nestjs/passport");
let PlayerController = class PlayerController {
    constructor(playerService) {
        this.playerService = playerService;
    }
    async login(request, response) {
        const profile = await this.playerService.findPlayerById(request.user.id);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(profile);
    }
    async getProfile(nickname, request, response) {
        const profile = await this.playerService.findPlayerByNickname(nickname['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(profile);
    }
    async checkStatusFriendship(login, request, response) {
        const membership = await this.playerService.getFriendshipStatus(request.user.id, login['id']);
        let choices = [];
        if (!membership) {
            choices = ['addFriend'];
        }
        else if (membership && membership.status === "Friend") {
            choices = ['blockFriend'];
        }
        else if (membership && membership.status === "Block" && membership.senderId === request.user.id) {
            choices = ['unblockFriend'];
        }
        else if (membership && membership.status === "Block" && membership.receiverId === request.user.id) {
            choices = ['YourBlocked'];
        }
        else if (membership && membership.status === "Pending" && membership.senderId === request.user.id) {
            choices = ['pendingFriend'];
        }
        else if (membership && membership.status === "Pending" && membership.receiverId === request.user.id) {
            choices = ['acceptFriend', 'refuseFriend'];
        }
        else {
            choices = [''];
        }
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(choices);
    }
    async RequestFriendship(login, request, response) {
        const friend = await this.playerService.createFriendship(request.user.id, login['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send({
            message: "Friendship request sent"
        });
    }
    async AcceptFriendship(login, request, response) {
        const friend = await this.playerService.acceptFriendship(request.user.id, login['id']);
        const room = await this.playerService.getRoomBetweenTwoPlayers(request.user.id, login['id']);
        if (room === null) {
            await this.playerService.createDMRoom(request.user.id, login['id']);
        }
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send({
            message: "Friendship Accepted"
        });
    }
    async RefuseFriendship(login, request, response) {
        const friend = await this.playerService.refuseFriendship(request.user.id, login['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send({
            message: "Friendship refused"
        });
    }
    async BlockFriendship(login, request, response) {
        const friend = await this.playerService.blockFriendship(request.user.id, login['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send({
            message: "Friendship blocked"
        });
    }
    async UnblockFriendship(login, request, response) {
        const friend = await this.playerService.deleteFriendship(request.user.id, login['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send({
            message: "Friendship unblocked"
        });
    }
    async GetListOfFriends(request, response) {
        const friends = await this.playerService.getAllFriends(request.user.id);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(friends);
    }
    async GetListOfMembers(id_room, request, response) {
        const room = await this.playerService.findRoomById(id_room['id']);
        const friends = await this.playerService.getProfilesOfChatRooms(request.user.id, id_room['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(friends);
    }
    async GetListOfAddFriends(id_room, request, response) {
        const room = await this.playerService.findRoomById(id_room['id']);
        const friends = await this.playerService.getListOfFriendsToAddinThisRoom(request.user.id, id_room['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(friends);
    }
    async addMember(login, room, request, response) {
        const admin = await this.playerService.addMember(login['id1'], room['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.send({
            message: "Member added"
        });
    }
    async GetListOfSetAdmin(id_room, request, response) {
        const room = await this.playerService.findRoomById(id_room['id']);
        const friends = await this.playerService.getListOfFriendsToUpgradeAdmininThisRoom(request.user.id, id_room['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(friends);
    }
    async setAdmin(login, room_id, request, response) {
        const room = await this.playerService.findRoomById(room_id['id2']);
        if (room.is_dm === true) {
            throw new common_1.NotFoundException("Is a DM");
        }
        const member = await this.playerService.findPlayerByNickname(login['id1']);
        const status = await this.playerService.getPermissions(member.id, room_id['id2']);
        if (status === null) {
            throw new common_1.NotFoundException("You are not a member of this room");
        }
        if (status.statusMember !== "member" || status.is_banned === true || status.is_muted === true) {
            throw new common_1.NotFoundException("Cannot set this player as Admin");
        }
        const admin = await this.playerService.getPermissions(request.user.id, room_id['id2']);
        if (admin === null) {
            throw new common_1.NotFoundException("You are not a member of this room");
        }
        if (admin.statusMember !== "admin" && admin.statusMember !== "owner") {
            throw new common_1.NotFoundException("You cannot ban this player");
        }
        const result = await this.playerService.setAdmin(login['id1'], room_id['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send({
            message: "Admin set"
        });
    }
    async GetListOfMembersToMute(id_room, request, response) {
        const friends = await this.playerService.getListOfFriendsToMuteinThisRoom(request.user.id, id_room['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(friends);
    }
    async muteMember(login, room_id, request, response) {
        const room = await this.playerService.findRoomById(room_id['id2']);
        if (room.is_dm === true) {
            throw new common_1.NotFoundException("Is a DM");
        }
        const member = await this.playerService.findPlayerByNickname(login['id1']);
        const status = await this.playerService.getPermissions(member.id, room_id['id2']);
        if (status === null) {
            throw new common_1.NotFoundException("You are not a member of this room");
        }
        if (status.statusMember !== "member" || status.is_banned === true || status.is_muted == true) {
            throw new common_1.NotFoundException("Cannot mute this player");
        }
        const admin = await this.playerService.getPermissions(request.user.id, room_id['id2']);
        if (admin === null) {
            throw new common_1.NotFoundException("You are not a member of this room");
        }
        if (admin.statusMember !== "admin" && admin.statusMember !== "owner") {
            throw new common_1.NotFoundException("You cannot mute this player");
        }
        const mute = await this.playerService.muteMember(login['id1'], room_id['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send({
            message: "Member muted"
        });
    }
    async GetListOfMembersToUnmute(id_room, request, response) {
        const friends = await this.playerService.getListOfFriendsToUnmuteinThisRoom(request.user.id, id_room['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(friends);
    }
    async unmuteMember(nickname, room_id, request, response) {
        const room = await this.playerService.findRoomById(room_id['id2']);
        if (room.is_dm === true) {
            throw new common_1.NotFoundException("Is a DM");
        }
        const member = await this.playerService.findPlayerByNickname(nickname['id1']);
        const status = await this.playerService.getPermissions(member.id, room_id['id2']);
        if (status === null) {
            throw new common_1.NotFoundException("You are not a member of this room");
        }
        if (status.statusMember !== "member" || status.is_muted === false) {
            throw new common_1.NotFoundException("Cannot unmute this player");
        }
        const admin = await this.playerService.getPermissions(request.user.id, room_id['id2']);
        if (admin === null) {
            throw new common_1.NotFoundException("You are not a member of this room");
        }
        if (admin.statusMember !== "admin" && admin.statusMember !== "owner") {
            throw new common_1.NotFoundException("You cannot unmute this player");
        }
        const mute = await this.playerService.unmuteMember(nickname['id1'], room_id['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send({
            message: "Member unmuted"
        });
    }
    async GetListOfMembersToBan(id_room, request, response) {
        const friends = await this.playerService.getListOfFriendsToBaninThisRoom(request.user.id, id_room['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(friends);
    }
    async banMember(login, room_id, request, response) {
        const room = await this.playerService.findRoomById(room_id['id2']);
        if (room.is_dm === true) {
            throw new common_1.NotFoundException("Is a DM");
        }
        const member = await this.playerService.findPlayerByNickname(login['id1']);
        const status = await this.playerService.getPermissions(member.id, room_id['id2']);
        if (status === null) {
            throw new common_1.NotFoundException("You are not a member of this room");
        }
        if (status.statusMember !== "member" || status.is_banned === true) {
            throw new common_1.NotFoundException("Cannot ban this player");
        }
        const admin = await this.playerService.getPermissions(request.user.id, room_id['id2']);
        if (admin === null) {
            throw new common_1.NotFoundException("You are not a member of this room");
        }
        if (admin.statusMember !== "admin" && admin.statusMember !== "owner") {
            throw new common_1.NotFoundException("You cannot ban this player");
        }
        const ban = await this.playerService.banMember(login['id1'], room['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send({
            message: "Member banned"
        });
    }
    async kickMember(login, room_id, request, response) {
        const room = await this.playerService.findRoomById(room_id['id2']);
        if (room.is_dm === true) {
            throw new common_1.NotFoundException("It's a DM");
        }
        const kick = await this.playerService.kickMember(login['id1'], room_id['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send({
            message: "Member kicked"
        });
    }
    async GetPermission(id_room, request, response) {
        const permission = await this.playerService.getPermissions(request.user.id, id_room['id']);
        if (permission == null) {
            throw new common_1.NotFoundException("You are not a member of this room");
        }
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(permission);
    }
    async GetListOfRooms(request, response) {
        const rooms = await this.playerService.getAllRooms(request.user.id);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(rooms);
    }
    async CreatePublicChatRoom(Body, String, request, response) {
        const room = await this.playerService.createPublicChatRoom(request.user.id, Body.name);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(room);
    }
    async CreatePrivateChatRoom(Body, String, request, response) {
        const room = await this.playerService.createPrivateChatRoom(request.user.id, Body.name);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(room);
    }
    async CreateProtectedChatRoom(Body, String, request, response) {
        const room = await this.playerService.createProtectedChatRoom(request.user.id, Body.name, Body.password);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(room);
    }
    async GetRoomById(id_room, request, response) {
        const room = await this.playerService.getRoomById(request.user.id, id_room['id']);
        if (room === null) {
            throw new common_1.NotFoundException("No Room exists");
        }
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(room);
    }
    async leaveRoom(room_id, request, response) {
        const room = await this.playerService.findRoomById(room_id['id']);
        if (room.is_dm === true) {
            throw new common_1.NotFoundException("Cannot leave a DM");
        }
        const member = await this.playerService.getPermissions(request.user.id, room_id['id']);
        const leave = await this.playerService.leaveChannel(request.user.id, room_id['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send({
            message: "Room leaved"
        });
    }
    async getMessages(room_id, request, response) {
        const room = await this.playerService.findRoomById(room_id['id']);
        if (!room) {
            throw new common_1.NotFoundException("Room not found");
        }
        const messages = await this.playerService.getMessagesOfRoom(request.user.id, room_id['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        response.status(200).send(messages);
    }
    async joinRoom(room_id, request, response) {
        const room = await this.playerService.findRoomById(room_id['id']);
        if (room.is_dm === true) {
            throw new common_1.NotFoundException("Cannot join a DM");
        }
        if (room.is_public === false) {
            throw new common_1.NotFoundException("cannot join a private room");
        }
        const member = await this.playerService.getPermissions(request.user.id, room_id['id']);
        if (member) {
            throw new common_1.NotFoundException("Already a member");
        }
        const join = await this.playerService.joinRoom(request.user.id, room_id['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        });
        return response.status(200).send({
            message: "Player joined the room successfully"
        });
    }
};
__decorate([
    (0, common_1.Get)('myprofile'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('/profile/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('/statusFriendship/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "checkStatusFriendship", null);
__decorate([
    (0, common_1.Get)('/requestFriendship/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "RequestFriendship", null);
__decorate([
    (0, common_1.Get)('/acceptFriendship/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "AcceptFriendship", null);
__decorate([
    (0, common_1.Get)('/refuseFriendship/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "RefuseFriendship", null);
__decorate([
    (0, common_1.Get)('/blockFriendship/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "BlockFriendship", null);
__decorate([
    (0, common_1.Get)('/unblockFriendship/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "UnblockFriendship", null);
__decorate([
    (0, common_1.Get)('/listOfFriends'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "GetListOfFriends", null);
__decorate([
    (0, common_1.Get)('/listOfMembers/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "GetListOfMembers", null);
__decorate([
    (0, common_1.Get)('/listToAddFriend/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "GetListOfAddFriends", null);
__decorate([
    (0, common_1.Get)('/addMember/:id1/:id2'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "addMember", null);
__decorate([
    (0, common_1.Get)('/listOfSetAdmin/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "GetListOfSetAdmin", null);
__decorate([
    (0, common_1.Get)('/setAdmin/:id1/:id2'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "setAdmin", null);
__decorate([
    (0, common_1.Get)('/listToMute/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "GetListOfMembersToMute", null);
__decorate([
    (0, common_1.Get)('/muteMember/:id1/:id2'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "muteMember", null);
__decorate([
    (0, common_1.Get)('/listOfUnmute/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "GetListOfMembersToUnmute", null);
__decorate([
    (0, common_1.Get)('/unmuteMember/:id1/:id2'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "unmuteMember", null);
__decorate([
    (0, common_1.Get)('/listToBan/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "GetListOfMembersToBan", null);
__decorate([
    (0, common_1.Get)('/banMember/:id1/:id2'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "banMember", null);
__decorate([
    (0, common_1.Get)('/kickMember/:id1/:id2'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "kickMember", null);
__decorate([
    (0, common_1.Get)('/Permission/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "GetPermission", null);
__decorate([
    (0, common_1.Get)('/listOfRooms'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "GetListOfRooms", null);
__decorate([
    (0, common_1.Post)('/createChatRoom/Public'),
    __param(0, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "CreatePublicChatRoom", null);
__decorate([
    (0, common_1.Post)('/createChatRoom/Private'),
    __param(0, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "CreatePrivateChatRoom", null);
__decorate([
    (0, common_1.Post)('/createChatRoom/Protected'),
    __param(0, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "CreateProtectedChatRoom", null);
__decorate([
    (0, common_1.Get)('/GetRoomById/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "GetRoomById", null);
__decorate([
    (0, common_1.Get)('/leaveRoom/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "leaveRoom", null);
__decorate([
    (0, common_1.Get)('/getmessages/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Get)('/joinRoom/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "joinRoom", null);
PlayerController = __decorate([
    (0, common_1.Controller)('player'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [player_service_1.PlayerService])
], PlayerController);
exports.PlayerController = PlayerController;
//# sourceMappingURL=player.controller.js.map