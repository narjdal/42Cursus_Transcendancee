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
    @Get(':id')
    async getProfile(@Param() login: string, @Req() request, @Res() response) {
        console.log("Profile of another Player");
        const user = await this.playerService.findPlayer(login['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        })

        response.status(200).send(user);
        return user;
    }

    // 5- list of friends
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

    @Get('/statusFriendship/:id')
    async checkStatusFriendship(@Param() login: string, @Req() request, @Res() response) {
        console.log("Check if Friend");
        const membership = await this.playerService.getFriend(request.user, login['id']);

        let choices: Array<String> = [];

        if (!membership) {
            choices = ['addFriend'];
        }
        else if (membership && membership.status === "friend") // condition
        {
            choices = ['blockFriend'];
        }
        else if (membership && membership.status === "blocked" && membership.senderId === request.user.id) // condition
        {
            choices = ['unblockFriend'];
        }
        else if (membership && membership.status === "pending" && membership.senderId === request.user.id) // condition
        {
            choices = ['pendingFriend'];
        }
        else if (membership && membership.status === "pending" && membership.receiverId === request.user.id) // condition
        {
            choices = ['acceptFriend', 'refuseFriend'];
        }
        else {
            choices = [''];
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
        const friend = await this.playerService.deleteFriendship(request.user, login['id']);
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
        const friend = await this.playerService.unblockFriendship(request.user, login['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        response.status(200).send(friend);
    }
// ---------------------------------- CONTROLLER Permission in room ---------------------------------- //

    //endpoint for banning member
    // @Get('/banMember')
    // async banMember(@Param() login: string, @Req() request, @Res() response) {
    //     console.log("Ban Member");
    //     const ban = await this.playerService.banMember(request.user, login['id']);
    //     response.set({
    //         'Access-Control-Allow-Origin': 'http://localhost:3000'
    //         }
    //     )
    //     response.status(200).send(ban);
    // }

    // //endpoint for muting member
    // @Get('/muteMember')
    // async muteMember(@Param() login: string, @Req() request, @Res() response) {
    //     console.log("Mute Member");
    //     const mute = await this.playerService.muteMember(request.user, login['id']);
    //     response.set({
    //         'Access-Control-Allow-Origin': 'http://localhost:3000'
    //         }
    //     )
    //     response.status(200).send(mute);
    // }


    // //endpoint for leaving a room
    // @Get('/leaveRoom')
    // async leaveRoom(@Param() login: string, @Req() request, @Res() response) {
    //     console.log("Leave Room");
    //     const leave = await this.playerService.leaveRoom(request.user, login['id']);
    //     response.set({
    //         'Access-Control-Allow-Origin': 'http://localhost:3000'
    //         }
    //     )
    //     response.status(200).send(leave);
    // }

    // //endpoint for setting a member as admin
    // @Get('/setAdmin')
    // async setAdmin(@Param() login: string, @Req() request, @Res() response) {
    //     console.log("Set Admin");
    //     const admin = await this.playerService.setAdmin(request.user, login['id']);
    //     response.set({
    //         'Access-Control-Allow-Origin': 'http://localhost:3000'
    //         }
    //     )
    //     response.status(200).send(admin);
    // }
}
