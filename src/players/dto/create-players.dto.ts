import { ICard } from 'src/cards/cards.interface';

export class CreatePlayerDto {
  name: string;
  wins: number;
  games: number;
  cardDeck: ICard[];
}
