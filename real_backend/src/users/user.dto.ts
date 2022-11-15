import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  public image_url: string;
  @IsString()
  public id42:string;
  @IsString()
  public isActive:string;
}