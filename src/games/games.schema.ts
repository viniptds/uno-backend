import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Card, CardDocument } from 'src/cards/cards.schema';
import { Player, PlayerDocument } from 'src/players/players.schema';

export type GameDocument = HydratedDocument<Game>;

@Schema()
export class Game {
  @Prop([{ type: SchemaTypes.ObjectId, ref: Player.name }])
  players: PlayerDocument[];

  @Prop({ type: SchemaTypes.ObjectId, ref: Player.name, default: null })
  currentPlayer: PlayerDocument;

  @Prop({ type: SchemaTypes.ObjectId, ref: Player.name, default: null })
  winner: PlayerDocument;

  @Prop({ default: 0 })
  buyAmount: number;

  @Prop({ default: 0 })
  status: number;

  @Prop({ default: false })
  playerBuyedCards: boolean;

  @Prop({ default: 'asc' })
  gameSequenceType: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: Card.name, default: null })
  currentCard: CardDocument;

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: Card.name }],
    default: null,
  })
  cardDeck: CardDocument[];
}

export const GameSchema = SchemaFactory.createForClass(Game);
