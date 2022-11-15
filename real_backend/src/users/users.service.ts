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

    // private readonly users = [
    //     {
    //         id:1,
    //         nickname:'mazoko',
    //         username:'narjdal',
    //         image_url:"/upload/profile_pics/"
    //         // ProfilePic:,
    //     },
    //     {
    //         id:2,
    //         nickname:'testplayer',
    //         username:'test',
    //     },
    //     {
    //         id:50123,
    //         nickname:'GGMEC',
    //         username:'WOW',
    //         image_url:"/upload/profile_pics/vrosalon-f4fb.jpg"

    //     }
    // ];
    public getUser(id: any): Promise<User> {
        const User:any= this.repository.find({where: {id: parseInt(id)}})
       console.log("This weird shit")
        return  User;
      }
    
    // public CreateStudent (body: Student) :Promise <Student> {
    //     const student :Student = new Student();
    //     // user.id =
    //     student.id = body.id
    //     student.name = body.name;
    //     student.email = body.email;
    //     console.log("Creating a new student ... " + student.name)
    //     return this.repository.save(student);


    // }
    public createUser(body: CreateUserDto): Promise<User> {
        const user: User = new User();
    
        user.name = body.name;
        user.image_url = body.image_url;
        user.isActive = body.isActive;
        user.id42 = body.id42;
        console.log("saving this user => " + user.name + " " + user.image_url + " "  + user.id42)
        return this.repository.save(user);
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
