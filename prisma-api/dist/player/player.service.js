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
        const room = await this.prisma.chatRoom.findFirst({
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
        const me = await this.findPlayerById(userId);
        const rooms = await this.prisma.chatRoom.findMany({
            where: {
                OR: [
                    {
                        all_members: {
                            some: {
                                playerId: me.id
                            }
                        },
                    },
                    {
                        is_dm: false,
                        is_public: true,
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
                room.name = (_a = room.all_members.find(e => e.playerId !== me.id)) === null || _a === void 0 ? void 0 : _a.player.nickname;
            }
            return {
                id: room.id,
                name: room.name,
                is_dm: room.is_dm,
                is_public: room.is_public,
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
            throw new common_1.NotFoundException("Receiver not found");
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
            throw new common_1.NotFoundException("Receiver not found");
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
        const me = await this.findPlayerById(userId);
        const howa = await this.prisma.player.findUnique({
            where: { nickname: friendname },
        });
        if (!howa) {
            throw new common_1.NotFoundException("Receiver not found");
        }
        const friendship = await this.prisma.friendship.updateMany({
            where: {
                OR: [
                    {
                        senderId: me.id,
                        receiverId: howa.id,
                    },
                    {
                        senderId: howa.id,
                        receiverId: me.id,
                    }
                ]
            },
            data: {
                status: "Block",
                senderId: me.id,
                receiverId: howa.id,
            },
        });
    }
    async deleteFriendship(userId, friendname) {
        const me = await this.findPlayerById(userId);
        const howa = await this.prisma.player.findUnique({
            where: { nickname: friendname },
        });
        if (!howa) {
            throw new common_1.NotFoundException("Receiver not found");
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
            throw new common_1.NotFoundException("Receiver not found");
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
                all_members: {
                    some: {
                        playerId: {
                            not: userId,
                        },
                    },
                },
            },
            select: {
                name: true,
                is_dm: true,
                is_public: true,
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
        const me = await this.findPlayerById(userId);
        const room = await this.prisma.chatRoom.create({
            data: {
                is_dm: false,
                name: nameOfRoom,
                all_members: {
                    create: [
                        {
                            statusMember: "owner",
                            muted_until: new Date(),
                            blocked_since: new Date(),
                            playerId: me.id
                        },
                    ],
                },
            },
        });
        console.log("room\n", room);
        return room;
    }
    async createPrivateChatRoom(userId, nameOfRoom) {
        const me = await this.findPlayerById(userId);
        const room = await this.prisma.chatRoom.create({
            data: {
                is_dm: false,
                is_public: false,
                name: nameOfRoom,
                all_members: {
                    create: [
                        {
                            statusMember: "owner",
                            muted_until: new Date(),
                            blocked_since: new Date(),
                            playerId: me.id,
                        },
                    ],
                },
            },
        });
        return room;
    }
    async createProtectedChatRoom(userId, nameOfRoom, setpassword) {
        const me = await this.findPlayerById(userId);
        const room = await this.prisma.chatRoom.create({
            data: {
                is_dm: false,
                name: nameOfRoom,
                is_public: false,
                is_protected: true,
                password: setpassword,
                all_members: {
                    create: [
                        {
                            statusMember: "owner",
                            muted_until: new Date(),
                            blocked_since: new Date(),
                            playerId: me.id,
                        },
                    ],
                },
            },
        });
        return room;
    }
    async createDMRoom(userId, friendname) {
        const sender = await this.findPlayerById(userId);
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
                            playerId: sender.id,
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
    async getMessagesOfDM(user, id_room) {
        const me = await this.findPlayerById(user.nickname);
        const messages = await this.prisma.message.findMany({
            where: {
                AND: [
                    { senderId: me.id },
                    { roomId: id_room },
                ]
            },
        });
        return messages;
    }
    async getMessagesOfRoom(userId, id_room) {
        const me = await this.findPlayerById(userId);
        const status = await this.prisma.permission.findFirst({
            where: {
                AND: [
                    { playerId: me.id },
                    { roomId: id_room },
                ]
            }
        });
        if (status === null) {
            throw new common_1.NotFoundException("You are not a member of this room");
        }
        const blocked_list = await this.prisma.friendship.findMany({
            where: {
                AND: [
                    { status: "block" },
                    {
                        OR: [
                            {
                                senderId: me.id,
                            },
                            {
                                receiverId: me.id,
                            },
                        ]
                    },
                ],
            }
        });
        const blockedId = blocked_list.map(user => {
            if (user.receiverId == me.id)
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
        console.log("addMember ", login);
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
        console.log("permission ===>", permission);
        return permission;
    }
    async joinRoom(playerId, room_id) {
        const room = await this.prisma.permission.create({
            data: {
                statusMember: "member",
                muted_until: new Date(),
                blocked_since: new Date(),
                playerId: playerId,
                roomId: room_id,
            }
        });
        return room;
    }
    async setAdmin(login, room_id) {
        const palyer = await this.findPlayerById(login);
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
        const palyer = await this.findPlayerById(login);
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