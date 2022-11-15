import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { secret } from './utils/constants';
import { join } from 'path/posix';
import { ServeStaticModule } from '@nestjs/serve-static';
import entities from './typeorm';
// import {ServeStaticModule}
// import { UsersModule } from './users/users.module';
// import { UsersModule } from './users/users.module';
// import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UserController } from './users/users.controller';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import {TypeOrmModule} from '@nestjs/typeorm';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { getEnvPath } from './envs/env.helper'
import { TypeOrmConfigService } from './typeorm/typeorm.service';

const envFilePath: string = getEnvPath(`${__dirname}/envs/`);
@Module({
  imports: [
    // MulterModule.register({
    //   dest:'../pongapp/public',
    // }),
    // ServeStaticModule.forRoot({
    //   rootPath:join(__dirname,'..','upload/profile_pics')
    // }),
    // UsersModule,
    //  AuthModule,
    //  JwtModule.register({
    //   secret,
    //   signOptions: { expiresIn: '2h' },
    // }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'public'),
    // }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload'),
      serveRoot:'/upload/'
    }),
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    // ConfigModule.forRoot({ isGlobal: true }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     host: configService.get('DB_HOST'),
    //     port: configService.get<number>('DB_PORT'),
    //     username: configService.get('narjdal'),
    //     database:"nest_api",
    //     entities: [entities],
    //     synchronize: true,
    //   }),
    //   inject: [ConfigService],
    // }),
  UsersModule,
    AuthModule],
  controllers: [AppController,UserController],
  providers: [AppService],
})
export class AppModule {}
