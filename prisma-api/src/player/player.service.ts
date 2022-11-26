import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { stat } from 'fs';
import { networkInterfaces } from 'os';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PlayerService {
    constructor(private prisma: PrismaService) { }

    // ------------------ 0- Find Player && get Player ------------------

    async findPlayer(login: string): Promise<any> {
        const player = await this.prisma.player.findUnique({
            where: {
                nickname: login
            }
        });
        
        if (!player) {
            throw new NotFoundException()
            // throw new HttpException('User ÷ found', HttpStatus.NOT_FOUND);
        }
        return player;
    }

    // ------------------- GET list of Rooms -------------------
    async getAllRooms(data: any) {
        const me = await this.findPlayer(data.nickname);

        const rooms = await this.prisma.chatRoom.findMany({
            where: {
                all_members: {
                    some: {
                        playerId: me.id
                    }
                }
            }
        })
        return rooms;
    }

    // -------------------------- 1- Get list of friends ------------------

    async getFriend(data: any, login: string) {

        const me = await this.findPlayer(data.nickname);

        const friend = await this.prisma.player.findUnique({
            where: { nickname: login }
        });

        if (!friend) {
            throw new NotFoundException()
            // throw new HttpException('User ÷ found', HttpStatus.NOT_FOUND);
        }
        // suppose friend exist in the database
        // now I have to check if this user is my friend or not
        // where me: sender or receiver && friend sender or receiver
        const friendship = await this.prisma.friendship.findFirst({
            where: {
                OR: [
                    {
                        senderId: me.id,
                        receiverId: friend.id,
                    },

                    {
                        senderId: friend.id,
                        receiverId: me.id,
                    }
                ],

                // and status === friend
            },
        })
        return friendship;
    }

    async getAllFriendships(data: any) {
        const me = await this.findPlayer(data.nickname);

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
        })
        
        const friendsId = friends.map(user => {
            if (user.receiverId == me.id)
                return user.senderId
            return user.receiverId
        })
        // console.log(friendsId);
        return friendsId;
    }

    async getAllFriends(data: any) {
        const me = await this.findPlayer(data.nickname);

        console.log("ana get all friends method"); 
        const friendsId = await this.getAllFriendships(data); // friend 

        // console.log(friendsId);

        const friends = await this.prisma.player.findMany({
            where: {
                id:
                {
                    in: friendsId,
                },
            },
        })
        console.log(friends);
        return friends;
    }

    async getAllMembersOfThisRoom(data: any, room_id: number) {
        const me = await this.findPlayer(data.nickname);
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
                        playerId: {
                            not: me.id
                        },
                    },
                },
            },
        })
        return room.all_members.map(user => user.playerId);
    }
    
    // 2 - list of friends that we can add to the chat room
    async getListOfFriendsToAddinThisRoom(data: any, room_id: number) {
        console.log("getListOfFriendsToAddinThisRoom");

        const me = await this.findPlayer(data.nickname);

        // 1- Get all members of this room except me
        const membersId = await this.getAllMembersOfThisRoom(data, room_id);
        // console.log(membersId);

        // 2- Get all friends
        const friendships = await this.prisma.friendship.findMany({
            where: {
                OR: [
                    {
                        senderId: me.id,
                        status: "Friend",
                        NOT: {
                            receiverId: {
                                in: membersId,
                            },
                        },
                    },

                    {
                        receiverId: me.id,
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
            if (user.receiverId == me.id)
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
        })
        
        return listFriendsToadd;
    }

     // 2 - list of friends that we can add to the chat room
     async getListOfFriendsToUpgradeAdmininThisRoom(data: any, room_id: number) {
        const me = await this.findPlayer(data.nickname);
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
    async getListOfFriendsToMuteinThisRoom(data: any, room_id: number) {
        const me = await this.findPlayer(data.nickname);
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
     async getListOfFriendsToUnmuteinThisRoom(data: any, room_id: number) {
        const me = await this.findPlayer(data.nickname);
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
    async getListOfFriendsToBaninThisRoom(data: any, room_id: number) {
        const me = await this.findPlayer(data.nickname);
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

    // -------------------------- 2- Request FriendShip -------------------------------

    // 1- create
    async createFriendship(data: any, friendname: string) {
        const sender = await this.findPlayer(data.nickname);
        const receiver = await this.prisma.player.findUnique({
            where: { nickname: friendname }
        });
        if (!receiver) {
            throw new NotFoundException("Receiver not found");
        }

        const friends = await this.prisma.friendship.create({
            data: {
                senderId: sender.id,
                receiverId: receiver.id,
                status: "Pending"
            }
        })

        return friends;
    }

    // 2- accept
    async acceptFriendship(data: any, friendname: string) {
        const me = await this.findPlayer(data.nickname);
        const howa = await this.prisma.player.findUnique({
            where: { nickname: friendname },
        });

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
    async blockFriendship(data: any, friendname: string) {
        const me = await this.findPlayer(data.nickname);
        const howa = await this.prisma.player.findUnique({
            where: { nickname: friendname },
        });

        // awal haja an howwa sender w ana receiver
        const friendship = await this.prisma.friendship.updateMany({

           where:{
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
    return friendship;
}
    // 4- delete aka unfriend [unblock]
    async deleteFriendship(data: any, friendname: string) {
        const me = await this.findPlayer(data.nickname);
        const howa = await this.prisma.player.findUnique({
            where: { nickname: friendname },
        });


        const friendship = await this.prisma.friendship.delete({
            where: {
                senderId_receiverId: {
                    senderId: me.id,
                    receiverId: howa.id
                }
            },
        })

        return friendship;
    }

    // 5- refuse
    async refuseFriendship(data: any, friendname: string) {
        const me = await this.findPlayer(data.nickname);
        const howa = await this.prisma.player.findUnique({
            where: { nickname: friendname },
        });


        const friendship = await this.prisma.friendship.delete({
            where: {
                senderId_receiverId: {
                    senderId: howa.id,
                    receiverId: me.id
                }
            },
        })

        return friendship;
    }


    // ------------------------------ 3- Chat ---------------------------------------------

// Get room by id
async getRoomById(room_id: number) {
    const room = await this.prisma.chatRoom.findUnique({
        where: {
            id: +room_id
        },
        select: {
            name: true,
            is_dm: true,
        }
    })
    return room;
}


// 0- Create a chat room

    // function to create a chat room between two players if they are friends
    async createChatRoom(user: any, nameOfRoom: string) {
        const me = await this.findPlayer(user.nickname);

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
                            until: new Date(),
                            playerId: me.id
                            // connect && include 
                        },
                    ],
                },
            },
        })
        return room;
    }

    // if type == DM
    async createDMRoom(user: any, friendname: string) {
        const sender = await this.findPlayer(user.nickname);
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
                            until: new Date(),
                            playerId: sender.id
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
                            until: new Date(),
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

    async getPermissions(user: any, id_room: number) {
        const status = await this.prisma.permission.findFirst({
            where: {
                AND: [
                    { playerId: user.id },
                    { roomId: id_room },
                ]
            }
        })
        return status;
    }

// 2- get history messages of a room

    async getMessagesOfDM(user: any, id_room: any) {
    const me = await this.findPlayer(user.nickname);

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

    async getMessagesOfRoom(user: any, id_room) {
        const me = await this.findPlayer(user.nickname);

        // 1- get the permission of this player in this room
        const status = await this.prisma.permission.findFirst({
            where: {
                AND: [
                    { playerId: me.id },
                    { roomId: id_room },
                ]
            }
        })

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
        if (status.statusMember === "banned") {
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
                                lte: status.until
                            }
                        },
                    ],
                },
                orderBy:
                {
                    createdAt: 'asc',
                },
                select: {
                    msg: true,
                    senderId: true,
                }
            })
            return result;
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
                msg: true,
                senderId: true,
            }
        })
        return result;
    }

