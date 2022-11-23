import { Injectable } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { stat } from 'fs';
import { networkInterfaces } from 'os';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PlayerService {
    constructor(private prisma: PrismaService) { }

    async findPlayer(data: any) {

        const player = await this.prisma.player.findUnique({
            where: { nickname: data.nickname }
        });

        if (!player)
            return null;
        return player;
    }
    // ------------------ Request FriendShip -------------------------------

    // 1- create
    async createFriendship(data: any, friendname: string) {
        const sender = await this.findPlayer(data);
        const receiver = await this.prisma.player.findUnique({
            where: { nickname: friendname }
        });

        const friends = await this.prisma.friendship.create({
            data: {
                senderId: sender.id,
                receiverId: receiver.id,
                status: "pending"
            }
        })

        return friends;
    }

    // 2- accept
    async acceptFriendship(data: any, friendname: string) {
        const me = await this.findPlayer(data);
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
                status: "friend"
            }
        })

        // if (friendship) ==> status = friend
        return friendship;
    }

    // 3- block
    async blockFriendship(data: any, friendname: string) {
        const me = await this.findPlayer(data);
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
                status: "Block",
                senderId: me.id,
                receiverId: howa.id,
            }
        })

        // if (friendship) ==> status = friend
        return friendship;
    }

    // 4- unblock
    async unblockFriendship(data: any, friendname: string) {
        const me = await this.findPlayer(data);
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
                status: "Friend",
                senderId: me.id,
                receiverId: howa.id,
            }
        })
        // if (friendship) ==> status = friend
        return friendship;
    }

    // ana user, check if this nickname is my friend 
    async getFriend(data: any, login: string) {
        const me = await this.findPlayer(data);
        const friend = await this.prisma.player.findUnique({
            where: { nickname: login }
        });
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
                ]

                // and status === friend
            }
        })
        return friendship;
    }

    async getAllFriends(data: any) {
        const me = await this.findPlayer(data);

        const friends = await this.prisma.friendship.findMany({
            where: {
                OR: [
                    {
                        senderId: me.id,
                    },

                    {
                        receiverId: me.id,
                    }
                ]
            }
        })

        return friends;
    }

    // --------------------------------------------------------------//

    // ------------------------ Chat --------------------

    // 1- Create a chat room

    // function to create a chat room between two players if they are friends
    async createChatRoom(user: any, nameOfRoom: string) {
        const me = await this.findPlayer(user);

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
        const sender = await this.findPlayer(user);
        const receiver = await this.prisma.player.findUnique({
            where: { nickname: friendname }
        });
        const room = await this.prisma.chatRoom.create({
            data:
            {
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


    //get all messages of a room
    async getMessagesOfDM(user: any, id_room: any) {
        const me = await this.findPlayer(user);

        const messages = await this.prisma.message.findMany({
            where: {
                AND: [
                    { playerId: me.id },
                    { roomId: id_room },
                ]
            },
        })
        return messages;
    }

    async getMessagesOfRoom(user: any, id_room) {
        const me = await this.findPlayer(user);

        // 1- get the permission of this player in this room
        const status = await this.prisma.permission.findFirst({
            where: {
                AND: [
                    { playerId: me.id },
                    { roomId: id_room },
                ]
            }
        })

        // 1- if user is banned, send all msgs before the time of banning
        // ==>  status.createdAt
        // where { message.createdAT {lt: status.createdAt} }
        if (status.statusMember === "banned") {
            return null; // lt
        }

        // else member is not banned, show all messages
        const result = await this.prisma.chatRoom.findMany({
            include: {
                // Select all members that are not blocked asc desc
                all_messages: // Permission
                {
                    where: {
                        createdAt: {
                            lt: nw
                        },
                        AND:{
                            sender: {
                                in: 
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'asc' 
                     }
                    // where: {
                    //     statusMember: {
                    //         not: "block",
                    //     }
                    // },
                },
                // all_messages: {
                //     orderBy: {
                //         createdAt: 'asc',
                //     },
                // },
            },
        })

        return result;
    }

    //send message
    async sendMessageinDM(user: any, message: string, room_id: number) {
        const me = await this.findPlayer(user);
        const room = await this.prisma.chatRoom.findUnique({
            where: { id: room_id }
        });

        // ASlan wa faslan makatcrea DM room ta receiver accept accept Friendship request
        // if friendship status is blocked
        // else (friendship status is friend)
        const messageSent = await this.prisma.message.create({
            data: {
                msg: message,
                playerId: me.id,
                roomId: room_id
            }
        })
        return messageSent;
    }

    async sendMessageinRoom(user: any, message: string, room_id: number) {
        const me = await this.findPlayer(user);
        const room = await this.prisma.chatRoom.findUnique({
            where: { id: room_id }
        });

        // if player is member : is banned or Muted

        // else ( the palyer can write his msg )
        const messageSent = await this.prisma.message.create({
            data: {
                msg: message,
                playerId: me.id,
                roomId: room_id
            }
        })
        return messageSent;
    }

    // 2- Send a message

    // function to send a message to a chat room
    //     async sendMessage(data: any, friendname: string, message: string) {
    //         const me = await this.findPlayer(data);
    //         const friend = await this.prisma.player.findUnique({
    //             where: { nickname: friendname}
    //         }); 

    //         const chat = await this.prisma.chat.findFirst({
    //             where: {
    //                 OR: [
    //                     {
    //                         player1Id: me.id,
    //                         player2Id: friend.id,
    //                     },

    //                     {
    //                         player1Id: friend.id,
    //                         player2Id: me.id,
    //                     }
    //                 ]
    //             }
    //         })

    //         if (chat) {
    //             const message = await this.prisma.message.create({
    //                 data: {
    //                     chatId: chat.id,
    //                     senderId: me.id,
    //                     content: message,
    //                 }
    //             })
    //             return message;
    //         }
    //         return null;
    //     }

    // // 3- Get all messages

    // // function to get all messages of a chat room
    //     async getAllMessages(data: any, friendname: string) {
    //         const me = await this.findPlayer(data);
    //         const friend = await this.prisma.player.findUnique({
    //             where: { nickname: friendname}
    //         }); 

    //         const chat = await this.prisma.chat.findFirst({
    //             where: {
    //                 OR: [
    //                     {
    //                         player1Id: me.id,
    //                         player2Id: friend.id,
    //                     },  

    //                     {
    //                         player1Id: friend.id,
    //                         player2Id: me.id,
    //                     }
    //                 ]
    //             }
    //         })

    //         if (chat) {
    //             const messages = await this.prisma.message.findMany({
    //                 where: {
    //                     chatId: chat.id,
    //                 }
    //             })
    //             return messages;
    //         }
    //         return null;
    //     }

    // 4- Get all chats



    // async createRoom(data: any, friendname: string) {
    //     const sender = await this.findPlayer(data);
    //     const receiver = await this.prisma.player.findUnique({
    //         where: { nickname: friendname}
    //     });

    //     const friends = await this.prisma.friendship.create({
    //         data: {
    //                 senderId: sender.id,
    //                 receiverId: receiver.id,
    //                 status: "pending"
    //             }
    //       })

    //     return friends;
    // }  

    // 2- send a msg in this chat room 
    // 3- add new member to this chat room 
    // 4- leave channel // delete the player from the permision
    // 5- add member to list admins
    // 6- ban member if admin or owner
    // 7- mute member if u are admin or owner
    // 8- create a password to channel or delete password if is owner

    // 9- get messages_history
}