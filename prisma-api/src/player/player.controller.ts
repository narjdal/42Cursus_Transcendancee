import { Controller, Get, Param, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { PlayerService } from './player.service';
import { AuthGuard } from '@nestjs/passport';
import { userInfo } from 'os';
import { resourceUsage } from 'process';

@Controller('player')
@UseGuards(AuthGuard('jwt'))
export class PlayerController {
    constructor(private readonly playerService: PlayerService) { }
    @Get('myprofile') // localhost:3000/account 
    async login(@Req() request, @Res() response) {
        console.log("MY PROFILE");
        const user = await this.playerService.findPlayer(request.user.nickname);

        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        response.status(200).send(user);
        return user;
    }

    // This is for guetting player profile
    @Get('/profile/:id')
    async getProfile(@Param() login: string, @Req() request, @Res() response) {
        console.log("Profile of another Player");
        const user = await this.playerService.findPlayer(login['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        })

        response.status(200).send(user);
        return user;
    }

    // ----------------------------- List of Members ----------------

    @Get('/listOfFriends')
    async GetListOfFriends(@Req() request, @Res() response) {
        console.log("List of Friends");
        const friends = await this.playerService.getAllFriends(request.user);

        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        response.status(200).send(friends);
        return friends;
    }

    @Get('/listOfMembers/:id')
    async GetListOfMembers(@Param() id_room: number, @Req() request, @Res() response) {
        console.log("List of Friends");
        const friends = await this.playerService.getAllMembersOfThisRoom(request.user, id_room['id']);

        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        response.status(200).send(friends);
        return friends;
    }

    @Get('/listToAddFriend/:id')
    async GetListOfAddFriends(@Param() id_room: number, @Req() request, @Res() response) {
        console.log("List of Friends");
        const friends = await this.playerService.getListOfFriendsToAddinThisRoom(request.user, id_room['id']);

        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        response.status(200).send(friends);
        return friends;
    }

    @Get('/listOfSetAdmin/:id')
    async GetListOfSetAdmin(@Param() id_room: number, @Req() request, @Res() response) {
        console.log("List of Friends");
        const friends = await this.playerService.getListOfFriendsToUpgradeAdmininThisRoom(request.user, id_room['id']);    

        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        response.status(200).send(friends);
        return friends;
    }

    @Get('/listToMute/:id')
    async GetListOfMembersToMute(@Param() id_room: number, @Req() request, @Res() response) {
        console.log("List of Friends");
        const friends = await this.playerService.getListOfFriendsToMuteinThisRoom(request.user, id_room['id']);    

        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        response.status(200).send(friends);
        return friends;
    }

    @Get('/listOfUnmute/:id')
    async GetListOfMembersToUnmute(@Param() id_room: number, @Req() request, @Res() response) {
        console.log("List of Friends");
        const friends = await this.playerService.getListOfFriendsToUnmuteinThisRoom(request.user, id_room['id']);    

        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        response.status(200).send(friends);
        return friends;
    }

    @Get('/listToBan/:id')
    async GetListOfMembersToBan(@Param() id_room: number, @Req() request, @Res() response) {
        console.log("List of Friends");
        const friends = await this.playerService.getListOfFriendsToBaninThisRoom(request.user, id_room['id']);    

        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        response.status(200).send(friends);
        return friends;
    }



    // ---------------------------------- Frienships ----------------------------------

    @Get('/statusFriendship/:id')
    async checkStatusFriendship(@Param() login: string, @Req() request, @Res() response) {
        console.log("Check if Friend");
        const membership = await this.playerService.getFriend(request.user, login['id']);

        let choices: Array<String> = [];

        if (!membership) {
            choices = ['addFriend'];
        }
        else if (membership && membership.status === "Friend") // condition
        {
            choices = ['blockFriend'];
        }
        else if (membership && membership.status === "Block" && membership.senderId === request.user.id) // condition
        {
            choices = ['unblockFriend'];
        }
        else if(membership && membership.status === "Block" && membership.receiverId === request.user.id) // condition
        {
            choices = ['YourBlocked']; // walou hia block
        }
        else if (membership && membership.status === "Pending" && membership.senderId === request.user.id) // condition
        {
            choices = ['pendingFriend'];
        }
        else if (membership && membership.status === "Pending" && membership.receiverId === request.user.id) // condition
        {
            choices = ['acceptFriend', 'refuseFriend'];
        }
        else { // f (membership && membership.status === "blocked" && membership.receiverId === request.user.id) // condition
            choices = ['']; // walou hia block
        }

        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        response.status(200).send(choices);
        console.log(choices);
        return choices;
    }

    @Get('/requestFriendship/:id')
    async RequestFriendship(@Param() login: string, @Req() request, @Res() response) {
        console.log("Request Friendship");
        const friend = await this.playerService.createFriendship(request.user, login['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        response.status(200).send(friend);
    }

    @Get('/acceptFriendship/:id')
    async AcceptFriendship(@Param() login: string, @Req() request, @Res() response) {
        console.log("Accept Friendship");
        const friend = await this.playerService.acceptFriendship(request.user, login['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        response.status(200).send(friend);
    }

    @Get('/refuseFriendship/:id')
    async RefuseFriendship(@Param() login: string, @Req() request, @Res() response) {
        console.log("Refuse Friendship");
        const friend = await this.playerService.refuseFriendship(request.user, login['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        response.status(200).send(friend);
    }

    @Get('/blockFriendship/:id')
    async BlockFriendship(@Param() login: string, @Req() request, @Res() response) {
        console.log("Block Friendship");
        const friend = await this.playerService.blockFriendship(request.user, login['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        response.status(200).send(friend);
    }

    @Get('/unblockFriendship/:id')
    async UnblockFriendship(@Param() login: string, @Req() request, @Res() response) {
        console.log("Unblock Friendship");
        const friend = await this.playerService.deleteFriendship(request.user, login['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        response.status(200).send(friend);
    }


    //using socket to block messages from banned users

    // @Post('/sendmessage/:id')
    // async SendMessage(@Req() request, @Res() response) {
    //     console.log("Send Message");
        
    //     // if user is banned, he can't send message
    //     const status = await. this.playerService.getPermissions(request.user, i);
    //     const status = await this.prisma.permision.findFirst({
    //         where: {
    //             AND: [
    //                 { playerId: me.id },
    //                 { roomId: id_room },
    //             ]
    //         }
    //     });

    //     const message = await this.playerService.sendMessage(request.user, +login, request.body.message);
    //     response.set({
    //         'Access-Control-Allow-Origin': 'http://localhost:3000'
    //     }
    //     )
    //     response.status(200).send(message);
    // }

// ---------------------------------- CONTROLLER Permission in room ---------------------------------- //

    // //endpoint for setting a member as admin
    @Get('/addMember/:id1/:id2')
    async addMember(@Param() login: string, @Param() room: number ,@Req() request, @Res() response) {
        console.log("Add Member");
        const admin = await this.playerService.addMember(login['id1'], room['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
            }
        )
        response.status(200).send(admin);
    }

    // //endpoint for setting a member as admin
    @Get('/addMember/:id1/:id2')
    async setAdmin(@Param() login: string, @Param() room: number, @Req() request, @Res() response) {
        console.log("Set Admin");
        const admin = await this.playerService.setAdmin(login['id1'], room['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
            }
        )
        response.status(200).send(admin);
    }

    //endpoint for banning member
    @Get('/banMember/:id1/:id2')
    async banMember(@Param() login: string, @Param() room: number, @Req() request, @Res() response) {
        console.log("Ban Member");
        // const if_admin await this.playerService.getPermissions(request.user, room['id2']);
        // if(if_admin === "admin" || if_admin === "owner"){
        const ban = await this.playerService.banMember(login['id1'], room['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
            }
        )
        response.status(200).send(ban);
    // }
    //else 
    //throw error
    }

    // //endpoint for muting member
    @Get('/muteMember/:id1/:id2')
    async muteMember(@Param() login: string, @Param() room: number, @Req() request, @Res() response) {
        console.log("Mute Member");
        const mute = await this.playerService.muteMember(login['id1'], room['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
            }
        )
        response.status(200).send(mute);
    }

    @Get('/unmuteMember/:id1/:id2')
    async unmuteMember(@Param() login: string, @Param() room: number, @Req() request, @Res() response) {
        console.log("Mute Member");
        const mute = await this.playerService.unmuteMember(login['id1'], room['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
            }
        )
        response.status(200).send(mute);
    }

    // //endpoint for leaving a room
    @Get('/leaveRoom/:id1/:id2')
    async leaveRoom(@Param() login: string, @Param() room: number, @Req() request, @Res() response) {
        console.log("Leave Room");
        const leave = await this.playerService.leaveChannel(login['id1'], room['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
            }
        )
        response.status(200).send(leave);
    }
}
