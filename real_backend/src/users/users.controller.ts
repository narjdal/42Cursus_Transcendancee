import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateUserDto } from './user.dto';
import { User } from './user.entity';
import { Student } from 'src/typeorm';
import { UsersService } from './users.service';

@Controller('user')
export class UserController {
  @Inject(UsersService)
  private readonly service: UsersService;

  @Get(':id')
  public getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    console.log("inside Get User  |User Controller  "+ id)
    return this.service.getUser(id);
  }

  @Post('')
  public createUser(@Body() body: CreateUserDto): Promise<User> {
   console.log("Currently creating the user ..." + body.name )
    return this.service.createUser(body);
  }
//   @Post('/create/student')
//   public CreateStudent(@Body() body: any): Promise<Student> {
//    console.log("Currently creating the user ..." + body.name )
//     return this.service.CreateStudent(body);
//   }
}