import { Controller, Get, Param, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { PlayerService } from './player.service';
import { AuthGuard } from '@nestjs/passport';
import { userInfo } from 'os';

@Controller('player')
@UseGuards(AuthGuard('jwt'))
export class PlayerController {
    constructor(private readonly playerService: PlayerService) {}
    @Get('myprofile')
	async login(@Req() request, @Res() response) {
        console.log("MY PROFILE");
        const user =  await this.playerService.findPlayer(request.user.nickname);
        response.set({
            'Access-Control-Allow-Origin' : 'http://localhost:3000'
                 }
            )
        response.status(200).send(user);
        return user;

		//return user;
    }

    // This is for guetting player profile
    @Get(':id')
	async getProfile(@Param() login: string ,@Req() request, @Res() response) {
        console.log("Profile of another Player");
        const user =  await this.playerService.findPlayer(login);
        response.set({
            'Access-Control-Allow-Origin' : 'http://localhost:3000'
                 }
            )
        response.status(200).send(user);
        return user;

		//return user;
    }

        // 5- list of friends
        @Get('/listOfFriends')
        async GetListOfFriends(@Req() request, @Res() response) {
            console.log("List of Friends");
            const friends =  await this.playerService.getAllFriends(request.user);
    
            response.set({
                'Access-Control-Allow-Origin' : 'http://localhost:3000'
                     }
                )
            response.status(200).send(friends);
            //return friends;      
        }


        // --------------------------------------------------------------------------------//
    //1- create
    @Get('/createFriendshipmlabrayj')
    async CreateFriendship(@Req() request, @Res() response) {
        console.log("Check if Friend");
        const friend =  await this.playerService.createFriendship(request.user, "mlabrayj");
        response.status(200).send(friend);
        //return friend;
    }

    @Get('/createFriendshipisghioua')
    async CreateFriendshipto(@Req() request, @Res() response) {
        console.log("Check if Friend");
        const friend =  await this.playerService.createFriendship(request.user, "isghioua");
        response.status(200).send(friend);
        //return friend;
    }
    // 2- accept
    @Get('/acceptFriendshipmlabrayj')
    async AcceptFriend(@Req() request, @Res() response) {
        console.log("Check if Friend");
        const friend =  await this.playerService.acceptFriendship(request.user, "mlabrayj");
        response.status(200).send(friend);
        //return friend;
    }

    @Get('/acceptFriendshipisghioua')
    async AcceptFriendto(@Req() request, @Res() response) {
        console.log("Check if Friend");
        const friend =  await this.playerService.acceptFriendship(request.user, "isghioua");
        response.status(200).send(friend);
        //return friend;
    }

    // 3- check if friend
    @Get('/checkisghioua')
    async CheckFriendship(@Req() request, @Res() response) {
        console.log("Check if Friend");
        const friend =  await this.playerService.getFriend(request.user, "isghioua");
        
        if (friend && friend.status === "friend") // condition
        {
            console.log("isghioua is my friend");
        }
        else
            console.log("isghioua is not my friend");

            response.set({
                'Access-Control-Allow-Origin' : 'http://localhost:3000'
                     }
                )
        response.status(200).send(friend);
        return friend;
    }

    @Get('/checkmlabrayj')
    async CheckFriendshipto(@Req() request, @Res() response) {
        console.log("Check if Friend");
        const friend =  await this.playerService.getFriend(request.user, "mlabrayj");

        if (friend && friend.status === "friend") // condition
        {
            console.log("mlabrayj is my friend");
        }
        else
            console.log("mlabrayj is not my friend");
        response.status(200).send(friend);
        return friend;
    }

    // 4- block friend
    @Get('/blockmlabrayj')
    async BlockFriendship(@Req() request, @Res() response) {
        console.log("Check if Friend");
        const friend =  await this.playerService.blockFriendship(request.user, "mlabrayj");
        response.status(200).send(friend);
        //return friend;
    }

    @Get('/blockisghioua')
    async BlockFriendshipto(@Req() request, @Res() response) {
        console.log("Check if Friend");
        const friend =  await this.playerService.blockFriendship(request.user, "isghioua");
        response.status(200).send(friend);
        //return friend;
    }
       // ---------------------------------------------------------------// 
}
