import { Module } from '@nestjs/common';
import { PlayerController } from './players.controller';
import { PlayerService } from './players.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Player, PlayerSchema } from './players.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
  ],
  controllers: [PlayerController],
  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayersModule {}
