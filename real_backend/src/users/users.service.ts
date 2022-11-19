import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Student } from 'src/typeorm';


import { Repository } from 'typeorm';
import { CreateUserDto } from './user.dto';
// export type User = {
//     id:number;
//     name:string;
//     username:string;
//     // ProfilePic:File;
// }
// export type User = any;
@Injectable()
export class UsersService {
    @InjectRepository(User)
  private readonly repository: Repository<User>;

    public getUser(id: any): Promise<User> {
        const User:any= this.repository.find({where: {id: parseInt(id)}})
       console.log("GetUser => "  + JSON.stringify(User))
        return  User;
      }
    
    public createUser(body: CreateUserDto): Promise<User> {
        const user: User = new User();
    
        user.name = body.name;
        user.image_url = body.image_url;
        user.isActive = body.isActive;
        user.id42 = body.id42;
        console.log("saving this user => " + user.name + " " + user.image_url + " "  + user.id42)
        return this.repository.save(user);
      }

      public async setAvatar(body: CreateUserDto,image_url:string,id:any):Promise <User> {

        const user: User = new User();
    
        console.log("Setting from this " + body.image_url  + " TO THIS " + image_url)
        user.name = body.name;
        user.id = id

        user.image_url = image_url;
        user.isActive = body.isActive;
        user.id42 = body.id42;

        const todo:any= this.repository.find({where: {id: parseInt(id)}})
        if (!todo.id)
        {
          console.error("Todo don't exxist !" + todo.name);
          
        }
        await this.repository.update(id,user)

        const tt:any= this.repository.find({where: {id: parseInt(id)}})
     return user
        // return user;
        // return this.repository.update(1,{image_url}="");
      }
    //   }
    // async findOne(username:string) : Promise<User | undefined> {
    //     console.log("Inside find one " + username)
    //     return this.users.find(user => user.username === username);
    // }
    // async findOneById(id:number) : Promise<User | undefined> {
    //     console.log("Inside find one " + id)
    //     return this.users.find(user => user.id === id);
    // }
}
