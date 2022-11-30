//Add friend after blocking should not create another dm


import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { stat } from 'fs';
import { networkInterfaces } from 'os';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PlayerService {
    constructor(private prisma: PrismaService) { }

    // ------------------ 0- Find Player && get Player ------------------

    async findPlayerById(userId: string)//: Promise<any> {
    {
        // console.log("FindPlayerById", userId);  // userId ===> roomId
        if (!userId) {
            // throw new HttpException('User Id is required', 400);
            throw new NotFoundException('User Id is required');
        }
        const player = await this.prisma.player.findUnique({
            where: {
                id: userId,
            }
        });

        if (!player) {
            throw new NotFoundException()
            // throw new HttpException('User ÷ found', HttpStatus.NOT_FOUND);
        }
        return player;
    }

    async findPlayerByNickname(login: string) //: Promise<any> {
    {
        const player = await this.prisma.player.findUnique({
            where: {
                nickname: login
            }
        });

        if (!player) {
            throw new NotFoundException('Profile not found')
        }
        return player;
    }

    // ------------------- GET list of Rooms -------------------

    async findRoomById(roomId: string) //: Promise<boolean>
    {
        // console.log("-->", roomId);
        
        const room = await this.prisma.chatRoom.findUnique({
            where: {
                id: roomId,
            }
        });

        if (!room) {
            throw new NotFoundException("room not found");
        }
        return room;
    }


    async getRoomBetweenTwoPlayers(useId: string, login: string) //: Promise<boolean>
    {
        //  console.log("-->", friendId);
        const friend = await this.prisma.player.findUnique({
            where: {
                nickname: login
            }
        });
        if (!friend) {
            throw new NotFoundException('Profile not found')
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
                       

        })
        // console.log("room", room);
        return room;
    }

    async getAllRooms(userId: string) {
        const me = await this.findPlayerById(userId);

        // ROOMS  + public

        const rooms = await this.prisma.chatRoom.findMany({
            where: {
                OR: [
                    { // member DM or private proctected
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
        })
        // console.log(rooms);
        return rooms.map(room => {
            if (room.is_dm === true) {
                room.name = room.all_members.find(e=>e.playerId !== me.id)?.player.nickname;
            }
            return {
                id: room.id,
                name: room.name,
                is_dm: room.is_dm,
                is_public: room.is_public,
                is_protected: room.is_protected,
            }
        })
    }

    // -------------------------- 1- Get list of friends ------------------

    async getFriendshipStatus(userId: string, login: string) {

        // 1- Check if this login exist in the database
        // const friend = this.findPlayerByNickname(login);
        const friend = await this.prisma.player.findUnique({
            where: {
                nickname: login
            }
        });
        if (!friend) {
            throw new NotFoundException('Profile not found')
        }
        
        // 2- Check if this login is my friend or not
        // where me: sender or receiver && friend sender or receiver
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
        // It can return Null or Object
        return friendship;
    }

    async getFriendships(userId: string) {
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
            // select is not working in this case, the explanation is below
        })

        // ==> We use map insted of select because select is not working in this case
        const friendsId = friends.map(user => {
            if (user.receiverId == me.id)
                return user.senderId
            return user.receiverId
        })
        // console.log(friendsId);
        return friendsId;
    }

    async getAllFriends(userId: string) {
        // console.log("Method Get All Friends, without the user himself");

        // 1- Get Friends Id from Friendship table
        const friendsId = await this.getFriendships(userId);
        // 2- Get Friends Profile from Player table
        const friends = await this.prisma.player.findMany({
            where: {
                id:
                {
                    in: friendsId,
                },
            },
            select: {
                id: true,
                nickname: true,
                avatar: true,
            }
        })
        // console.log(friends);
        return friends;
    }

    async getProfilesOfChatRooms(userId: string, room_id: string) {

        // console.log(" Method Get Profiles of Chat room, without the user himself", room_id);

        // 1- Check if this user member of this room
        const status = await this.getPermissions(userId, room_id);
        if (!status) {
            throw new NotFoundException("You are not member of this room");
        }
        // 2- Get all members of this room
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
        })
        // console.log(members);
        return members.all_members.map(member => {  // all_members
            return {   // player
                // id: member.playerId,
                nickname: member.player.nickname,
                avatar: member.player.avatar,
            }
        })
    }

    async getAllMembersOfThisRoom(userId: string, room_id: string) {
        // const me = await this.findPlayerById(userId); /// ERRor here
        // console.log(" MEthod one of get all members ", userId, " ", room_id);
        
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
        })
        // console.log(ids);
        return ids.all_members.map(user => user.playerId);
    }

    // 2 - list of friends that we can add to the chat room
    async getListOfFriendsToAddinThisRoom(userId: string, room_id: string) {
        // console.log("MEEEEEEThod two get all friends ", userId, room_id);

        // 1- Check if this user member of this room
        const status = await this.getPermissions(userId, room_id);
        if (!status) {
            throw new NotFoundException("You are not member of this room");
        }
        // 2- Get all members ids of this room except me
        const membersId = await this.getAllMembersOfThisRoom(userId, room_id);

        // 3- Get all friends
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

        })

        const friendsId = friendships.map(user => {
            if (user.receiverId == userId)
                return user.senderId
            return user.receiverId
        })

        // 3- Get all friends that are not members of this room
        const listFriendsToadd = await this.prisma.player.findMany({
            where: {
                id:
                {
                    in: friendsId,
                },
            },
            select: {
                nickname: true,
                avatar: true,
                // id: true,
            }
        })
        // console.log(" Method listFriendsToadd    FINIXHED");
        return listFriendsToadd;
    }

    ///////////////////////// HADCHI BA9i 5assou ytverifia /////////////////////////////////
    // 2 - list of friends that we can add to the chat room
    async getListOfFriendsToUpgradeAdmininThisRoom(userId: string, room_id: string) {
        const me = await this.findPlayerById(userId);
        const room = await this.prisma.chatRoom.findFirst({
            where: {
                id: room_id
            },
            select: {
                all_members: {
                    select:
                    {
                        playerId: true
                    },
                    where:
                    {
                        AND:
                            [
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
        })
        return room.all_members.map(user => user.playerId);
    }

    // 2 - list of friends that we can add to the chat room
    async getListOfFriendsToMuteinThisRoom(userId: string, room_id: string) {
        const me = await this.findPlayerById(userId);
        const room = await this.prisma.chatRoom.findFirst({
            where: {
                id: room_id
            },
            select: {
                all_members: {
                    select:
                    {
                        playerId: true
                    },
                    where:
                    {
                        AND:
                            [
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
        })
        return room.all_members.map(user => user.playerId);
    }

    // 2 - list of friends that we can add to the chat room
    async getListOfFriendsToUnmuteinThisRoom(userId: string, room_id: string) {
        const me = await this.findPlayerById(userId);
        const room = await this.prisma.chatRoom.findFirst({
            where: {
                id: room_id
            },
            select: {
                all_members: {
                    select:
                    {
                        playerId: true
                    },
                    where:
                    {
                        AND:
                            [
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
        })
        return room.all_members.map(user => user.playerId);
    }

    // 2 - list of friends that we can add to the chat room
    async getListOfFriendsToBaninThisRoom(userId: string, room_id: string) {
        const me = await this.findPlayerById(userId);
        const room = await this.prisma.chatRoom.findFirst({
            where: {
                id: room_id,
            },
            select: {
                all_members: {
                    select:
                    {
                        playerId: true
                    },
                    where:
                    {
                        AND:
                            [
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
        })
        return room.all_members.map(user => user.playerId);
    }

    // -------------------------- 2- Request FriendShip -------------------------------

        ///////////////////////////////// Ta hada mochkil 5asou yt7al ////////////////////////////////////////////

    // 1- create
    async createFriendship(userId: string, friendname: string) {

        // 1- Why i CAN'T use getPlayerByNickname ??
        const receiver = await this.prisma.player.findUnique({
            where: { nickname: friendname }
        });
        if (!receiver) {
            throw new NotFoundException("Receiver not found");
        }

        // 2- Send FriendShip Request
        const friends = await this.prisma.friendship.create({
            data: {
                senderId: userId,
                receiverId: receiver.id,
                status: "Pending"
            }
        })
        // return friends;
    }

    // 2- accept
    async acceptFriendship(userId: string, friendname: string) {
        const me = await this.findPlayerById(userId);
        const howa = await this.prisma.player.findUnique({
            where: { nickname: friendname },
        });
        if (!howa) {
            throw new NotFoundException("Receiver not found");
        }
        const ad = await this.prisma.friendship.findUnique({
            where: {
                senderId_receiverId: {
                    senderId: howa.id,
                    receiverId: me.id
                }
            },
            // and status === friend
        })

        if (!ad) 
            throw new NotFoundException("Request not found");

        const friendship = await this.prisma.friendship.update({
            where: {
                senderId_receiverId: {
                    senderId: howa.id,
                    receiverId: me.id
                }
            },
            // and status === friend
            data: {
                status: "Friend"
            }
        })

        // if (friendship) ==> status = friend
         return friendship;
    }

    // 3- block // ana blockit howa[friendname]
    async blockFriendship(userId: string, friendname: string) {
        const me = await this.findPlayerById(userId);
        const howa = await this.prisma.player.findUnique({
            where: { nickname: friendname },
        });
        if (!howa) {
            throw new NotFoundException("Receiver not found");
        }

        // awal haja an howwa sender w ana receiver
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
            // and status === friend
            data: {
                status: "Block",
                senderId: me.id,
                receiverId: howa.id,
            },

        })
        // return friendship;
    }
    // 4- delete aka unfriend [unblock]
    async deleteFriendship(userId: string, friendname: string) {
        const me = await this.findPlayerById(userId);
        const howa = await this.prisma.player.findUnique({
            where: { nickname: friendname },
        });
        if (!howa) {
            throw new NotFoundException("Receiver not found");
        }

        const friendship = await this.prisma.friendship.delete({
            where: {
                senderId_receiverId: {
                    senderId: me.id,
                    receiverId: howa.id
                }
            },
        })

        // return friendship;
    }

    // 5- refuse
    async refuseFriendship(userId: string, friendname: string) {
        const me = await this.findPlayerById(userId);
        const howa = await this.prisma.player.findUnique({
            where: { nickname: friendname },
        });
        if (!howa) {
            throw new NotFoundException("Receiver not found");
        }

        const friendship = await this.prisma.friendship.delete({
            where: {
                senderId_receiverId: {
                    senderId: howa.id,
                    receiverId: me.id
                }
            },
        })

        // return friendship;
    }


    // ------------------------------ 3- Chat ---------------------------------------------

    // Get room by id
    async getRoomById(userId: string, room_id: string) {
        const room = await this.prisma.chatRoom.findFirst({
            where: {
                id: room_id,
                all_members: {
                    some: {
                        playerId:{
                                not: userId,
                            },
                        },
                    },
                },
            select: {
                name: true,
                is_dm: true,
                is_public: true,
                is_protected : true,
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
            }
        )
        return room;
    }


    // 0- Create a chat room

    // function to create a chat room between two players if they are friends
    async createPublicChatRoom(userId: string, nameOfRoom: string) {
        // console.log("createPublicChatRoom");
        const me = await this.findPlayerById(userId);

        // owner create a room 
        // while creating the room create a member type(permission) and set it to owner

        const room = await this.prisma.chatRoom.create({
            data:
            {
                is_dm: false,
                name: nameOfRoom,

                all_members: {
                    create: [
                        {
                            statusMember: "owner",
                            // muted_until:new Date(),
                            // player:  {
                            //     connect:{
                            //        id: me.id,
                            //     }
                            // },
                            muted_until: new Date(),
                            blocked_since: new Date(),
                            playerId: me.id
                            // connect && include 
                        },
                    ],
                },
            },
        })
        return room;
    }

    async createPrivateChatRoom(userId: string, nameOfRoom: string) {
        const me = await this.findPlayerById(userId);

        // owner create a room 
        // while creating the room create a member type(permission) and set it to owner

        const room = await this.prisma.chatRoom.create({
            data:
            {
                is_dm: false,
                is_public: false,
                name: nameOfRoom,

                all_members: {
                    create: [
                        {
                            statusMember: "owner",
                            // muted_until:new Date(),
                            // player:  {
                            //     connect:{
                            //        id: me.id,
                            //     }
                            // },
                            muted_until: new Date(),
                            blocked_since: new Date(),
                            playerId: me.id,
                            // connect && include 
                        },
                    ],
                },
            },
        })
        return room;
    }

    async createProtectedChatRoom(userId: string, nameOfRoom: string, setpassword: string) {
        const me = await this.findPlayerById(userId);

        // owner create a room 
        // while creating the room create a member type(permission) and set it to owner

        const room = await this.prisma.chatRoom.create({
            data:
            {
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
        })
        return room;
    }

    // if type == DM
    async createDMRoom(userId: string, friendname: string) {
        const sender = await this.findPlayerById(userId);
        const receiver = await this.prisma.player.findUnique({
            where: { nickname: friendname }
        });
        const room = await this.prisma.chatRoom.create({
            data:
            {
                name: friendname,
                all_members: {
                    create: [
                        {
                            statusMember: "member",
                            //muted_until:new Date(),
                            // player:  {
                            //     connect:{
                            //        id: me.id,
                            //     }
                            // },
                            muted_until: new Date(),
                            blocked_since: new Date(),
                            playerId: sender.id,
                            // connect && include 
                        },
                        {
                            statusMember: "member",
                            //muted_until:new Date(),
                            // player:  {
                            //     connect:{
                            //        id: me.id,
                            //     }
                            // },
                            muted_until: new Date(),
                            blocked_since: new Date(),
                            playerId: receiver.id
                            // connect && include 
                        },
                    ],
                },
            },
        })
        return room;
    }

    // 1- Get Permissions of the user in the room

    async getPermissions(userId: string, id_room: string) {
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
        })
        // if(status === null){
        //     throw new NotFoundException("You are not a member of this room");
        // }
        return status;
    }

    // 2- get history messages of a room

    async getMessagesOfDM(user: any, id_room: any) {
        const me = await this.findPlayerById(user.nickname);

        const messages = await this.prisma.message.findMany({
            where: {
                AND: [
                    { senderId: me.id },
                    { roomId: id_room },
                ]
            },
        })
        return messages;
    }

    async getMessagesOfRoom(userId: string, id_room: string) {
        const me = await this.findPlayerById(userId);

        // console.log("\\\\\\\\\\\\\\\\getMessagesOfRoom \\\\\\\\\\\\\\\\");
        // console.log("userId:", userId, " ", "roomId",  id_room);
        // 1- get the permission of this player in this room
        const status = await this.prisma.permission.findFirst({
            where: {
                AND: [
                    { playerId: me.id },
                    { roomId: id_room },
                ]
            }
        })
        if (status === null) {
            throw new NotFoundException("You are not a member of this room");
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
        })
        // foreach vs map https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
        const blockedId = blocked_list.map(user => {
            if (user.receiverId == me.id)
                return user.senderId
            return user.receiverId
        })

        // 1- if user is banned, send all msgs before the time of banning
        // ==>  status.createdAt
        // where { message.createdAT {lt: status.createdAt} }
        // console.log("status", status);
        if (status.is_banned) {
            const result = await this.prisma.message.findMany({
                where:
                {
                    AND: [
                        {
                            roomId: id_room,
    
                        },
                        {
                            NOT: {
                                senderId: {
                                    // in : blockedId
                                    in: blockedId
                                },
                                // playerId: blocked_list,
                            },
                        },
                        {
                            createdAt: {
                                lte: status.blocked_since,
                            }
                        },
                    ],
                },
                orderBy:
                {
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
            })
        }
        // else
        const result = await this.prisma.message.findMany({
            where:
            {
                AND: [
                    {
                        roomId: id_room,
                    },
                    {
                        NOT: {
                            senderId: {
                                // in : blockedId
                                in: blockedId
                            },
                            // playerId: blocked_list,
                        },
                    },
                ],
            },
            orderBy:
            {
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
        })
        return result;
    }ƒ

    // 3- send message in chat room 

    async sendMessage(userId: string, room_id: string, message: string) {
        const me = await this.findPlayerById(userId);
        // const room = await this.prisma.chatRoom.findUnique({
        //     where: { id: room_id }
        // });

        // ASlan wa faslan makatcrea DM room ta receiver accept accept Friendship request
        // if friendship status is blocked
        // else (friendship status is friend)
        const messageSent = await this.prisma.message.create({
            data: {
                msg: message,
                senderId: me.id,
                roomId: room_id
            }
        })
        return messageSent;
    }

    async sendMessageinRoom(userId: string, message: string, room_id: string) {
        const me = await this.findPlayerById(userId);
        // const room = await this.prisma.chatRoom.findUnique({
        //     where: { id: room_id }
        // });

        // if player is member : is banned or Muted
        // else ( the palyer can write his msg )
        const messageSent = await this.prisma.message.create({
            data: {
                msg: message,
                senderId: me.id,
                roomId: room_id
            }
        })
        return messageSent;
    }

    // 4- add new member to a chat room 

    async addMember(login: string, room_id: string) {
        const palyer = await this.findPlayerByNickname(login);
        // console.log("palyer", palyer.id);
        // console.log("room_id", room_id);

        // if (room === null) {
        //     throw new NotFoundException("This nickname already exist in this room");
        // }

        const room = await this.prisma.permission.create({
            data: {
                statusMember: "member",
                muted_until: new Date(),
                blocked_since: new Date(),
                playerId: palyer.id,
                roomId: room_id,
            }
        })
        return room;
    }

    async joinRoom(playerId: string, room_id: string) {
        const room = await this.prisma.permission.create({
            data: {
                statusMember: "member",
                muted_until: new Date(),
                blocked_since: new Date(),
                playerId: playerId,
                roomId: room_id,
            }
        })
        return room;
    }

    // 5- set member as admin if u are admin or owner

    async setAdmin(login: string, room_id: string) {
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

    // 6- ban member if u are admin or owner

    async banMember(login: string, room_id: string/*, fix_date: Date*/) {
        const palyer = await this.findPlayerById(login);

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

    // 6- ban member if u are admin or owner

    async kickMember(login: string, room_id: string) {
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
    // 7- mute OR umute member if u are admin or owner

    async muteMember(login: any, room_id: string/*, fix_date: Date*/) {
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
                // muted_until: fix_date,
            },
        });
    }

    async unmuteMember(login: string, room_id: string) {
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

    // 8- leave channel // delete the player from the permision

    async leaveChannel(userId: string, room_id: string) {
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

    
    // 9- create a password to channel or delete password if is owner

}