import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PlayerService {
    constructor(private prisma: PrismaService) {}

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
            where: { nickname: friendname}
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
            where: { nickname: friendname},
        });
        
        const friendship = await this.prisma.friendship.update({
                where: {
                    senderId_receiverId:{
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
            where: { nickname: friendname},
        });
        
        const friendship = await this.prisma.friendship.update({
                where: {
                    senderId_receiverId:{
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
            where: { nickname: friendname},
        });
        
        const friendship = await this.prisma.friendship.update({
                where: {
                    senderId_receiverId:{
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
            where: { nickname: login}
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

// --------------------------------------------------------------

// ------------------------ Chat --------------------

// 1- Create a chat room 
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
// 4- leave channel
// 5- add member to list admins
// 6- ban member if admin or owner
// 7- mute member if u are admin or owner
// 8- create a password to channel or delete password if is owner

// 9- get messages_history



}

