import { ICard } from 'src/cards/cards.interface';
import { Player } from 'src/players/players.interface';

export class CreateGameDto {
  buyAmount: number = 0;
  players: Player[];
  currentPlayer: Player = null;
  deckCards: ICard[] = null;
  currentCard: ICard = null;
}
