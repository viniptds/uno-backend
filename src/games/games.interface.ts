import { ICard } from '../cards/cards.interface';
import { Player } from '../players/players.interface';

export interface IGame {
  buyAmount: number;
  players: Player[];
  playerCards: ICard[];
  currentPlayer: Player;
  deckCards: ICard[];
  currentCard: ICard;
}
