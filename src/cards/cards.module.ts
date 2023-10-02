import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from './cards.schema';
import { CardController } from './cards.controller';
import { CardService } from './cards.service';
import { CardUtil } from './cards.util';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
  ],
  controllers: [CardController],
  providers: [CardService, CardUtil],
  exports: [CardService],
})
export class CardsModule {}
