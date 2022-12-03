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
exports.PlayerService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt_1 = require("bcrypt");
const prisma_service_1 = require("../prisma.service");
let PlayerService = class PlayerService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findPlayerById(userId) {
        if (!userId) {
            throw new common_1.NotFoundException('User Id is required');
        }
        const player = await this.prisma.player.findUnique({
            where: {
                id: userId,
            }
        });
        if (!player) {
            throw new common_1.NotFoundException("User Id is not found");
        }
        return player;
    }
    async findPlayerByNickname(login) {
        const player = await this.prisma.player.findUnique({
            where: {
                nickname: login
            }
        });
        if (!player) {
            throw new common_1.NotFoundException('Profile not found');
        }
        return player;
    }
    async findRoomById(roomId) {
        const room = await this.prisma.chatRoom.findUnique({
            where: {
                id: roomId,
            }
        });
        if (!room) {
            throw new common_1.NotFoundException("room not found");
        }
        return room;
    }
    async getRoomBetweenTwoPlayers(useId, login) {
        const friend = await this.prisma.player.findUnique({
            where: {
                nickname: login
            }
        });
        if (!friend) {
            throw new common_1.NotFoundException('Profile not found');
        }
        const room = await this.prisma.chatRoom.findFirst({
            where: {
                is_dm: true,
                AND: [
                    {
                        all_members: {
                            some: {
                                playerId: useId,
                            }
                        }
                    },
                    {
                        all_members: {
                            some: {
                                playerId: friend.id,
                            }
                        }
                    },
                ]
            },
        });
        return room;
    }
    async getAllRooms(userId) {
        const rooms = await this.prisma.chatRoom.findMany({
            where: {
                OR: [
                    {
                        all_members: {
                            some: {
                                playerId: userId
                            }
                        },
                    },
                    {
                        is_public: true,
                    },
                    {
                        is_protected: true,
                    },
                ],
            },
            include: {
                all_members: {
                    include: {
                        player: {
                            select: {
                                nickname: true,
                            }
                        },
                    }
                }
            }
        });
        return rooms.map(room => {
            var _a;
            if (room.is_dm === true) {
                room.name = (_a = room.all_members.find(e => e.playerId !== userId)) === null || _a === void 0 ? void 0 : _a.player.nickname;
            }
            return {
                id: room.id,
                name: room.name,
                is_dm: room.is_dm,
                is_public: room.is_public,
                is_private: room.is_private,
                is_protected: room.is_protected,
            };
        });
    }
    async getFriendshipStatus(userId, login) {
        const friend = await this.prisma.player.findUnique({
            where: {
                nickname: login
            }
        });
        if (!friend) {
            throw new common_1.NotFoundException('Profile not found');
        }
        const friendship = await this.prisma.friendship.findFirst({
            where: {
                OR: [
                    {
                        senderId: userId,
                        receiverId: friend.id,
                    },
                    {
                        senderId: friend.id,
                        receiverId: userId,
                    }
                ],
            },
        });
        return friendship;
    }
    async getFriendships(userId) {
        const me = await this.findPlayerById(userId);
        const friends = await this.prisma.friendship.findMany({
            where: {
                OR: [
                    {
                        senderId: me.id,
                        status: "Friend",
                    },
                    {
                        receiverId: me.id,
                        status: "Friend",
                    }
                ]
            },
        });
        const friendsId = friends.map(user => {
            if (user.receiverId == me.id)
                return user.senderId;
            return user.receiverId;
        });
        return friendsId;
    }
    async getAllFriends(userId) {
        const friendsId = await this.getFriendships(userId);
        const friends = await this.prisma.player.findMany({
            where: {
                id: {
                    in: friendsId,
                },
            },
            select: {
                id: true,
                nickname: true,
                avatar: true,
            }
        });
        return friends;
    }
    async getProfilesOfChatRooms(userId, room_id) {
        const status = await this.getPermissions(userId, room_id);
        if (!status) {
            throw new common_1.NotFoundException("You are not member of this room");
        }
        const members = await this.prisma.chatRoom.findUnique({
            where: {
                id: room_id
            },
            include: {
                all_members: {
                    where: {
                        playerId: {
                            not: userId,
                        }
                    },
                    include: {
                        player: {
                            select: {
                                nickname: true,
                                avatar: true,
                                id: true,
                            }
                        },
                    }
                }
            },
        });
        return members.all_members.map(member => {
            return {
                id: member.playerId,
                nickname: member.player.nickname,
                avatar: member.player.avatar,
            };
        });
    }
    async getAllMembersOfThisRoom(userId, room_id) {
        const ids = await this.prisma.chatRoom.findUnique({
            where: {
                id: room_id
            },
            select: {
                all_members: {
                    select: {
                        playerId: true
                    },
                    where: {
                        playerId: {
                            not: userId
                        },
                    },
                },
            },
        });
        return ids.all_members.map(user => user.playerId);
    }
    async getListOfFriendsToAddinThisRoom(userId, room_id) {
        const status = await this.getPermissions(userId, room_id);
        if (!status) {
            throw new common_1.NotFoundException("You are not member of this room");
        }
        const membersId = await this.getAllMembersOfThisRoom(userId, room_id);
        const friendships = await this.prisma.friendship.findMany({
            where: {
                OR: [
                    {
                        senderId: userId,
                        status: "Friend",
                        NOT: {
                            receiverId: {
                                in: membersId,
                            },
                        },
                    },
                    {
                        receiverId: userId,
                        status: "Friend",
                        NOT: {
                            senderId: {
                                in: membersId,
                            },
                        },
                    }
                ]
            },
        });
        const friendsId = friendships.map(user => {
            if (user.receiverId == userId)
                return user.senderId;
            return user.receiverId;
        });
        const listFriendsToadd = await this.prisma.player.findMany({
            where: {
                id: {
                    in: friendsId,
                },
            },
            select: {
                nickname: true,
                avatar: true,
            }
        });
        return listFriendsToadd;
    }
    async getListOfFriendsToUpgradeAdmininThisRoom(userId, room_id) {
        const me = await this.findPlayerById(userId);
        const room = await this.prisma.chatRoom.findFirst({
            where: {
                id: room_id
            },
            select: {
                all_members: {
                    select: {
                        playerId: true
                    },
                    where: {
                        AND: [
                            {
                                playerId: {
                                    not: me.id
                                },
                            },
                            {
                                statusMember: "member"
                            },
                            {
                                is_banned: false,
                            },
                            {
                                is_muted: false,
                            }
                        ],
                    },
                },
            },
        });
        return room.all_members.map(user => user.playerId);
    }
    async getListOfFriendsToMuteinThisRoom(userId, room_id) {
        const me = await this.findPlayerById(userId);
        const room = await this.prisma.chatRoom.findFirst({
            where: {
                id: room_id
            },
            select: {
                all_members: {
                    select: {
                        playerId: true
                    },
                    where: {
                        AND: [
                            {
                                playerId: {
                                    not: me.id
                                },
                            },
                            {
                                statusMember: "member"
                            },
                            {
                                is_banned: false,
                            },
                            {
                                is_muted: false,
                            }
                        ],
                    },
                },
            },
        });
        return room.all_members.map(user => user.playerId);
    }
    async getListOfFriendsToUnmuteinThisRoom(userId, room_id) {
        const me = await this.findPlayerById(userId);
        const room = await this.prisma.chatRoom.findFirst({
            where: {
                id: room_id
            },
            select: {
                all_members: {
                    select: {
                        playerId: true
                    },
                    where: {
                        AND: [
                            {
                                playerId: {
                                    not: me.id
                                },
                            },
                            {
                                statusMember: "member"
                            },
                            {
                                is_banned: false,
                            },
                            {
                                is_muted: true,
                            }
                        ],
                    },
                },
            },
        });
        return room.all_members.map(user => user.playerId);
    }
    async getListOfFriendsToBaninThisRoom(userId, room_id) {
        const me = await this.findPlayerById(userId);
        const room = await this.prisma.chatRoom.findFirst({
            where: {
                id: room_id,
            },
            select: {
                all_members: {
                    select: {
                        playerId: true
                    },
                    where: {
                        AND: [
                            {
                                playerId: {
                                    not: me.id
                                },
                            },
                            {
                                statusMember: "member"
                            },
                            {
                                is_banned: false,
                            },
                            {
                                is_muted: false,
                            }
                        ],
                    },
                },
            },
        });
        return room.all_members.map(user => user.playerId);
    }
    async createFriendship(userId, friendname) {
        const receiver = await this.prisma.player.findUnique({
            where: { nickname: friendname }
        });
        if (!receiver) {
            throw new common_1.NotFoundException("Nickname not found");
        }
        const friends = await this.prisma.friendship.create({
            data: {
                senderId: userId,
                receiverId: receiver.id,
                status: "Pending"
            }
        });
    }
    async acceptFriendship(userId, friendname) {
        const me = await this.findPlayerById(userId);
        const howa = await this.prisma.player.findUnique({
            where: { nickname: friendname },
        });
        if (!howa) {
            throw new common_1.NotFoundException("Nickname not found");
        }
        const ad = await this.prisma.friendship.findUnique({
            where: {
                senderId_receiverId: {
                    senderId: howa.id,
                    receiverId: me.id
                }
            },
        });
        if (!ad)
            throw new common_1.NotFoundException("Request not found");
        const friendship = await this.prisma.friendship.update({
            where: {
                senderId_receiverId: {
                    senderId: howa.id,
                    receiverId: me.id
                }
            },
            data: {
                status: "Friend"
            }
        });
        return friendship;
    }
    async blockFriendship(userId, friendname) {
        const howa = await this.prisma.player.findUnique({
            where: { nickname: friendname },
        });
        if (!howa) {
            throw new common_1.NotFoundException("Profile not found");
        }
        const status = await this.getFriendshipStatus(userId, friendname);
        if (!status) {
            const friendship = await this.prisma.friendship.create({
                data: {
                    senderId: userId,
                    receiverId: howa.id,
                    status: "Blocked"
                }
            });
        }
        else {
            const friendship = await this.prisma.friendship.updateMany({
                where: {
                    OR: [
                        {
                            senderId: userId,
                            receiverId: howa.id,
                        },
                        {
                            senderId: howa.id,
                            receiverId: userId,
                        }
                    ]
                },
                data: {
                    status: "Block",
                    senderId: userId,
                    receiverId: howa.id,
                },
            });
        }
    }
    async deleteFriendship(userId, friendname) {
        const me = await this.findPlayerById(userId);
        const howa = await this.prisma.player.findUnique({
            where: { nickname: friendname },
        });
        if (!howa) {
            throw new common_1.NotFoundException("Profile not found");
        }
        const friendship = await this.prisma.friendship.delete({
            where: {
                senderId_receiverId: {
                    senderId: me.id,
                    receiverId: howa.id
                }
            },
        });
    }
    async refuseFriendship(userId, friendname) {
        const me = await this.findPlayerById(userId);
        const howa = await this.prisma.player.findUnique({
            where: { nickname: friendname },
        });
        if (!howa) {
            throw new common_1.NotFoundException("Profile not found");
        }
        const friendship = await this.prisma.friendship.delete({
            where: {
                senderId_receiverId: {
                    senderId: howa.id,
                    receiverId: me.id
                }
            },
        });
    }
    async getRoomById(userId, room_id) {
        const room = await this.prisma.chatRoom.findFirst({
            where: {
                id: room_id,
            },
            select: {
                name: true,
                is_dm: true,
                is_public: true,
                is_private: true,
                is_protected: true,
                all_members: {
                    select: {
                        player: {
                            select: {
                                nickname: true,
                                id: true,
                            }
                        },
                    },
                },
            },
        });
        return room;
    }
    async createPublicChatRoom(userId, nameOfRoom) {
        const room = await this.prisma.chatRoom.create({
            data: {
                is_dm: false,
                is_public: true,
                name: nameOfRoom,
                all_members: {
                    create: [
                        {
                            statusMember: "owner",
                            muted_until: new Date(),
                            blocked_since: new Date(),
                            playerId: userId
                        },
                    ],
                },
            },
        });
        return room;
    }
    async createPrivateChatRoom(userId, nameOfRoom) {
        const room = await this.prisma.chatRoom.create({
            data: {
                is_dm: false,
                is_private: true,
                name: nameOfRoom,
                all_members: {
                    create: [
                        {
                            statusMember: "owner",
                            muted_until: new Date(),
                            blocked_since: new Date(),
                            playerId: userId,
                        },
                    ],
                },
            },
        });
        return room;
    }
    async createProtectedChatRoom(userId, Body) {
        const room = await this.prisma.chatRoom.create({
            data: {
                is_dm: false,
                name: Body.name,
                is_protected: true,
                password: await (0, bcrypt_1.hash)(Body.pwd, 10),
                all_members: {
                    create: [
                        {
                            statusMember: "owner",
                            muted_until: new Date(),
                            blocked_since: new Date(),
                            playerId: userId,
                        },
                    ],
                },
            },
        });
        return room;
    }
    async DeletePwdToProtectedChatRoom(userId, room_id) {
        const room = await this.prisma.chatRoom.findFirst({
            where: {
                id: room_id,
                is_protected: true,
            },
            select: {
                id: true,
                name: true,
                is_dm: true,
                is_public: true,
                is_private: true,
                is_protected: true,
            }
        });
        if (!room) {
            throw new common_1.NotFoundException("Room not found");
        }
        const permision = await this.prisma.permission.findFirst({
            where: {
                playerId: userId,
                roomId: room_id,
                statusMember: "owner",
            },
        });
        if (!permision) {
            throw new common_1.NotFoundException("You are not the owner of this room");
        }
        const roomUpdated = await this.prisma.chatRoom.update({
            where: {
                id: room_id,
            },
            data: {
                is_protected: false,
                is_public: true,
                password: null,
            },
        });
        return roomUpdated;
    }
    async SetPwdToPublicChatRoom(userId, Body) {
        const room = await this.prisma.chatRoom.findFirst({
            where: {
                id: Body.room_id,
                is_private: true,
            },
            select: {
                id: true,
                name: true,
                is_dm: true,
                is_public: true,
                is_private: true,
                is_protected: true,
            }
        });
        if (!room) {
            throw new common_1.NotFoundException("Room not found");
        }
        const permision = await this.prisma.permission.findFirst({
            where: {
                playerId: userId,
                roomId: Body.room_id,
                statusMember: "owner",
            },
        });
        if (!permision) {
            throw new common_1.NotFoundException("You are not the owner of this room");
        }
        const roomUpdated = await this.prisma.chatRoom.update({
            where: {
                id: Body.room_id,
            },
            data: {
                is_protected: true,
                is_public: false,
                password: (0, bcrypt_1.hash)(Body.pwd, 10),
            },
        });
        return roomUpdated;
    }
    async UpdatePwdProtectedChatRoom(userId, Body) {
        const room = await this.prisma.chatRoom.findFirst({
            where: {
                id: Body.room_id,
                is_protected: true,
            },
            select: {
                id: true,
                name: true,
                is_dm: true,
                is_public: true,
                is_private: true,
                is_protected: true,
            }
        });
        if (!room) {
            throw new common_1.NotFoundException("Room not found");
        }
        const permision = await this.prisma.permission.findFirst({
            where: {
                playerId: userId,
                roomId: Body.room_id,
                statusMember: "owner",
            },
        });
        if (!permision) {
            throw new common_1.NotFoundException("You are not the owner of this room");
        }
        const roomUpdated = await this.prisma.chatRoom.update({
            where: {
                id: Body.room_id,
            },
            data: {
                password: await (0, bcrypt_1.hash)(Body.new_password, 10),
            },
        });
        return roomUpdated;
    }
    async createDMRoom(userId, friendname) {
        const receiver = await this.prisma.player.findUnique({
            where: { nickname: friendname }
        });
        const room = await this.prisma.chatRoom.create({
            data: {
                name: friendname,
                all_members: {
                    create: [
                        {
                            statusMember: "member",
                            muted_until: new Date(),
                            blocked_since: new Date(),
                            playerId: userId,
                        },
                        {
                            statusMember: "member",
                            muted_until: new Date(),
                            blocked_since: new Date(),
                            playerId: receiver.id
                        },
                    ],
                },
            },
        });
        return room;
    }
    async getPermissions(userId, id_room) {
        const status = await this.prisma.permission.findFirst({
            where: {
                AND: [
                    { playerId: userId },
                    { roomId: id_room },
                ]
            },
            select: {
                statusMember: true,
                is_banned: true,
                is_muted: true,
            }
        });
        return status;
    }
    async getMessagesOfRoom(userId, id_room) {
        const status = await this.prisma.permission.findFirst({
            where: {
                AND: [
                    { playerId: userId },
                    { roomId: id_room },
                ]
            }
        });
        if (status === null) {
            throw new common_1.NotFoundException("You can not a get a msgs of this room bcuz you are not member");
        }
        const blocked_list = await this.prisma.friendship.findMany({
            where: {
                AND: [
                    { status: "block" },
                    {
                        OR: [
                            {
                                senderId: userId,
                            },
                            {
                                receiverId: userId,
                            },
                        ]
                    },
                ],
            }
        });
        const blockedId = blocked_list.map(user => {
            if (user.receiverId == userId)
                return user.senderId;
            return user.receiverId;
        });
        if (status.is_banned) {
            const result = await this.prisma.message.findMany({
                where: {
                    AND: [
                        {
                            roomId: id_room,
                        },
                        {
                            NOT: {
                                senderId: {
                                    in: blockedId
                                },
                            },
                        },
                        {
                            createdAt: {
                                lte: status.blocked_since,
                            }
                        },
                    ],
                },
                orderBy: {
                    createdAt: 'asc',
                },
                select: {
                    sender: {
                        select: {
                            id: true,
                            nickname: true,
                            avatar: true,
                        }
                    },
                    msg: true,
                    senderId: true,
                    createdAt: true,
                },
            });
        }
        const result = await this.prisma.message.findMany({
            where: {
                AND: [
                    {
                        roomId: id_room,
                    },
                    {
                        NOT: {
                            senderId: {
                                in: blockedId
                            },
                        },
                    },
                ],
            },
            orderBy: {
                createdAt: 'asc',
            },
            select: {
                sender: {
                    select: {
                        id: true,
                        nickname: true,
                        avatar: true,
                    }
                },
                id: true,
                msg: true,
                senderId: true,
                createdAt: true,
            },
        });
        return result;
    }
    async sendMessage(userId, room_id, message) {
        const me = await this.findPlayerById(userId);
        const messageSent = await this.prisma.message.create({
            data: {
                msg: message,
                senderId: me.id,
                roomId: room_id
            }
        });
        return messageSent;
    }
    async sendMessageinRoom(userId, message, room_id) {
        const me = await this.findPlayerById(userId);
        const messageSent = await this.prisma.message.create({
            data: {
                msg: message,
                senderId: me.id,
                roomId: room_id
            }
        });
        return messageSent;
    }
    async addMember(login, room_id) {
        const palyer = await this.findPlayerByNickname(login);
        const permission = await this.prisma.permission.create({
            data: {
                statusMember: "member",
                is_muted: false,
                muted_until: new Date(),
                is_banned: false,
                blocked_since: new Date(),
                playerId: palyer.id,
                roomId: room_id,
            }
        });
        return permission;
    }
    async joinRoom(userId, room_id) {
        const room = await this.prisma.chatRoom.findUnique({
            where: { id: room_id }
        });
        if (!room) {
            throw new common_1.NotFoundException("Room not found");
        }
        if (room.is_dm === true) {
            throw new common_1.NotFoundException("Cannot join a DM");
        }
        if (room.is_protected === true) {
            throw new common_1.NotFoundException("You cann't join a protected room");
        }
        const member = await this.getPermissions(userId, room_id);
        if (member && member.is_banned === true) {
            throw new common_1.UnauthorizedException("You are banned from this room");
        }
        else if (!member && room.is_private === false) {
            const permission = await this.prisma.permission.create({
                data: {
                    playerId: userId,
                    roomId: room_id,
                    statusMember: "member",
                    is_muted: false,
                    muted_until: new Date(),
                    is_banned: false,
                    blocked_since: new Date(),
                }
            });
            return permission;
        }
        return member;
    }
    async joinProtectedRoom(userId, { room_id, pwd }) {
        const room = await this.prisma.chatRoom.findUnique({
            where: { id: room_id }
        });
        if (!room) {
            throw new common_1.NotFoundException("Room not found");
        }
        if (room.is_dm === true) {
            throw new common_1.NotFoundException("Cannot join a DM");
        }
        if (room.is_protected === false) {
            throw new common_1.NotFoundException("This is a not a protected room");
        }
        const areEqual = await (0, bcrypt_1.compare)(room.password, pwd);
        if (!areEqual) {
            throw new common_1.UnauthorizedException("Wrong password");
        }
        const member = await this.getPermissions(userId, room_id);
        if (member && member.is_banned === true) {
            throw new common_1.UnauthorizedException("You are banned from this room");
        }
        else if (!member) {
            const permission = await this.prisma.permission.create({
                data: {
                    playerId: userId,
                    roomId: room_id,
                    statusMember: "member",
                    is_muted: false,
                    muted_until: new Date(),
                    is_banned: false,
                    blocked_since: new Date(),
                }
            });
            return permission;
        }
        return member;
    }
    async setAdmin(login, room_id) {
        const palyer = await this.findPlayerByNickname(login);
        const room = await this.prisma.permission.updateMany({
            where: {
                AND: [
                    { playerId: palyer.id },
                    { roomId: room_id }
                ],
            },
            data: {
                statusMember: "admin",
            },
        });
    }
    async banMember(login, room_id) {
        const palyer = await this.findPlayerByNickname(login);
        const room = await this.prisma.permission.updateMany({
            where: {
                AND: [
                    { playerId: palyer.id },
                    { roomId: room_id }
                ],
            },
            data: {
                is_banned: true,
                blocked_since: new Date(),
            },
        });
    }
    async kickMember(login, room_id) {
        const palyer = await this.findPlayerByNickname(login);
        const room = await this.prisma.permission.deleteMany({
            where: {
                AND: [
                    { playerId: palyer.id },
                    { roomId: room_id }
                ],
            },
        });
    }
    async muteMember(login, room_id) {
        const palyer = await this.findPlayerById(login);
        const room = await this.prisma.permission.updateMany({
            where: {
                AND: [
                    { playerId: palyer.id },
                    { roomId: room_id }
                ],
            },
            data: {
                is_muted: true,
            },
        });
    }
    async unmuteMember(login, room_id) {
        const palyer = await this.findPlayerById(login);
        const room = await this.prisma.permission.updateMany({
            where: {
                AND: [
                    { playerId: palyer.id },
                    { roomId: room_id }
                ],
            },
            data: {
                is_muted: false,
                muted_until: new Date(),
                blocked_since: new Date(),
            },
        });
    }
    async leaveChannel(userId, room_id) {
        const palyer = await this.findPlayerById(userId);
        const room = await this.prisma.permission.deleteMany({
            where: {
                AND: [
                    { playerId: palyer.id },
                    { roomId: room_id }
                ],
            },
        });
    }
};
PlayerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlayerService);
exports.PlayerService = PlayerService;
//# sourceMappingURL=player.service.js.map