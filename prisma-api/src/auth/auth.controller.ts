import { Controller, Get, Req, Request, Res, Response, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get('/signup')
	@UseGuards(AuthGuard('42'))
	async authentication() {
		console.log("trying to auth")
	}

	@Get('/redirect')
	@UseGuards(AuthGuard('42'))
	// async login() {
	// 	return "redirect"
	// }
	async login(@Req() request, @Res() response) {
		console.log("trying to log")
		
		const user =  await this.authService.findORcreate(request.user);

		console.log(user); // affiche uer 

		const token = await this.authService.getJwtToken(user);

		const secretData = {
			token,
			refreshToken: '',
		}

		response.cookie(process.env.AUTHCOOKIE, secretData, {httpOnly:true,});
		response.status(200).send(user);

		return user;
	}
}
