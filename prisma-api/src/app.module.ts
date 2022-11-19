import { Module } from '@nestjs/common';
import { PlayerModule } from './player/player.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PlayerModule, AuthModule],
})
export class AppModule {}
