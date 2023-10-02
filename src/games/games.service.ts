import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { Game } from 'src/games/games.interface';
// import { Player } from 'src/players/players.interface';
import { Game, GameDocument } from './games.schema';
import { Model } from 'mongoose';
import { CreateGameDto } from './games.dto';
import { Player, PlayerDocument } from 'src/players/players.schema';
import { CardService } from 'src/cards/cards.service';
import { Card, CardDocument } from 'src/cards/cards.schema';
import { PlayerService } from 'src/players/players.service';

@Injectable()
export class GameService {
  @Inject(CardService)
  private readonly cardService: CardService;

  @Inject(PlayerService)
  private readonly playerService: PlayerService;

  private readonly players: Player[] = [];
  // private game: Game;

  constructor(@InjectModel(Game.name) private gameModel: Model<Game>) {}

  create(createGameDto: CreateGameDto): Promise<Game> {
    const createdGame = new this.gameModel(createGameDto);
    return createdGame.save();
  }

  async findAll(): Promise<Game[]> {
    return this.gameModel.find().exec();
  }

  async find(
    gameId: string,
    populations: string[] = [],
  ): Promise<GameDocument> {
    const gameQuery = this.gameModel.findById(gameId);

    populations.forEach((field) => {
      gameQuery.populate(field);
    });

    return gameQuery.exec();
  }

  async play(gameId: string): Promise<Game> {
    const playerDeckSize = 3;

    const game = await this.find(gameId);
    if (game.status != 0) {
      throw new Error('The game already started or finshed.');
    }

    const cards = this.shuffleCards(await this.cardService.all());

    const playerSequence = this.setPlayerSequence(game);

    const updateGame = {
      cardDeck: cards,
      players: playerSequence,
      currentPlayer: playerSequence[0],
      currentCard: this.turnCard(cards),
      status: 0,
    };

    updateGame.players.forEach((player) => {
      this.playerService.populateCards(
        player,
        this.getCards(updateGame.cardDeck, playerDeckSize),
      );
    });

    updateGame.status = 1;
    // TODO: Save game
    return this.gameModel
      .findByIdAndUpdate(gameId, updateGame, { new: true })
      .populate('currentCard')
      .exec();
  }

  getCards(deck: Card[], amount: number): CardDocument[] {
    const cards = [];
    for (let i = 0; i < amount; i++) {
      cards.push(deck.pop());
    }

    return cards;
  }

  turnCard(deck: Card[]): Card {
    const card = deck.pop();
    return card;
  }

  shuffleCards(cards): Card[] {
    const shuffledCards = cards.slice();
    // TODO: Apply shuffle cards algorithm

    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffledCards[i];
      shuffledCards[i] = shuffledCards[j];
      shuffledCards[j] = temp;
    }
    return shuffledCards;
  }

  setPlayerSequence(game): Player[] {
    const playerList = game.players.slice();

    for (let i = playerList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = playerList[i];
      playerList[i] = playerList[j];
      playerList[j] = temp;
    }
    return playerList;
  }

  isPlayerWinner(player: PlayerDocument, game: GameDocument): boolean {
    if (player.cardDeck.length == 0) {
      game.status = 1;
      game.save();
      return true;
    }

    return false;
  }
}
