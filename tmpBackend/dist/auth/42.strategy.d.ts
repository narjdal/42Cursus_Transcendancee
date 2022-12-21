import { AuthService } from './auth.service';
declare const OauthStrategy_base: any;
export declare class OauthStrategy extends OauthStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(accessToken: String, refreshToken: String, profile: any, cb: any): Promise<any>;
}
export {};
