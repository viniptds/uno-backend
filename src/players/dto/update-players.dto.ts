import { ICard } from 'src/cards/cards.interface';

export class UpdatePlayerDto {
  name: string;
  wins: number;
  games: number;
  cardDeck: ICard[];
}