// 3- send message in chat room 

    async sendMessage(user: any, room_id: number, message: string) {
        const me = await this.findPlayer(user.nickname);
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

    async sendMessageinRoom(user: any, message: string, room_id: number) {
        const me = await this.findPlayer(user.nickname);
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

    async addMember(login : string, room_id: number) {
        const palyer = await this.findPlayer(login);
        const room = await this.prisma.permission.create({
            data: {
                statusMember: "member",
                until: new Date(),
                playerId: palyer.id,
                roomId: room_id,
            }
        })
        return room;
    }

// 5- set member to admin if u are admin or owner

    async setAdmin(login: string, room_id: number) {
        const palyer = await this.findPlayer(login);

        const room = await this.prisma.permission.updateMany({
            where: {      
                AND : [
                    {playerId: palyer.id},
                    {roomId: room_id}
                ],

            },
            data: {
                statusMember: "admin",
            },
        });
    }

// 6- ban member if u are admin or owner

    async banMember(login: string, room_id: number/*, fix_date: Date*/) {
        const palyer = await this.findPlayer(login);

        const room = await this.prisma.permission.updateMany({
            where: {      
                AND : [
                    {playerId: palyer.id},
                    {roomId: room_id}
                ],

            },
            data: {
                is_banned: true,
            },
        });
    }

// 6- ban member if u are admin or owner

    async kickMember(login: string, room_id: number) {
        const palyer = await this.findPlayer(login);

        const room = await this.prisma.permission.deleteMany({
            where: {      
                AND : [
                    {playerId: palyer.id},
                    {roomId: room_id}
                ],

            },
        });
    }
// 7- mute OR umute member if u are admin or owner

    async muteMember(login: any, room_id: number/*, fix_date: Date*/) {
        const palyer = await this.findPlayer(login);

        const room = await this.prisma.permission.updateMany({
            where: {      
                AND : [
                    {playerId: palyer.id},
                    {roomId: room_id}
                ],

            },
            data: {
                is_muted: true,
                // until: fix_date,
            },
        });
    }

    async unmuteMember(login: string, room_id: number) {
        const palyer = await this.findPlayer(login);

        const room = await this.prisma.permission.updateMany({
            where: {      
                AND : [
                    {playerId: palyer.id},
                    {roomId: room_id}
                ],

            },
            data: {
                is_muted: false,
            },
        });
    }

// 8- leave channel // delete the player from the permision

    async leaveChannel(data: any, room_id: number) {
        const palyer = await this.findPlayer(data.nickname);

        const room = await this.prisma.permission.deleteMany({
            where: {      
                AND : [
                    {playerId: palyer.id},
                    {roomId: room_id}
                ],

            },
        });
    }

// 9- create a password to channel or delete password if is owner

}