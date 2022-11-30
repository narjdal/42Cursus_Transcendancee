import { Player } from "@prisma/client";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class  UpdatePlayerDto implements Partial<Player> {
    
    
    @IsString()
    nickname: string;
    @IsString()
    avatar: string;
    
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    password:string;


    // @IsNotEmpty ( ) @IsString ( ) @IsOptional ( ) readonly name : string ; @IsNotEmpty ( ) @IsString ( ) @IsOptional ( ) readonly email : string ; @IsNotEmpty ( ) @IsString ( ) @IsOptional ( ) readonly phone : string ; @IsNotEmpty ( ) @IsString ( ) @IsOptional ( ) readonly ranking : string ; @IsNotEmpty ( ) @IsString ( ) @IsOptional ( ) readonly position : string ; }
    // constructor(parameters) {
        
    // }

}