// import { Controller, Get, Req, Request, Res, Response, UseGuards } from '@nestjs/common';
import { Controller, Get, Req, Request, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { request } from 'http';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get('/signup')
	@UseGuards(AuthGuard('42'))
	async authentication() {
		// console.log("trying to auth")
	}

	@Get('/redirect')
	@UseGuards(AuthGuard('42'))
	async login(@Req() request, @Res({passthrough:true}) res: Response) {
		const user =  await this.authService.findORcreate(request.user);

		// console.log("after creating the user");
		
		// console.log(user); // affiche uer 

		const token = await this.authService.getJwtToken(user);

		const secretData1 = {
			token,
		}
		const secretData2 = {
			refreshToken: '',
		}


		//If you are setting the cookie on a response in a login route in express backend for JWT and are using 'httpOnly' option is true.
		res.cookie(
			process.env.AUTHCOOKIE,
			secretData1.token,
			{httpOnly:true,
		});

		res.cookie(
			String('emy'),
			secretData2.refreshToken,
			{httpOnly:true,
		});

		// response.status(200).send(user);
		return res.status(302).redirect(`http://localhost:3000/`);
	}

	@Get('/logout')
	@UseGuards(AuthGuard('jwt'))
	async logout(@Req() request, @Res({passthrough:true}) res: Response) {
		res.clearCookie(process.env.AUTHCOOKIE);
		return res.status(302).redirect(`http://localhost:3000/`);
	}
}