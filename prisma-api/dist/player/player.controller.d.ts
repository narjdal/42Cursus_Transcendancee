import { PlayerService } from './player.service';
export declare class PlayerController {
    private readonly playerService;
    constructor(playerService: PlayerService);
    login(request: any, response: any): Promise<void>;
    getProfile(nickname: string, request: any, response: any): Promise<void>;
    checkStatusFriendship(login: string, request: any, response: any): Promise<void>;
    RequestFriendship(login: string, request: any, response: any): Promise<void>;
    AcceptFriendship(login: string, request: any, response: any): Promise<void>;
    RefuseFriendship(login: string, request: any, response: any): Promise<void>;
    BlockFriendship(login: string, request: any, response: any): Promise<void>;
    UnblockFriendship(login: string, request: any, response: any): Promise<void>;
    GetListOfFriends(request: any, response: any): Promise<void>;
    GetListOfMembers(id_room: string, request: any, response: any): Promise<void>;
    GetListOfAddFriends(id_room: string, request: any, response: any): Promise<void>;
    addMember(login: string, room_id: string, request: any, response: any): Promise<void>;
    GetListOfSetAdmin(id_room: string, request: any, response: any): Promise<void>;
    setAdmin(login: string, room_id: string, request: any, response: any): Promise<void>;
    GetListOfMembersToMute(id_room: string, request: any, response: any): Promise<void>;
    muteMember(login: string, room_id: string, request: any, response: any): Promise<void>;
    GetListOfMembersToUnmute(id_room: string, request: any, response: any): Promise<void>;
    unmuteMember(nickname: string, room_id: string, request: any, response: any): Promise<void>;
    GetListOfMembersToBan(id_room: string, request: any, response: any): Promise<void>;
    banMember(login: string, room_id: string, request: any, response: any): Promise<void>;
    kickMember(login: string, room_id: string, request: any, response: any): Promise<void>;
    GetPermission(id_room: string, request: any, response: any): Promise<void>;
    GetListOfRooms(request: any, response: any): Promise<void>;
    CreatePublicChatRoom(Body: any, String: any, request: any, response: any): Promise<void>;
    CreatePrivateChatRoom(Body: any, String: any, request: any, response: any): Promise<void>;
    CreateProtectedChatRoom(Body: any, String: any, request: any, response: any): Promise<void>;
    GetRoomById(id_room: string, request: any, response: any): Promise<void>;
    leaveRoom(room_id: string, request: any, response: any): Promise<void>;
    getMessages(room_id: string, request: any, response: any): Promise<void>;
    joinRoom(room_id: string, request: any, response: any): Promise<any>;
}
