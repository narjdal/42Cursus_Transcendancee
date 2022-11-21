// import { Controller, Get, Req, Request, Res, Response, UseGuards } from '@nestjs/common';
import { Controller, Get, Req, Request, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
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

// 	@Get('/redirect')
// 	@UseGuards(AuthGuard('42'))
// 	// async login() {
// 	// 	return "redirect"
// 	// }
// 	async login(@Req() request, @Res({passthrough:true}) res: Response) {
// 		console.log("trying to log SALUT LEKIP")
		
// 		const user =  await this.authService.findORcreate(request.user);

// 		console.log(user); // affiche uer 

// 		const token = await this.authService.getJwtToken(user);

// 		const secretData = {
// 			token,
// 			refreshToken: '',
// 			user:user
// 		}
// 		//If you are setting the cookie on a response in a login route in express backend for JWT and are using 'httpOnly' option, you are unable to access the token from the client/react, even when using a third party library like 'universal-cookie' or 'document.cookie'.
// 		// For now user set in cookie ,  Still need Endpoint to Auth with Auth Cookie 
// 		res.cookie(
// 			process.env.AUTHCOOKIE,
// 			 secretData, 
// 			 {httpOnly:false,});
		
// 		return res.status(302).redirect(`http://localhost:3000/`);
		
// 		// response.status(200).send(user);
// 		// response.redirect("http::localhost:3000/");
// 		// return user;
// 	}
// }

	@Get('/redirect')
	@UseGuards(AuthGuard('42'))
	async login(@Req() request, @Res() response) {

		const user =  await this.authService.findORcreate(request.user);

		console.log(user); // affiche uer 

		const token = await this.authService.getJwtToken(user);

		const secretData = {
			token,
			refreshToken: '',
		}

		response.cookie(process.env.AUTHCOOKIE, secretData, {httpOnly:true,});
		// response.status(200).send(user);
		// response.redirect("http::localhost:5000/player/myprofile")
		return response.status(302).redirect(`http://localhost:3000/`);

		// return user;
	}
}