import { Injectable } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { stat } from 'fs';
import { networkInterfaces } from 'os';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PlayerService {
    constructor(private prisma: PrismaService) { }

    async findPlayer(login: string): Promise<any> {

        const player = await this.prisma.player.findUnique({
            where: {
                nickname: login
            }
        });

        if (!player)
            return null;
        return player;
    }

    // ------------------ Get list of freiends ------------------

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
    // 2 - list of friends that we can add to the chat room
    async getListOfFriendsToAddinThisRoom(data: any, room_id: number) {
        console.log("getListOfFriendsToAddinThisRoom");
        const me = await this.findPlayer(data.nickname);

        // 1- Get all members of this room
        const members = await this.prisma.chatRoom.findUnique({
            where: { id: room_id },
            select: {
                all_members: {
                    select: {
                        playerId: true
                    }
                }
            }
        })
 
        console.log(members);
        console.log("-------------------------------------");
        // 2- Get all friends that we can add to this room
        const friends = await this.prisma.friendship.findMany({
            where: {
                OR: [
                    {
                        senderId: me.id,
                        status: "friend"
                    },
                    {
                        receiverId: me.id,
                        status: "friend"
                    }
                ]
            }
        })
        return friends;
    }

     // 2 - list of friends that we can add to the chat room
     async getListOfFriendsToUpgradeAdmininThisRoom(data: any, room_id: number) {
        const me = await this.findPlayer(data.nickname);
        const friends = await this.prisma.friendship.findMany({
        where: {
            OR: [
            {
                senderId: me.id,
                status: "friend"
            },
            {
                receiverId: me.id,
                status: "friend"
            }
            ]
        }
        })
        return friends;
    }
    // 2 - list of friends that we can add to the chat room
    async getListOfFriendsToMuteinThisRoom(data: any, room_id: number) {
        const me = await this.findPlayer(data.nickname);
        const friends = await this.prisma.friendship.findMany({
        where: {
            OR: [
            {
                senderId: me.id,
                status: "friend"
            },
            {
                receiverId: me.id,
                status: "friend"
            }
            ]
        }
        })
        return friends;
    }

     // 2 - list of friends that we can add to the chat room
     async getListOfFriendsToUnmuteinThisRoom(data: any, room_id: number) {
        const me = await this.findPlayer(data.nickname);
        const friends = await this.prisma.friendship.findMany({
        where: {
            OR: [
            {
                senderId: me.id,
                status: "friend"
            },
            {
                receiverId: me.id,
                status: "friend"
            }
            ]
        }
        })
        return friends;
    }

    // 2 - list of friends that we can add to the chat room
    async getListOfFriendsToBaninThisRoom(data: any, room_id: number) {
        const me = await this.findPlayer(data.nickname);
        const friends = await this.prisma.friendship.findMany({
            where: {
                OR: [
                    {
                        senderId: me.id,
                        status: "friend"
                    },
                    {
                        receiverId: me.id,
                        status: "friend"
                    }
                ]
            }
        })
        return friends;
    }

    // ------------------ 1- Get Friend  ------------------

    // ana user, check if this nickname is my friend 
    async getFriend(data: any, login: string) {

        const me = await this.findPlayer(data.nickname);

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


    // ------------------ 2- Request FriendShip -------------------------------

    // 1- create
    async createFriendship(data: any, friendname: string) {
        const sender = await this.findPlayer(data.nickname);
        const receiver = await this.prisma.player.findUnique({
            where: { nickname: friendname }
        });

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
    // 4- unblock
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

    // --------------------------------------------------------------//

    // ------------------------ Chat --------------------

    // 1- Create a chat room

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

    //send message
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



    //send message to other player 2:05 delete
    // async sendMessage(user: any, message: string, friendname: string) {
    //     const me = await this.findPlayer(user.nickname);
    //     const friend = await this.prisma.player.findUnique({
    //         where: { nickname: friendname }
    //     });
    //     const room = await this.prisma.chatRoom.findFirst({
    //         where: {
    //             all_members: {
    //                 some: {
    //                     playerId: me.id
    //                 }
    //             },
    //             all_members: {
    //                 some: {
    //                     playerId: friend.id
    //                 }
    //             }
    //         }
    //     })
    //     if (room) {
    //         const messageSent = await this.prisma.message.create({
    //             data: {
    //                 msg: message,
    //                 senderId: me.id,
    //                 roomId: room.id
    //             }
    //         })
    //         return messageSent;
    //     }
    // }


    // 2- Send a message

    // function to send a message to a chat room
    //     async sendMessage(data: any, friendname: string, message: string) {
    //         const me = await this.findPlayer(data.nickname);
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
    //         const me = await this.findPlayer(data.nickname);
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
    //     const sender = await this.findPlayer(data.nickname);
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

    // 1- Create a chat room : done
    // 2- send a msg in this chat room :  pending

    // 3- add new member to this chat room : pending


    // 4- leave channel // delete the player from the permision
    async leaveChannel(user: any, room_id: number) {
        const me = await this.findPlayer(user.nickname);
        const room = await this.prisma.chatRoom.findUnique({
            where: { id: room_id }
        });


    }




    // 5- add member to list admins // change status of member to admins
    // 6- ban member if admin or owner // 
    //ban member if admin or owner
    // async banMember(user: any, member_id: number) {


    // 7- mute member if u are admin or owner
    // 8- create a password to channel or delete password if is owner


    // 9- get messages_history :done
}