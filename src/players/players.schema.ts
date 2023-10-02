import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Card, CardDocument } from 'src/cards/cards.schema';

export type PlayerDocument = HydratedDocument<Player>;

@Schema()
export class Player {
  @Prop({ required: true, default: 'player_1' })
  name: string;

  @Prop({ default: 0 })
  wins: number;

  @Prop({ default: 0 })
  games: number;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: Card.name }] })
  cardDeck: CardDocument[];
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
