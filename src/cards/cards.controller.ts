import { Controller, Get, Post } from '@nestjs/common';
import { CardService } from './cards.service';
import { Card } from './cards.schema';

@Controller('cards')
export class CardController {
  constructor(private cardService: CardService) {}

  @Get('')
  async index(): Promise<Card[]> {
    await this.cardService.boot();
    return await this.cardService.all();
  }

  @Get('/colors')
  colors(): string[] {
    return this.cardService.cardUtil.getColors();
  }
  @Post()
  boot() {
    this.cardService.boot();
  }
}
