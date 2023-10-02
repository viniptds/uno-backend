import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CardDocument = HydratedDocument<Card>;

@Schema()
export class Card {
  @Prop()
  color: string;

  @Prop()
  label: string;
}

export const CardSchema = SchemaFactory.createForClass(Card);
