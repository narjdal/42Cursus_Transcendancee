/*
	Open the module file, and import the PrismaService, and add it to the array of providers
*/

import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';

@Module({
  providers: [PrismaService, PlayerService],
  controllers: [PlayerController]
})
export class PlayerModule {}
