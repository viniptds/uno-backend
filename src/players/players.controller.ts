import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PlayerService } from './players.service';
import { CreatePlayerDto } from './dto/create-players.dto';
import { UpdatePlayerDto } from './dto/update-players.dto';

@Controller('players')
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @Post()
  async create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playerService.create(createPlayerDto);
  }

  @Get(':id')
  show(@Param() params: any) {
    const playerId = params.id;
    return this.playerService.find(playerId);
  }

  @Put(':id')
  async update(@Param() params: any, @Body() updatePlayerDto: UpdatePlayerDto) {
    const playerId = params.id;
    this.playerService.update(playerId, updatePlayerDto);
  }
}
