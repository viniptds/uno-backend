import { Module } from '@nestjs/common';
import { GameController } from './games.controller';
import { GameService } from 'src/games/games.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './games.schema';
import { PlayersModule } from 'src/players/players.module';
import { CardsModule } from 'src/cards/cards.module';
import { GameplayService } from './gameplay.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    PlayersModule,
    CardsModule,
  ],
  controllers: [GameController],
  providers: [GameService, GameplayService],
})
export class GamesModule {
  // constructor(private configService: ConfigService) {
  //   const dbUser = this.configService.get<string>('DB_CONNECTION_URI');
  // }
}
