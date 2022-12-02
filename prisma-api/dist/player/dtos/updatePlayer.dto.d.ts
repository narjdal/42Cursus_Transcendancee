import { Player } from "@prisma/client";
export declare class UpdatePlayerDto implements Partial<Player> {
    nickname: string;
    avatar: string;
    password: string;
}
