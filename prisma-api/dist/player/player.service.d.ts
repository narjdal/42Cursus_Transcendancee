import { PrismaService } from 'src/prisma.service';
import { CreateProtectedRoomDto, JoinProtectedRoomDto, SetPwdToPublicChatRoomDto, UpdateProtectedPasswordDto } from './dtos/updatePlayer.dto';
export declare class PlayerService {
    private prisma;
    constructor(prisma: PrismaService);
    findPlayerById(userId: string): Promise<import(".prisma/client").Player>;
    findPlayerByNickname(login: string): Promise<import(".prisma/client").Player>;
    findRoomById(roomId: string): Promise<import(".prisma/client").ChatRoom>;
    getTypeOfRoom(roomId: string): Promise<any>;
    getRoomById(userId: string, room_id: string): Promise<{
        name: string;
        is_dm: boolean;
        is_public: boolean;
        is_private: boolean;
        is_protected: boolean;
        all_members: {
            player: {
                id: string;
                nickname: string;
            };
        }[];
    }>;
    getRoomBetweenTwoPlayers(useId: string, login: string): Promise<import(".prisma/client").ChatRoom>;
    getAllRooms(userId: string): Promise<{
        id: string;
        name: string;
        is_dm: boolean;
        is_public: boolean;
        is_private: boolean;
        is_protected: boolean;
    }[]>;
    getFriendshipStatus(userId: string, login: string): Promise<import(".prisma/client").Friendship>;
    getFriendships(userId: string): Promise<string[]>;
    getAllFriends(userId: string): Promise<{
        id: string;
        nickname: string;
        avatar: string;
    }[]>;
    getProfilesOfChatRooms(userId: string, room_id: string): Promise<{
        id: string;
        nickname: string;
        avatar: string;
    }[]>;
    getAllMembersOfThisRoom(userId: string, room_id: string): Promise<string[]>;
    getListOfFriendsToAddinThisRoom(userId: string, room_id: string): Promise<{
        nickname: string;
        avatar: string;
    }[]>;
    getListOfFriendsToUpgradeAdmininThisRoom(userId: string, room_id: string): Promise<string[]>;
    getListOfFriendsToMuteinThisRoom(userId: string, room_id: string): Promise<string[]>;
    getListOfFriendsToUnmuteinThisRoom(userId: string, room_id: string): Promise<string[]>;
    getListOfFriendsToBaninThisRoom(userId: string, room_id: string): Promise<string[]>;
    createFriendship(userId: string, friendname: string): Promise<void>;
    acceptFriendship(userId: string, friendname: string): Promise<import(".prisma/client").Friendship>;
    blockFriendship(userId: string, friendname: string): Promise<void>;
    deleteFriendship(userId: string, friendname: string): Promise<void>;
    refuseFriendship(userId: string, friendname: string): Promise<void>;
    createPublicChatRoom(userId: string, nameOfRoom: string): Promise<import(".prisma/client").ChatRoom>;
    createPrivateChatRoom(userId: string, nameOfRoom: string): Promise<import(".prisma/client").ChatRoom>;
    createProtectedChatRoom(userId: string, Body: CreateProtectedRoomDto): Promise<{
        name: string;
        is_dm: boolean;
        is_public: boolean;
        is_private: boolean;
        is_protected: boolean;
        id: string;
    }>;
    DeletePwdToProtectedChatRoom(userId: string, room_id: string): Promise<import(".prisma/client").ChatRoom>;
    SetPwdToPublicChatRoom(userId: string, Body: SetPwdToPublicChatRoomDto): Promise<{
        name: string;
        is_dm: boolean;
        is_public: boolean;
        is_private: boolean;
        is_protected: boolean;
        id: string;
    }>;
    UpdatePwdProtectedChatRoom(userId: string, Body: UpdateProtectedPasswordDto): Promise<{
        name: string;
        is_dm: boolean;
        is_public: boolean;
        is_private: boolean;
        is_protected: boolean;
        id: string;
    }>;
    createDMRoom(userId: string, friendname: string): Promise<import(".prisma/client").ChatRoom>;
    getPermissions(userId: string, id_room: string): Promise<{
        statusMember: string;
        is_banned: boolean;
        is_muted: boolean;
    }>;
    getMessagesOfRoom(userId: string, id_room: string): Promise<{
        id: string;
        senderId: string;
        sender: {
            id: string;
            nickname: string;
            avatar: string;
        };
        createdAt: Date;
        msg: string;
    }[]>;
    ƒ: any;
    sendMessage(userId: string, room_id: string, message: string): Promise<import(".prisma/client").Message>;
    sendMessageinRoom(userId: string, message: string, room_id: string): Promise<import(".prisma/client").Message>;
    addMember(login: string, room_id: string): Promise<import(".prisma/client").Permission>;
    joinDM(userId: string, login: string): Promise<{
        name: string;
        is_dm: boolean;
        is_public: boolean;
        is_private: boolean;
        is_protected: boolean;
        all_members: {
            player: {
                id: string;
                nickname: string;
            };
        }[];
    }>;
    joinRoom(userId: string, room_id: string): Promise<{
        name: string;
        is_dm: boolean;
        is_public: boolean;
        is_private: boolean;
        is_protected: boolean;
        all_members: {
            player: {
                id: string;
                nickname: string;
            };
        }[];
    }>;
    joinProtectedRoom(userId: string, { room_id, pwd }: JoinProtectedRoomDto): Promise<import(".prisma/client").Permission | {
        name: string;
        is_dm: boolean;
        is_public: boolean;
        is_private: boolean;
        is_protected: boolean;
        all_members: {
            player: {
                id: string;
                nickname: string;
            };
        }[];
    }>;
    setAdmin(login: string, room_id: string): Promise<void>;
    banMember(login: string, room_id: string): Promise<void>;
    kickMember(login: string, room_id: string): Promise<void>;
    muteMember(login: string, room_id: string, time: number): Promise<void>;
    unmuteMember(login: string, room_id: string): Promise<void>;
    leaveChannel(userId: string, room_id: string): Promise<void>;
}
