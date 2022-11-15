import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy)
{
    constructor(private authService:AuthService)
    {
        super(
            // {username:'narjdal'}
        );// Config Strategy
    }
    async validate(username:string,password:string): Promise<any>
    {
        console.log("Inside local strategy" );
        const user = await this.authService.validateUser(username,password);

            if(!user)
            {
                console.log("No user returned from local strategy ! " );
            throw new UnauthorizedException();

            }
            return user;
    }
}