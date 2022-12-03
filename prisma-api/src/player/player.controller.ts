import { Body, Controller, Get, Param, Post, Req, Request, Res, UseGuards, NotFoundException, HttpException } from '@nestjs/common';
// import { Response } from 'express';
import { PlayerService } from './player.service';
import { AuthGuard } from '@nestjs/passport';
import { userInfo } from 'os';
import { resourceUsage } from 'process';
import { NotFoundError } from 'rxjs';
import { CreateProtectedRoomDto, JoinProtectedRoomDto, SetPwdToPublicChatRoomDto, UpdateProtectedPasswordDto} from './dtos/updatePlayer.dto';

@Controller('player')
@UseGuards(AuthGuard('jwt'))
// JWT Guard return in user object
export class PlayerController {
    constructor(private readonly playerService: PlayerService) { }
    @Get('myprofile') // localhost:3000/account 
    async login(@Req() request, @Res() response) //:Promise<Profile>
    {
        // console.log("----------------- myprofile -----------------", request.user.id);
        const profile = await this.playerService.findPlayerById(request.user.id);

        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        // console.log("----------------- Finish myprofile -----------------", profile.nickname);
        response.status(200).send(profile);
    }

    // This is for guetting player profile
    @Get('/profile/:id') // id is player
    async getProfile(@Param() nickname: string, @Req() request, @Res() response) //:Promise<Profile>
    {
        // console.log("----------------- Profile of this nickname -----------------", request.user.id, " ", nickname);
        const profile = await this.playerService.findPlayerByNickname(nickname['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        })
        // console.log("----------------- Finish Profile of this nickname -----------------");
        response.status(200).send(profile);
    }

    // ---------------------------------- Frienships ----------------------------------

    // @Get('/isFriend/:id') // id is player
    // async isFriend(@Param() login: string, @Req() request, @Res() response) //:Promise<Profile>
    // {
    //     // console.log("----------------- isFriend -----------------", request.user.id, " ", login);
    //     const isFriend = await this.playerService.getFriendshipStatus(request.user.id, login['id']);
    //     if (isFriend.status == "friends") {
    //         response.status(200).send(true);
    //     }
    //     else {
    //         response.status(200).send(false);
    //     }
    // }

    @Get('/statusFriendship/:id') // check if nickname exist
    async checkStatusFriendship(@Param() login: string, @Req() request, @Res() response) {
        // console.log("--------------- Status -----------------");
        const membership = await this.playerService.getFriendshipStatus(request.user.id, login['id']);

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
        else { // they used to be blocked now they wanna be friends again
            choices = ['']; 
        }

        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        // console.log("---------- Finish Status-----------------");
        response.status(200).send(choices);
    }

    @Get('/requestFriendship/:id') // check if nickname exist
    async RequestFriendship(@Param() login: string, @Req() request, @Res() response) {
        // console.log("-------------- Request Friendship ----------------");

        const friend = await this.playerService.createFriendship(request.user.id, login['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        // console.log("-------------- Finish Request Friendship ------------------");
        response.status(200).send({
                message: "Friendship request sent"
            }
        );
    }

    @Get('/acceptFriendship/:id') // check if nickname exist
    async AcceptFriendship(@Param() login: string, @Req() request, @Res() response) {
        // console.log("---------------- Accept Friendship ----------------");
   
        // 1- check login exist
        const friend = await this.playerService.acceptFriendship(request.user.id, login['id']);
        // 2- Check if their is a room chat between them
        const room  = await this.playerService.getRoomBetweenTwoPlayers(request.user.id, login['id']);
        if (room === null)
        {
            // 2.1- if not create a room chat between them
            await this.playerService.createDMRoom(request.user.id, login['id']);
        }

        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        // console.log("---------------- Finish Accept Friendship ------------------");
        response.status(200).send({
            message: "Friendship Accepted"
        });
    }

    @Get('/refuseFriendship/:id') // check if nickname exist
    async RefuseFriendship(@Param() login: string, @Req() request, @Res() response) {
        // console.log("----------------- Refuse Friendship ----------------");
        const friend = await this.playerService.refuseFriendship(request.user.id, login['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        // console.log("----------------- Finish Refuse Friendship ------------------");
        response.status(200).send(
            {
            message: "Friendship refused"
        });
    }

    @Get('/blockFriendship/:id') // check if nickname exist
    async BlockFriendship(@Param() login: string, @Req() request, @Res() response) {
        // console.log("------------------ Block Friendship ----------------");
        const friend = await this.playerService.blockFriendship(request.user.id, login['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        // console.log("------------------ Finish Block Friendship ------------------");
        response.status(200).send({
            message: "Friendship blocked"
            }
        );
    }

    @Get('/unblockFriendship/:id') // check if nickname exist
    async UnblockFriendship(@Param() login: string, @Req() request, @Res() response) {
        // console.log("---------------- Unblock Friendship ----------------");
        const friend = await this.playerService.deleteFriendship(request.user.id, login['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        // console.log("---------------- Finish Unblock Friendship ------------------");
        response.status(200).send({
            message: "Friendship unblocked"
        });
    }

    // ----------------------------- List of Members ----------------

    @Get('/listOfFriends') // no checks for now
    async GetListOfFriends(@Req() request, @Res() response) {
        // console.log("---------------- List of Friends ----------------", request.user.id);
        const friends = await this.playerService.getAllFriends(request.user.id);
        // console.log("List of Friends", friends);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        // console.log("-------------  Finish List of Friends   -------------------");
        response.status(200).send(friends);
    }

    @Get('/listOfMembers/:id') // check if id room exists ==> getProfilesOfChatRooms
    async GetListOfMembers(@Param() id_room: string, @Req() request, @Res() response) {
        // console.log("-------------------List of Members-------------------");

        // 1- check if room_id exists
        const room = await this.playerService.findRoomById(id_room['id']);
        // 2- check if room_id is not a dm
        if(room.is_dm === true) {
            throw new NotFoundException("Is a DM");
        }
        // 3- check if the user is in the room
        const permision = await this.playerService.getPermissions(request.user.id, id_room['id']);
        if (permision === null) {
            throw new NotFoundException("You are not in this room");
        }
        // 4- Get list of members of this room, and check if I am member of this room
        const friends = await this.playerService.getProfilesOfChatRooms(request.user.id, id_room['id']);

        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        // console.log("------------ Finish List of Members---------------");
        response.status(200).send(friends);
    }

    @Get('/listToAddFriend/:id') // check if id room exists
    async GetListOfAddFriends(@Param() id_room: string, @Req() request, @Res() response) {
        // console.log("\n---------------List To ADD Friends -----------------", request.user.id, " ", id_room['id']);

        // 1- check if room_id exists
        const room = await this.playerService.findRoomById(id_room['id']);
        // 2- check if room_id is not a dm
        if(room.is_dm === true) {
            throw new NotFoundException("Is a DM");
        }
        // 3- check if the user is in the room
        const permision = await this.playerService.getPermissions(request.user.id, id_room['id']);
        if (permision === null) {
            throw new NotFoundException("You are not in this room");
        }
        // 4- Get list of members to add in this room, and check if I am member of this room
        const friends = await this.playerService.getListOfFriendsToAddinThisRoom(request.user.id, id_room['id']); /// PRRRRRRR


        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        // console.log("-------------- FINISH getListOfFriendsTo ------------------");
        response.status(200).send(friends);
    }

    // //endpoint for setting a member as admin
    @Get('/addMember/:id1/:id2')
    async addMember(@Param() login: string, @Param() room_id: string ,@Req() request, @Res() response) {
        // console.log("------------------ Add Member ------------------");

        // 1- check if room_id exists
        const room = await this.playerService.findRoomById(room_id['id2']);
        console.log(room)
        // 2- check if room_id is not a dm
        if(room.is_dm === true)
        {
            throw new NotFoundException("Is a DM");
        }
        // 3- check if nickname is not a member of room_id already
        const member = await this.playerService.findPlayerByNickname(login['id1']);
        const status = await this.playerService.getPermissions(member.id, room_id['id2']);
        if(status !== null){
            throw new NotFoundException("You are already a member of this room");
        }
        // 4- check if user status permission is an owner or admin
        const admin = await this.playerService.getPermissions(request.user.id, room_id['id2']);
        if(admin === null){
            throw new NotFoundException("You are not a member of this room");
        }
        // 5- add member to room
        await this.playerService.addMember(login['id1'], room_id['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
            }
        )
        // console.log("------------------ Finish Add Member ------------------");
        // response.status(200).send(admin);
        response.send({
            message: "Member added"
        });
    }

    @Get('/listOfSetAdmin/:id') // check if id room exists
    async GetListOfSetAdmin(@Param() id_room: string, @Req() request, @Res() response) {
        // console.log("-------------- List of Friends to Set Admin ----------------");

        // 1- check if id_room exists and is not a DM
        const room = await this.playerService.findRoomById(id_room['id']);
        if(room.is_dm === true)
        {
            throw new NotFoundException("Is a DM");
        }
        // 2- check permission of user is owner or admin
        const permission = await this.playerService.getPermissions(request.user.id, id_room['id']);
        if (permission === null) {
            throw new NotFoundException("You are not a member of this room");
        }
        if (permission.statusMember === "member") {
            throw new NotFoundException("You are not an admin or owner of this room");
        }
        // 3- Get list of members to add in this room, and check if I am member of this room
        const friends = await this.playerService.getListOfFriendsToUpgradeAdmininThisRoom(request.user.id, id_room['id']);    

        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        // console.log("-------------- Finish List of Friends to Set Admin------------------");
        response.status(200).send(friends);
    }

    // //endpoint for setting a member as admin
    @Get('/setAdmin/:id1/:id2')
    async setAdmin(@Param() login: string, @Param() room_id: string, @Req() request, @Res() response) {
        // console.log("---------------- Set Admin ----------------");


        // 1- check if room_id exists and is not a DM
        const room = await this.playerService.findRoomById(room_id['id2']);
        if(room.is_dm === true)
        {
            throw new NotFoundException("Is a DM");
        }
        // 2- check if login is member of this room
        const member = await this.playerService.findPlayerByNickname(login['id1']);
        const status = await this.playerService.getPermissions(member.id, room_id['id2']);
        if(status === null){
            throw new NotFoundException("You are not a member of this room");
        }
        // 3- check if login status in room is member and NOT Muted
        if (status.statusMember !== "member" || status.is_banned === true || status.is_muted === true)
        {
            throw new NotFoundException("Cannot set this player as Admin");
        }
        // 4- check if user status permission is an owner or admin
        const admin = await this.playerService.getPermissions(request.user.id, room_id['id2']);
        if(admin === null){
            throw new NotFoundException("You are not a member of this room");
        }
        if (admin.statusMember !== "admin" && admin.statusMember !== "owner")
        {
            throw new NotFoundException("You cannot set this player as Admin");
        }
    
        const result = await this.playerService.setAdmin(login['id1'], room_id['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
            }
        )
        response.status(200).send({
            message: "Admin set"
        });
    }

    @Get('/listToMute/:id') // check if id room exists
    async GetListOfMembersToMute(@Param() id_room: string, @Req() request, @Res() response) {
        // console.log("-------------- List to Mute ----------------");
        
        // 1- check if room_id exists
        const room = await this.playerService.findRoomById(id_room['id']);
        // 2- check if room_id is not a dm
        if(room.is_dm === true) {
            throw new NotFoundException("Is a DM");
        }
        // 3- check if the user is in the room
        const permision = await this.playerService.getPermissions(request.user.id, id_room['id']);
        if (permision === null) {
            throw new NotFoundException("You are not in this room");
        }
        // 3- get list of members to mute
        const friends = await this.playerService.getListOfFriendsToMuteinThisRoom(request.user.id, id_room['id']);    

        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        // console.log("-------------- Finish List to Mute-------");
        response.status(200).send(friends);
    }

   // //endpoint for muting member
   @Get('/muteMember/:id1/:id2') // post need time til muted
   async muteMember(@Param() login: string, @Param() room_id: string, @Req() request, @Res() response) {
       // console.log("Mute Member");

        // 1- check if room_id exists
       const room = await this.playerService.findRoomById(room_id['id2']);
    //    console.log(room)
       // 2- check if room_id is not a dm
       if(room.is_dm === true)
       {
           throw new NotFoundException("Is a DM");
       }
       // 3- check if login is member of this room
        const member = await this.playerService.findPlayerByNickname(login['id1']);
       const status = await this.playerService.getPermissions(member.id, room_id['id2']);
       if(status === null){
            throw new NotFoundException("You are not a member of this room");
        }
       //4- check if nickname is a status in room_id with status member And Muted
       if (status.statusMember !== "member" || status.is_banned === true || status.is_muted == true)
       {
           throw new NotFoundException("Cannot mute this player");
       }
       //5- check if user status permission is an owner or admin
       const admin = await this.playerService.getPermissions(request.user.id, room_id['id2']);
        if(admin === null){
            throw new NotFoundException("You are not a member of this room");
        }
       if (admin.statusMember !== "admin" && admin.statusMember !== "owner")
       {
           throw new NotFoundException("You cannot mute this player");
       }

       //6- mute member
       const mute = await this.playerService.muteMember(login['id1'], room_id['id2']);
       response.set({
           'Access-Control-Allow-Origin': 'http://localhost:3000'
           }
       )

       response.status(200).send({
              message: "Member muted"
       });
   }

    @Get('/listOfUnmute/:id') // check if room exists
    async GetListOfMembersToUnmute(@Param() id_room: string, @Req() request, @Res() response) {
        // console.log("---------------List to Unmute ----------------");
        // 1- check if room_id exists
        const room = await this.playerService.findRoomById(id_room['id']);
        // 2- check if room_id is not a dm
        if(room.is_dm === true) {
            throw new NotFoundException("Is a DM");
        }
        // 3- check if the user is in the room
        const permision = await this.playerService.getPermissions(request.user.id, id_room['id']);
        if (permision === null) {
            throw new NotFoundException("You are not in this room");
        }
        // 4- check permission of user admin or owner
        const admin = await this.playerService.getPermissions(request.user.id, id_room['id']);
        if(admin === null){
            throw new NotFoundException("You are not a member of this room");
        }
        if (admin.statusMember !== "admin" && admin.statusMember !== "owner")
        {
           throw new NotFoundException("You cannot unmute this player");
        }
        // 5- get list of members to mute
        const friends = await this.playerService.getListOfFriendsToUnmuteinThisRoom(request.user.id, id_room['id']);    

        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        // console.log("----------- Finish List to Unmute-----------");
        response.status(200).send(friends);
    }

    @Get('/unmuteMember/:id1/:id2')
    async unmuteMember(@Param() nickname: string, @Param() room_id: string, @Req() request, @Res() response) {
        // console.log("Mute Member");

        // 1- check if room_id exists
        const room = await this.playerService.findRoomById(room_id['id2']);
        // 2- check if room_id is not a dm
        if(room.is_dm === true)
        {
           throw new NotFoundException("Is a DM");
        }
        // 3- check if login is member of this room
        const member = await this.playerService.findPlayerByNickname(nickname['id1']);
        const status = await this.playerService.getPermissions(member.id, room_id['id2']);
        if(status === null){
            throw new NotFoundException("You are not a member of this room");
        }
        // 4- check if nickname is a status in room_id with status member And Muted
        if (status.statusMember !== "member" || status.is_muted === false)
        {
           throw new NotFoundException("Cannot unmute this player");
        }
        //5- check if user status permission is an owner or admin
        const admin = await this.playerService.getPermissions(request.user.id, room_id['id2']);
        if(admin === null){
            throw new NotFoundException("You are not a member of this room");
        }
        if (admin.statusMember !== "admin" && admin.statusMember !== "owner")
        {
           throw new NotFoundException("You cannot unmute this player");
        }
        //6- unmute member
        const mute = await this.playerService.unmuteMember(nickname['id1'], room_id['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        })
        
        response.status(200).send({
            message: "Member unmuted"
        });
    }

    @Get('/listToBan/:id') // check if room exists
    async GetListOfMembersToBan(@Param() id_room: string, @Req() request, @Res() response) {
        // console.log("---------------List To Ban -----------------");
        // 1- check if room_id exists
        const room = await this.playerService.findRoomById(id_room['id']);
        // 2- check if room_id is not a dm
        if(room.is_dm === true) {
            throw new NotFoundException("Is a DM");
        }
        // 3- check if the user is in the room
        const permision = await this.playerService.getPermissions(request.user.id, id_room['id']);
        if (permision === null) {
            throw new NotFoundException("You are not in this room");
        }
        // 4- check permission of user admin or owner
        const admin = await this.playerService.getPermissions(request.user.id, id_room['id']);
        if(admin === null){
            throw new NotFoundException("You are not a member of this room");
        }
        if (admin.statusMember !== "admin" && admin.statusMember !== "owner")
        {
           throw new NotFoundException("You cannot unmute this player");
        }
        // 5- get list of members to ban
        const friends = await this.playerService.getListOfFriendsToBaninThisRoom(request.user.id, id_room['id']);    

        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        // console.log("---------- Finish List To Ban-----------------");
        response.status(200).send(friends);
    }

    //endpoint for banning member
    @Get('/banMember/:id1/:id2')
    async banMember(@Param() login: string, @Param() room_id: string, @Req() request, @Res() response) {
        // console.log("Ban Member");

       // 1- check if room_id exists
       const room = await this.playerService.findRoomById(room_id['id2']);
       // 2- check if room_id is not a dm
       if(room.is_dm === true)
       {
           throw new NotFoundException("Is a DM");
       }
       // 3- check if login is member of this room
        const member = await this.playerService.findPlayerByNickname(login['id1']);
       const status = await this.playerService.getPermissions(member.id, room_id['id2']);
       if(status === null){
            throw new NotFoundException("You are not a member of this room");
        }
       //4- check if nickname is a status in room_id with status member And Muted
       if (status.statusMember !== "member" || status.is_banned === true)
       {
           throw new NotFoundException("Cannot ban this player");
       }
       //5- check if user status permission is an owner or admin
       const admin = await this.playerService.getPermissions(request.user.id, room_id['id2']);
        if(admin === null){
            throw new NotFoundException("You are not a member of this room");
        }
       if (admin.statusMember !== "admin" && admin.statusMember !== "owner")
       {
           throw new NotFoundException("You cannot ban this player");
       }
       //6- ban
        const ban = await this.playerService.banMember(login['id1'], room['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
            }
        )
        response.status(200).send({
            message: "Member banned"
        });
    }

    // @Get('/kick/:id1/:id2')
    // async kickMember(@Param() login: string, @Param() room_id: string, @Req() request, @Res() response) {
        // console.log("Kick Member");
    //    // 1- check if room_id exists
    //    const room = await this.playerService.findRoomById(room_id['id2']);
    //    // 2- check if room_id is not a dm
    //    if(room.is_dm === true)
    //    {
    //        throw new NotFoundException("Cannot leave a DM");
    //    }
    //    // 3- check if user is member of this room
    //    const member = await this.playerService.getPermissions(request.user.id, room_id['id2']);
    //    //4- check if nickname is a status in room_id with status member And Muted
    //    if (member.statusMember !== "member" || member.is_banned === true || member.is_muted === true)
    //    {
    //        throw new NotFoundException("Cannot mute this player");
    //    }
    //    //5- check if user status permission is an owner or admin
    //    const admin = await this.playerService.getPermissions(request.user.id, room_id['id2']);
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
    //     response.status(200).send({
    //         message: "Member kicked"
    //   });
    // }

    @Get('/kickMember/:id1/:id2') // kick member or admin
    async kickMember(@Param() login: string, @Param() room_id: string, @Req() request, @Res() response) {
        // console.log("Kick Member");
       // 1- check if room_id exists
       const room = await this.playerService.findRoomById(room_id['id2']);
       // 2- check if room_id is not a dm
       if(room.is_dm === true)
       {
           throw new NotFoundException("It's a DM");
       }
    //    // 3- check if user is member of this room
    //    const member = await this.playerService.getPermissions(request.user.id, room_id['id2']);
    //    //4- check if nickname is a status in room_id with status member And Muted
    //    if (member.statusMember !== "member")
    //    {
    //        throw new NotFoundException("Cannot mute this player");
    //    }
    //    //5- check if user status permission is an owner or admin
    //    const admin = await this.playerService.getPermissions(request.user.id, room_id['id2']);
    //    if (admin.statusMember !== "admin" && admin.statusMember !== "owner")
    //    {
    //        throw new NotFoundException("Cannot mute this player");
    //    }
       //6- kick member
        const kick = await this.playerService.kickMember(login['id1'], room_id['id2']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
            }
        )
        response.status(200).send({
            message: "Member kicked"
        });
    }

// ---------------------------------- CONTROLLER Permission in room ---------------------------------- //
    
    @Get('/Permission/:id') //POST REQUEST // id is roon id 
    async GetPermission(@Param() id_room: string, @Req() request, @Res() response) {
        // console.log("------------------- Get Permission-------------------");
        const permission = await this.playerService.getPermissions(request.user.id, id_room['id']);
        if (permission == null) {
            throw new NotFoundException("Permission denied, you are not a member of this room");
        }
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        // console.log("------------------- Finish Get Permission-------------------");
        response.status(200).send(permission);
    }

    @Get('/listOfRooms') // no check to do 
    async GetListOfRooms(@Req() request, @Res() response) {
        // console.log("--------------- List of Rooms -----------------");
        const rooms = await this.playerService.getAllRooms(request.user.id);

        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        // console.log("---------- Finish List of Rooms-----------------");
        response.status(200).send(rooms);
    }

    @Post('/createChatRoom/Public') // no check if name exist choose another name 
    async CreatePublicChatRoom(@Body() Body, @Req() request, @Res() response) {
        // console.log("----------------- Create Public Chat Room -----------------");
        const room = await this.playerService.createPublicChatRoom(request.user.id, Body.name);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        // console.log("----------------- Finish Create Public Chat Room ------------------");
        response.status(200).send(room);
    }

    @Post('/SetPwdToPublicChatRoom') // no check if name exist choose another name 
    async SetPwdToPublicChatRoom(@Body() Body: SetPwdToPublicChatRoomDto, @Req() request, @Res() response) {
        // console.log("----------------- Create Public Chat Room -----------------");
        const room = await this.playerService.SetPwdToPublicChatRoom(request.user.id, Body);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        // console.log("----------------- Finish Create Public Chat Room ------------------");
        response.status(200).send(room);
    }

    @Post('/createChatRoom/Private')
    async CreatePrivateChatRoom(@Body() Body, @Req() request, @Res() response) {
        // console.log("---------------- Create Private Chat Room ----------------");
        const room = await this.playerService.createPrivateChatRoom(request.user.id, Body.name);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        // console.log("---------------- Finish Create Private Chat Room ------------------");
        response.status(200).send(room);
    }

///////////////////////////////////////// New //////////////////////////////////////////////////////////

    @Post('/createChatRoom/Protected')
    async CreateProtectedChatRoom(@Body() Body: CreateProtectedRoomDto, @Req() request, @Res() response) {
        // console.log("------------------- Create Protected Chat Room -------------------");
        const room = await this.playerService.createProtectedChatRoom(request.user.id, Body);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        // console.log("-------------Finish Creatte Protected Chat Room-----------");
        response.status(200).send(room);
    }

    @Post('/UpdatePwdProtectedChatRoom')
    async UpdatePwdProtectedChatRoom(@Body() Body: UpdateProtectedPasswordDto, @Req() request, @Res() response) {
        // console.log("------------------- Create Protected Chat Room -------------------");
        const room = await this.playerService.UpdatePwdProtectedChatRoom(request.user.id, Body);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        // console.log("-------------Finish Creatte Protected Chat Room-----------");
        response.status(200).send(room);
    }

    @Post('/DeletePwdProtectedChatRoom')
    async DeletePwdProtectedChatRoom(@Body() Body, @Req() request, @Res() response) {
        // console.log("------------------- Create Protected Chat Room -------------------");
        const room = await this.playerService.DeletePwdToProtectedChatRoom(request.user.id, Body.id);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        // console.log("-------------Finish Creatte Protected Chat Room-----------");
        response.status(200).send(room);
    }


//////////////////////////////////////////////////////////////////////////////////////////////////

    @Get('/GetRoomById/:id')
    async GetRoomById(@Param() id_room: string, @Req() request, @Res() response) {
        // console.log("-------------- Get Room By Id --------------");

        // 1- check if this room exists
        const room = await this.playerService.getRoomById(request.user.id, id_room['id']);
        // console.log("room: \n", room);
        
        // 2- check if this user is a member of this room
        const permision = await this.playerService.getPermissions(request.user.id, id_room['id']);
        if(!permision)
        {
            throw new NotFoundException("You can not a get infos of this room bcuz you are not member");
        }

        if(room === null)
        {
            throw new NotFoundException("No Room exists");
        }
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        // console.log("-------------Finish Get Room By Id-------------");
        response.status(200).send(room);
    }

    // //endpoint for leaving a room
    @Get('/leaveRoom/:id')
    async leaveRoom(@Param() room_id: string, @Req() request, @Res() response) {
        // console.log("Leave Room");

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
        
        response.status(200).send({
            message: "Room leaved"
        });
    }

    @Get('/getmessages/:id')
    async getMessages(@Param() room_id: string, @Req() request, @Res() response) {
        // console.log("----------------------- Get Messages -----------------------", room_id['id']);

        // 1- check if room_id exists
        const room = await this.playerService.findRoomById(room_id['id']);
        if(!room)
        {
            throw new NotFoundException("Room not found");
        }
        // 2-check if user is member of this room, I aleardy check it in the service getMessagesOfRoom
        // const permision = await this.playerService.getPermissions(request.user.id, room_id['id']);
        // if(!permision)
        // {
        //     throw new NotFoundException("You can not a get a msgs of this room bcuz you are not member");
        // }

        // 3- get messages
        const messages = await this.playerService.getMessagesOfRoom(request.user.id, room_id['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
            }
        )
        // console.log("----------------------- Finish Get Messages -----------------------");
        response.status(200).send(messages);
    }

    @Get('/sendMessageButton/:id')
    async SendMessageButton(@Param() login: string,@Req() request, @Res() response) {
        console.log("Send Message");

        // 0- check if login exists
        const user = await this.playerService.findPlayerByNickname(login['login']);

        let room = null;
        // 1- check if room already exists between those 2 users
        room = await this.playerService.getRoomBetweenTwoPlayers(request.user.id, login['id']);
        // 2- if not create a new room
        if (room === null)
        {
            const friendship = await this.playerService.getFriendshipStatus(request.user.id, login['id']);
            if (!friendship) {
                room = await this.playerService.createDMRoom(request.user.id, login['id']);
            }
            // status friendship: 0: Friend, 1: Pending, 2: Block
            else if (friendship.status === 'Pending') {
                room = await this.playerService.createDMRoom(request.user.id, login['id']);
            }
            else if (friendship.status === 'Block') {
                throw new NotFoundException("You can not send a message to this player");
            }
        }

        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
        )
        response.status(200).send(room.id);
    }

    @Get('/joinRoom/:id')
    async joinRoom(@Param() room_id: string, @Req() request, @Res() response) {
        // console.log("---------------- Join Room ----------------", room_id['id']);

        // // 1- check if room_id exists
        // const room = await this.playerService.findRoomById(room_id['id']);
        
        // // 2- check if The Room is not a dm
        // if(room.is_dm === true)
        // {
        //     throw new NotFoundException("Cannot join a DM");
        // }
        // // 3- check if room is public
        // if(room.is_public === false)
        // {
        //     throw new NotFoundException("cannot join a private room");
        // }
        // // 3- check if user is member of this room
        // const member = await this.playerService.getPermissions(request.user.id, room_id['id']);
        // // console.log("member: ", member);
        // if(member)
        // {
        //     throw new NotFoundException("Already a member");
        // }

        // 4- then join room
        const join = await this.playerService.joinRoom(request.user.id, room_id['id']);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        })
        // console.log("--------------  Finish Join Room--------------------");
        return response.status(200).send({
            message: "Player joined the room successfully"
        });
    }

    @Get('/joinProtectedRoom')
    async joinProtectedRoom(@Body() roomId_pwd: JoinProtectedRoomDto, @Req() request, @Res() response) {
        // console.log("---------------- Join Room ----------------", room_id['id']);

        // // 1- check if room_id exists
        // const room = await this.playerService.findRoomById(room_id['id']);
        
        // // 2- check if The Room is not a dm
        // if(room.is_dm === true)
        // {
        //     throw new NotFoundException("Cannot join a DM");
        // }
        // // 3- check if room is public
        // if(room.is_public === false)
        // {
        //     throw new NotFoundException("cannot join a private room");
        // }
        // // 3- check if user is member of this room
        // const member = await this.playerService.getPermissions(request.user.id, room_id['id']);
        // // console.log("member: ", member);
        // if(member)
        // {
        //     throw new NotFoundException("Already a member");
        // }

        // 4- then join room
        const join = await this.playerService.joinProtectedRoom(request.user.id, roomId_pwd);
        response.set({
            'Access-Control-Allow-Origin': 'http://localhost:3000'
        })
        // console.log("--------------  Finish Join Room--------------------");
        return response.status(200).send({
            message: "Player joined the room successfully"
        });
    }

}

