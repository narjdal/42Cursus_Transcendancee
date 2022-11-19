import { Body,Controller,Headers,Response, Get, Query,Request, Post, UseGuards, UseInterceptors, UploadedFile, StreamableFile } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport'
import { LocalAuthGuard } from './auth/local-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
// ...
import { diskStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';
import { imageFileFilter } from './utils/file-upload.utils';
import { editFileName } from './utils/file-upload.utils';
import { request } from 'http';
import { userInfo } from 'os';
import { response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { UserController } from './users/users.controller';
@Controller()

export class AppController {
  constructor(private readonly UsersService: UsersService) {}

  // @UseGuards(LocalAuthGuard)
  // @Post('auth/login')
  // async login(@Request() req:any) {
  //   return this.authService.login(req.user);
  // }
   
  // @UseGuards(LocalAuthGuard);
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    login(@Request() req:any):any {
      console.log("inside login route");
      return req.user;
    }
    // async  login_fortytwo(@Request() req:any)
    // {

    // }
    @Post('/upload')
    @UseInterceptors(
      FileInterceptor('file',{
        storage: diskStorage({
          destination: './upload/',
          filename: editFileName,
        }),
        fileFilter: imageFileFilter,
      })
      )
    async uploadSingleFileWithPost(@UploadedFile() file:any, @Body() body:any) {
     console.log("Currently Uploading new infos of the following user => " + body.userId + body.id)
      console.log(file);
      console.log("filename in the backend is  located at => "  + file.path)
      console.log(file.filename);
      console.log(body.nickname);
      const Savior = {
        id:body.id,
        name:body.nickname,
        image_url:body.image_url,
        isActive :"TOSET",
        id42 : "50",

      }
      const response = {
        id:body.id,
        nickname:body.nickname,
        image_url:body.image_url,
        isActive :"TOSET",
        id42:"50"
      }
      // Here => Update Database Set new Nickname and new Path to File 
      //  Then Return new Users infos 
     const image_url = "http://localhost:9000/upload/" + file.filename;
      const User = await this.UsersService.setAvatar(Savior,image_url,body.id);
      console.log("User With the database db updated => "
      + User.id +" STR => " + JSON.stringify(User));
    //   return response;
      return {
        UserId:body.id,
        id:body.id,
        nickname:body.nickname,
        // isUsersInfosModified:"true",
        filename:file.filename,
        destination:file.destination,
        // image_url:file
        image_url: image_url
            }
      // console.log(body.favoriteColor);
    }
    // @Controller("/hello")
    @Get("/GetUserPicture")
    // Picture are served staticly from the server 
    async  FetchUserPicture(@Request() req:any, @Headers() headers:any) /** : StreamableFile */{
      // const id = headers.userId;
      const path = headers.mypath;
      // const filename = headers.filename;
      // const destination = headers.destination;
      const {userid,filename,destination,id} = req.headers;
      console.log("ID OF USER => " +userid)
      console.log("inside Get User Picture By id ! " + " ID is => "  + headers.userid);
      // console.log("filename is " + filename  + " dest => " + destination)
      // const User42 = this.UserService.findOneById(userid);
      console.log("ID OF USER => " +userid + " Testing with  id  " + 1)
    const Userfromdb = await this.UsersService.getUser(2);
     const parsedUser = JSON.stringify(Userfromdb);
     console.log("PARSED USER => " + parsedUser )

      return  parsedUser
    //  const {id,image_url,id42,name} = 

    //  const UserObject = JSON.parse(parsedUser)

    //  console.log("User from DB is => "  +parsedUser + " ID "  + UserObject.id  + " image_url" + UserObject.image_url + " id42" + UserObject.id42) ;
        // this.UsersController.getUser(userid);
      // this.appService
      // this.appService.getUser(id);
      return {
        UserId:userid,
        nickname:"testgg",
        image_url:"http://localhost:9000/upload/" + "vrosalon-f4fb.jpg"
      }
      const imageLocation = join(process.cwd(), '/upload/', 'USA copy-8fff.JPG');
      const file = createReadStream(imageLocation);
      // console.log("file created => " + JSON.stringify(file));
      // return new StreamableFile(file);
      // r eturn new StreamableFile(createReadStream(join(process.cwd(), '../public/upload/profiles_pics/', "USA copy-5d62.JPG")))
  

      
      // rep.status(200).sendFile(filename,{root:destination});
      // return req.sendFile('',{ root: path }))

    }
  //  async FetchUserPicture (@Request() req:any{
  //   // const id = parseInt(body.UserId);
  //   const id = req.UserId;

  //  })

  //  async FetchUserPicture (@Query() query: { id: string,path:string })
  //   {
  //     // const leid = query.id;
  //     const id = query.id;
  //     const path = query.path;
  //     console.log("inside Get User Picture By id ! "  + id  + " path is => "  + path
  //    return {
  //       file:sendFile('',{root:'path'})
  //    }
  //     // HEre Request to Database , Fetch Users infos for UserID === ID , then Send the file
  //     // Quoi que j'envoie deja le path , a voir si needed to update ou non 

  //     // return {
  //     //   file:""  ,
  //     //   message:"HAHHAHAHAH"   
  //     //  }
  //   }
    
  @Post('/update/nickname')
  async UpdateUserNickname (@Request() req:any , @Body() body:any)
  {
    // const nickName = req.nickName;
    // const UserId = req.UserId;
    const nickName = body.nickName;
    const UserId = body.UserId
    const image_url = body.image_url
    console.log("Inside Update User Nickname Todo Update Db ! " +  nickName + " User Id  => " + UserId );

    // Request to Update Database Here TODO 

      return {
        
        UserId:UserId,
        nickname:nickName,
        image_url: image_url

        // isUsersInfosModified:"true",
        // filename:file.filename,
        // destination:file.destination,
        // image_url:file
        // image_url: "./assets/" + file.filename
            
      }
  }

    @Get('/login/auth42')
    login42(){
      console.log("inside login 42 ");
      return{
        page:'https://api.intra.42.fr/oauth/authorize?client_id=8d53476d0b35503b5132e8298c0c72b3b9a338afc65ab471d6a11eaefdf2437a&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=code',
      }
    }
    // @Get('/')
    // getHello(): string 
    // {
    //   // return this.appService.getHello();
    //   // return this.getHello();
    // }
  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Request() req:any) {
  //   return req.user;
  // }
}