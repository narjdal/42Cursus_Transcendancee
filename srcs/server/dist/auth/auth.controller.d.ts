import { Response } from 'express';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    authentication(): Promise<void>;
    login(request: any, res: Response): Promise<void>;
    logout(request: any, res: Response): Promise<void>;
}
