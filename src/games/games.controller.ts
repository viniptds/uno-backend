import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { CreateGameDto } from './games.dto';
import { GameService } from './games.service';
import { Game } from './games.schema';
import { GameplayService } from './gameplay.service';
import { Request } from 'express';

@Controller('games')
export class GameController {
  constructor(
    private gameService: GameService,
    private gameplayService: GameplayService,
  ) {}

  @Get()
  index(): any {
    return this.gameService.findAll();
  }

  @Post()
  async create(@Body() createGameDto: CreateGameDto): Promise<Game> {
    return this.gameService.create(createGameDto);
  }

  @Get(':id')
  show(@Param() params: any): any {
    const gameId = params.id;
    return this.gameService.find(gameId, ['currentPlayer', 'players']);
  }

  @Get(':id/play')
  play(@Param() params: any): any {
    // Get a game and show current player
    const gameId = params.id;
    // Show last board
    // Show buy amount
    return this.gameService.play(gameId);
  }

  @Get(':id/:playerId')
  playerStatus(@Param() params: any): any {
    const gameId = params.id;
    const playerId = params.playerId;

    return this.gameplayService.getPlayerDetails(gameId, playerId);
  }

  @Get(':id/:playerId/new-card')
  buyCard(@Param() params: any): any {
    const gameId = params.id;
    const playerId = params.playerId;

    return this.gameplayService.buyCard(gameId, playerId);
  }

  @Post(':id/:playerId/play')
  playerMove(@Param() params: any, @Req() req: Request): any {
    const gameId = params.id;
    const playerId = params.playerId;
    const cardId = req.body.cardId;
    const colorDesired = req.body.colorDesired;

    return this.gameplayService.playerMove(gameId, playerId, cardId, {
      colorDesired,
    });
  }
}
