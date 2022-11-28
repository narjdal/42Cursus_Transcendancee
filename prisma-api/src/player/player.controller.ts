import { Body, Controller, Get, Param, Post, Req, Request, Res, UseGuards, NotFoundException, HttpException } from '@nestjs/common';
// import { Response } from 'express';
import { PlayerService } from './player.service';
import { AuthGuard } from '@nestjs/passport';
import { userInfo } from 'os';
import { resourceUsage } from 'process';
import { NotFoundError } from 'rxjs';

@Controller('player')
@UseGuards(AuthGuard('jwt'))
// JWT Guard return in user object
export class PlayerController {
    constructor(private readonly playerService: PlayerService) { }
    @Get('myprofile') // localhost:3000/account 
    async login(@Req() request, @Res() response) //:Promise<Profile>
    {
        console.log("----------------- myprofile -----------------", request.user.id);
        const profile = await this.playerService.findPlayerById(request.user.id);

        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        console.log("----------------- myprofile -----------------", profile.nickname);
        response.status(200).send(profile);
        return profile;
    }

    // This is for guetting player profile
    @Get('/profile/:id') // id is player
    async getProfile(@Param() nickname: string, @Req() request, @Res() response) //:Promise<Profile>
    {
        console.log("----------------- Profile of this nickname -----------------", request.user.id, " ", nickname);
        const profile = await this.playerService.findPlayerByNickname(nickname['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        })
        console.log("----------------- Profile of this nickname -----------------");
        response.status(200).send(profile);
        return profile;
    }

    // ----------------------------- List of Members ----------------

    @Get('/listOfFriends') // no checks for now
    async GetListOfFriends(@Req() request, @Res() response) {
        console.log("---------------- List of Friends ----------------", request.user.id);
        const friends = await this.playerService.getAllFriends(request.user.id);

        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        console.log("--------------------------------");
        response.status(200).send(friends);
        return friends;
    }

    @Get('/listOfMembers/:id') // check if id room exists ==> getProfilesOfChatRooms
    async GetListOfMembers(@Param() id_room: String, @Req() request, @Res() response) {
        console.log("-------------------List of Members-------------------");

        // check if id_room exist

        const friends = await this.playerService.getProfilesOfChatRooms(request.user.id, id_room['id']);

        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        console.log("--------------------------------");
        response.status(200).send(friends);
        return friends;
    }

    @Get('/listToAddFriend/:id') // check if id room exists
    async GetListOfAddFriends(@Param() id_room: String, @Req() request, @Res() response) {
        console.log("---------------List To ADD Friends -----------------");

        // check if id_room exist
        // check permission of user admin or owner or a member
        const friends = await this.playerService.getListOfFriendsToAddinThisRoom(request.user.id, id_room['id']);

        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        console.log("--------------------------------");
        response.status(200).send(friends);
        return friends;
    }

    @Get('/listOfSetAdmin/:id') // check if id room exists
    async GetListOfSetAdmin(@Param() id_room: String, @Req() request, @Res() response) {
        console.log("-------------- List of Friends to Set Admin ----------------");
        // check if id_room exist
        // check permission of user is owner

        const friends = await this.playerService.getListOfFriendsToUpgradeAdmininThisRoom(request.user.id, id_room['id']);    

        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        console.log("--------------------------------");
        response.status(200).send(friends);
        return friends;
    }

    @Get('/listToMute/:id') // check if id room exists
    async GetListOfMembersToMute(@Param() id_room: String, @Req() request, @Res() response) {
        console.log("-------------- List to Mute ----------------");
        // check if id_room exist
        const friends = await this.playerService.getListOfFriendsToMuteinThisRoom(request.user.id, id_room['id']);    

        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        console.log("--------------------------------");
        response.status(200).send(friends);
        return friends;
    }

    @Get('/listOfUnmute/:id') // check if room exists
    async GetListOfMembersToUnmute(@Param() id_room: String, @Req() request, @Res() response) {
        console.log("---------------List to Unmute ----------------");
        // check if id_room exist
        // check permission of user admin or owner
        const friends = await this.playerService.getListOfFriendsToUnmuteinThisRoom(request.user.id, id_room['id']);    

        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        console.log("--------------------------------");
        response.status(200).send(friends);
        return friends;
    }

    @Get('/listToBan/:id') // check if room exists
    async GetListOfMembersToBan(@Param() id_room: String, @Req() request, @Res() response) {
        console.log("---------------List To Ban -----------------");
        // check if id_room exist
        // check permission of user admin or owner
        const friends = await this.playerService.getListOfFriendsToBaninThisRoom(request.user.id, id_room['id']);    

        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        console.log("--------------------------------");
        response.status(200).send(friends);
        return friends;
    }

    // ---------------------------------- Frienships ----------------------------------

    @Get('/statusFriendship/:id') // check if nickname exist
    async checkStatusFriendship(@Param() login: string, @Req() request, @Res() response) {
        console.log("--------------- status -----------------");
        const membership = await this.playerService.getFriend(request.user.id, login['id']);

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

    @Get('/requestFriendship/:id') // check if nickname exist
    async RequestFriendship(@Param() login: String, @Req() request, @Res() response) {
        console.log("Request Friendship");
        const friend = await this.playerService.createFriendship(request.user.id, login['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        response.status(200).send(friend);
    }

    @Get('/acceptFriendship/:id') // check if nickname exist
    async AcceptFriendship(@Param() login: String, @Req() request, @Res() response) {
        console.log("Accept Friendship");
   
        // check login exist
        const friend = await this.playerService.acceptFriendship(request.user.id, login['id']);
        await this.playerService.createDMRoom(request.user.id, login['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        response.status(200).send(friend);
    }

    @Get('/refuseFriendship/:id') // check if nickname exist
    async RefuseFriendship(@Param() login: String, @Req() request, @Res() response) {
        console.log("Refuse Friendship");
        const friend = await this.playerService.refuseFriendship(request.user.id, login['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        response.status(200).send(friend);
    }

    @Get('/blockFriendship/:id') // check if nickname exist
    async BlockFriendship(@Param() login: String, @Req() request, @Res() response) {
        console.log("Block Friendship");
        const friend = await this.playerService.blockFriendship(request.user.id, login['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        response.status(200).send(friend);
    }

    @Get('/unblockFriendship/:id') // check if nickname exist
    async UnblockFriendship(@Param() login: String, @Req() request, @Res() response) {
        console.log("Unblock Friendship");
        const friend = await this.playerService.deleteFriendship(request.user.id, login['id']);
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
        
    //     // if profile is banned, he can't send message
    //     const status = await. this.playerService.getPermissions(request.user.id, i);
    //     const status = await this.prisma.permision.findFirst({
    //         where: {
    //             AND: [
    //                 { playerId: me.id },
    //                 { roomId: id_room },
    //             ]
    //         }
    //     });

    //     const message = await this.playerService.sendMessage(request.user.id, login, request.body.message);
    //     response.set({
    //         'Access-Control-Allow-Origin': 'http://localhost:3000'
    //     }
    //     )
    //     response.status(200).send(message);
    // }

// ---------------------------------- CONTROLLER Permission in room ---------------------------------- //

    @Get('/listOfRooms') // no check to do 
    async GetListOfRooms(@Req() request, @Res() response) {
        console.log("--------------- List of Rooms -----------------");
        const rooms = await this.playerService.getAllRooms(request.user.id);

        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        console.log("--------------------------------");
        response.status(200).send(rooms);
        return rooms;
    }

    @Post('/createChatRoom/Public') // no check if name exist choose another name 
    async CreatePublicChatRoom(@Body() Body, String, @Req() request, @Res() response) {
        console.log("----------------- Create Public Chat Room -----------------");
        const room = await this.playerService.createPublicChatRoom(request.user.id, Body.name);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        console.log("--------------------------------");
        response.status(200).send(room);
    }

    @Post('/createChatRoom/Private')
    async CreatePrivateChatRoom(@Body() Body, String, @Req() request, @Res() response) {
        console.log("---------------- Create Private Chat Room ----------------");
        const room = await this.playerService.createPrivateChatRoom(request.user.id, Body.name);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        response.status(200).send(room);
    }

    @Post('/createChatRoom/Protected')
    async CreateProtectedChatRoom(@Body() Body, String, @Req() request, @Res() response) {
        console.log("------------------- Create Protected Chat Room -------------------");
        const room = await this.playerService.createProtectedChatRoom(request.user.id, Body.name, Body.password);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        console.log("--------------------------------");
        response.status(200).send(room);
    }

    @Get('/GetRoomById/:id')
    async GetRoomById(@Param() id_room: String, @Req() request, @Res() response) {
        console.log("-------------- Get Room By Id --------------");
        const room = await this.playerService.getRoomById(id_room['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        console.log("--------------------------------");
        response.status(200).send(room);
    }

    @Get('/Permission/:id') //POST REQUEST // id is roon id 
    async GetPermission(@Param() id_room: String, @Req() request, @Res() response) {
        console.log("------------------- Get Permission-------------------");
        const permission = await this.playerService.getPermissions(request.user.id, id_room['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        console.log("--------------------------------");
        response.status(200).send(permission);
        return permission;
    }

    // //endpoint for setting a member as admin
    @Get('/addMember/:id1/:id2')
    async addMember(@Param() login: string, @Param() room: String ,@Req() request, @Res() response) {
        console.log("------------------ Add Member ------------------");
        // check if room_id exists
        // check if room_id is not a dm
        // check if nickname is not a member of room_id already
        // check if user status permission is an owner or admin
        const admin = await this.playerService.addMember(login['id1'], room['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
            }
        )
        console.log("--------------------------------");
        response.status(200).send(admin);
    }

    // //endpoint for setting a member as admin
    @Get('/setAdmin/:id1/:id2')
    async setAdmin(@Param() login: string, @Param() room: String, @Req() request, @Res() response) {
        console.log("Set Admin");
        // check if room_id exists
        // check if room_id is not a dm
        // check if nickname is a member of room_id with status member
        // check if user status permission is an owner or admin
        const admin = await this.playerService.setAdmin(login['id1'], room['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
            }
        )
        response.status(200).send(admin);
    }

    //endpoint for banning member
    @Get('/banMember/:id1/:id2')
    async banMember(@Param() login: string, @Param() room_id: string, @Req() request, @Res() response) {
        console.log("Ban Member");
       // 1- check if room_id exists
       const room = await this.playerService.findRoomById(room_id['id']);
       // 2- check if room_id is not a dm
       if(room.is_dm === true)
       {
           throw new NotFoundException("Cannot leave a DM");
       }
       // 3- check if user is member of this room
       const member = await this.playerService.getPermissions(request.user.id, room_id['id']);
       //4- check if nickname is a status in room_id with status member And Muted
       if (member.statusMember !== "member" || member.is_banned === true || member.is_banned === false)
       {
           throw new NotFoundException("Cannot mute this player");
       }
       //5- check if user status permission is an owner or admin
       const admin = await this.playerService.getPermissions(request.user.id, room_id['id']);
       if (admin.statusMember !== "admin" && admin.statusMember !== "owner")
       {
           throw new NotFoundException("Cannot mute this player");
       }
       //6- ban
        // const if_admin await this.playerService.getPermissions(request.user.id, room['id2']);
        // if(if_admin === "admin" || if_admin === "owner"){

        // check if room_id exists
        // check if room_id is not a dm
        // check if nickname is a member of room_id with status member
        // check if user status permission is an owner or admin
        const ban = await this.playerService.banMember(login['id1'], room['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
            }
        )
        response.status(200).send(ban);
    }

    @Get('/kickMember/:id1/:id2') // kick member or admin
    async kickMember(@Param() login: string, @Param() room_id: String, @Req() request, @Res() response) {
        console.log("Kick Member");
       // 1- check if room_id exists
       const room = await this.playerService.findRoomById(room_id['id']);
       // 2- check if room_id is not a dm
       if(room.is_dm === true)
       {
           throw new NotFoundException("Cannot leave a DM");
       }
       // 3- check if user is member of this room
       const member = await this.playerService.getPermissions(request.user.id, room_id['id']);
       //4- check if nickname is a status in room_id with status member And Muted
       if (member.statusMember !== "member")
       {
           throw new NotFoundException("Cannot mute this player");
       }
       //5- check if user status permission is an owner or admin
       const admin = await this.playerService.getPermissions(request.user.id, room_id['id']);
       if (admin.statusMember !== "admin" && admin.statusMember !== "owner")
       {
           throw new NotFoundException("Cannot mute this player");
       }
       //6- kick member
        const kick = await this.playerService.kickMember(login['id1'], room_id['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
            }
        )
        response.status(200).send(kick);
    }

    // @Get('/kick/:id1/:id2')
    // async kickMember(@Param() login: string, @Param() room_id: String, @Req() request, @Res() response) {
    //     // console.log("Kick Member");
    //    // 1- check if room_id exists
    //    const room = await this.playerService.findRoomById(room_id['id']);
    //    // 2- check if room_id is not a dm
    //    if(room.is_dm === true)
    //    {
    //        throw new NotFoundException("Cannot leave a DM");
    //    }
    //    // 3- check if user is member of this room
    //    const member = await this.playerService.getPermissions(request.user.id, room_id['id']);
    //    //4- check if nickname is a status in room_id with status member And Muted
    //    if (member.statusMember !== "member" || member.is_banned === true || member.is_muted === true)
    //    {
    //        throw new NotFoundException("Cannot mute this player");
    //    }
    //    //5- check if user status permission is an owner or admin
    //    const admin = await this.playerService.getPermissions(request.user.id, room_id['id']);
    //    if (admin.statusMember !== "admin" && admin.statusMember !== "owner")
    //    {
    //        throw new NotFoundException("Cannot mute this player");
    //    }
    //    //6- ban member
    //     const ban = await this.playerService.kickMember(login['id1'], room_id['id2']);
    //     response.set({
    //         'Access-Control-Allow-Origin': 'http://localhost:3000'
    //         }
    //     )
    //     response.status(200).send(ban);
    // }

    // //endpoint for muting member
    @Get('/muteMember/:id1/:id2') // post need time til muted
    async muteMember(@Param() login: string, @Param() room_id: String, @Req() request, @Res() response) {
        console.log("Mute Member");

        // 1- check if room_id exists
        const room = await this.playerService.findRoomById(room_id['id']);
        // 2- check if room_id is not a dm
        if(room.is_dm === true)
        {
            throw new NotFoundException("Cannot leave a DM");
        }
        // 3- check if user is member of this room
        const member = await this.playerService.getPermissions(request.user.id, room_id['id']);
        //4- check if nickname is a status in room_id with status member And Muted
        if (member.statusMember !== "member" || member.is_banned === true || member.is_muted === true)
        {
            throw new NotFoundException("Cannot mute this player");
        }
        //5- check if user status permission is an owner or admin
        const admin = await this.playerService.getPermissions(request.user.id, room_id['id']);
        if (admin.statusMember !== "admin" && admin.statusMember !== "owner")
        {
            throw new NotFoundException("Cannot mute this player");
        }
        //6- mute member
        const mute = await this.playerService.muteMember(login['id1'], room_id['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
            }
        )
        return response.status(200).send(mute);
    }

    @Get('/unmuteMember/:id1/:id2')
    async unmuteMember(@Param() nickname: string, @Param() room_id: String, @Req() request, @Res() response) {
        console.log("Mute Member");

        // 1- check if room_id exists
        const room = await this.playerService.findRoomById(room_id['id']);
        // 2- check if room_id is not a dm
        if(room.is_dm === true)
        {
            throw new NotFoundException("Cannot leave a DM");
        }
        // 3- check if User is Member of this room
        const member = await this.playerService.getPermissions(request.user.id, room_id['id']);
        //4- check if Nickname is a status in room_id with status Member And Muted
        if (member.statusMember !== "member" || member.is_muted === true)
        {
            throw new NotFoundException("Cannot unmute this player");
        }
        //5- check if user status permission is an owner or admin
        const admin = await this.playerService.getPermissions(request.user.id, room_id['id']);
        if (admin.statusMember !== "admin" && admin.statusMember !== "owner")
        {
            throw new NotFoundException("Cannot unmute this player");
        }
        //6- unmute member
        const mute = await this.playerService.unmuteMember(nickname['id1'], room_id['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        })
        return response.status(200).send(mute);
    }

    // //endpoint for leaving a room
    @Get('/leaveRoom/:id')
    async leaveRoom(@Param() room_id: String, @Req() request, @Res() response) {
        console.log("Leave Room");

        // 1- check if room_id exists
        const room = await this.playerService.findRoomById(room_id['id']);
        // 2- check if room_id is not a dm
        if(room.is_dm === true)
        {
            throw new NotFoundException("Cannot leave a DM");
        }
        // 3- check if user is member of this room
        const member = await this.playerService.getPermissions(request.user.id, room_id['id']);
        // 4- then leave room
        const leave = await this.playerService.leaveChannel(request.user.id, room_id['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
            }
        )
        return response.status(200).send(leave);
    }

    @Get('/getmessages/:id')
    async getMessages(@Param() room_id: String, @Req() request, @Res() response) {
        console.log("----------------------- Get Messages -----------------------", room_id['id']);

        const room = await this.playerService.findRoomById(room_id['id']);
        if(!room)
        {
            throw new NotFoundException("Room not found");
        }

        //check if user is member of this room
        // const member = await this.playerService.getPermissions(request.user.id, room_id['id']);
        // if(!member)
        // {
        //     throw new NotFoundException("User not found");
        // }


        const messages = await this.playerService.getMessagesOfRoom(request.user, room_id['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
            }
        )
        response.status(200).send(messages);
        return messages;
    }

    @Get('/joinRoom/:id')
    async joinRoom(@Param() room_id: String, @Req() request, @Res() response) {
        console.log("---------------- Join Room ----------------", room_id['id']);

        // 1- check if room_id exists
        console.log(room_id['id']);
        const room = await this.playerService.findRoomById(room_id['id']);
        

        // 2- check if room_id is not a dm
        if(room.is_dm === true)
        {
            throw new NotFoundException("Cannot join a DM");
        }
        if(room.is_public === false)
        {
            throw new NotFoundException("cannot join a private room");
        }

        // 3- check if user is member of this room
        const member = await this.playerService.getPermissions(request.user.id, room_id['id']);
        if(member)
        {
            throw new NotFoundException("Already a member");
        }

        // 4- then join room
        const join = await this.playerService.joinRoom(request.user.id, room_id['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        })
        console.log("----------------------------------");
        return response.status(200).send(join);
    }
}

