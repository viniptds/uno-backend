import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game, GameDocument } from './games.schema';
import { Model } from 'mongoose';
import { CardService } from 'src/cards/cards.service';
import { PlayerService } from 'src/players/players.service';
import { GameService } from './games.service';
import { PlayerDocument } from 'src/players/players.schema';

@Injectable()
export class GameplayService {
  @Inject(CardService)
  private readonly cardService: CardService;
  @Inject(PlayerService)
  private readonly playerService: PlayerService;
  @Inject(GameService)
  private readonly gameService: GameService;

  constructor(@InjectModel(Game.name) private gameModel: Model<Game>) {}

  async getPlayerDetails(gameId, playerId): Promise<object> {
    const game = await this.gameService.find(gameId, [
      'currentCard',
      'currentPlayer',
    ]);

    const player = await this.playerService.find(playerId, ['cardDeck']);
    const isCurrentPlayer = game.currentPlayer.equals(player);
    let availableMoves = [];

    if (isCurrentPlayer) {
      availableMoves = this.getAvailableMoves(
        player.cardDeck,
        game.currentCard,
        game.cardDeck,
      );
    }

    return {
      player: player,
      isMyTurn: isCurrentPlayer,
      currentCard: game.currentCard,
      buyAmount: game.buyAmount,
      availableMoves: availableMoves,
    };
  }

  async playerMove(
    gameId,
    playerId,
    cardId,
    options = { colorDesired: 'red' },
  ) {
    const game = await this.gameService.find(gameId, [
      'currentCard',
      'currentPlayer',
      'players',
    ]);

    if (game.status != 1) {
      throw new Error('The game is not playable.');
    }

    let player = await this.playerService.find(playerId);
    if (!game.currentPlayer.equals(player)) {
      throw new Error('It is not your time to play');
    }

    const card = await this.cardService.get(cardId);
    if (card.equals(game.currentCard)) {
      throw new Error("You can't add the card on top");
    }

    const isValidCard = this.isCardValid(
      card,
      game.currentCard,
      game.buyAmount,
    );
    if (!isValidCard) {
      if (game.buyAmount > 0) {
        throw new Error(`You need to buy ${game.buyAmount} cards to proceed.`);
      }
      throw new Error('This card not match the previous card on top.');
    }

    if (['CC', 'P4'].includes(card.label)) {
      if (
        !this.cardService.cardUtil.getColors().includes(options.colorDesired)
      ) {
        throw new Error('The color on colorDesired is not valid');
      }
      card.color = options.colorDesired;
      card.save();
    }

    // TODO: Use options parameter to get color selected by player in case of CC and P4 labels

    player = await this.playerService.dropCard(playerId, card);
    game.currentCard = card;

    // TODO: Verify if this validation is important here
    if (this.gameService.isPlayerWinner(player, game)) {
      game.status = 2; // Status victory
      game.winner = player;

      game.players.forEach((gamePlayer) => {
        gamePlayer.games = gamePlayer.games + 1;

        if (gamePlayer.equals(player)) {
          gamePlayer.wins++;
        }
      });
    } else {
      // Apply wildcard rules
      if (card.label == 'P4') {
        game.buyAmount = game.buyAmount + 4;
      } else if (card.label == 'P2') {
        game.buyAmount += 2;
      }

      // TODO: Apply rules for B card (block the next player)
      if (card.label == 'B') {
        game.currentPlayer = this.getNextPlayer(game);
      }
      // TODO: Apply rules for T card (twist the game sequence)

      game.currentPlayer = this.getNextPlayer(game);
    }

    return game.save();
  }

  async buyCard(gameId, playerId): Promise<object> {
    const game = await this.gameService.find(gameId, [
      'currentPlayer',
      'currentCard',
    ]);
    if (game.status != 1) {
      throw new Error('The game is not playable.');
    }

    const player = await this.playerService.find(playerId);
    if (!game.currentPlayer.equals(player)) {
      throw new Error('It is not your time to play');
    }

    if (game.playerBuyedCards) {
      throw new Error(
        'You already buyed your new card. Please drop your card or pass the turn to keep the game going.',
      );
    }

    let playerMoves = this.getAvailableMoves(
      player.cardDeck,
      game.currentCard,
      game.buyAmount,
    );
    let playerNeedsToPass = true;

    if (game.buyAmount > 0 && playerMoves.length == 0) {
      const cardsToBuy = this.gameService.getCards(
        game.cardDeck,
        game.buyAmount,
      );
      this.playerService.buyCards(player, cardsToBuy);

      game.buyAmount = 0;
    } else {
      const cardsToBuy = this.gameService.getCards(game.cardDeck, 1);
      this.playerService.buyCards(player, cardsToBuy);
      game.playerBuyedCards = true;

      playerMoves = this.getAvailableMoves(
        player.cardDeck,
        game.currentCard,
        game.buyAmount,
      );

      if (playerMoves.length > 0) {
        playerNeedsToPass = false;
      }
    }

    if (playerNeedsToPass) {
      game.currentPlayer = this.getNextPlayer(game);
      game.playerBuyedCards = false;
    }

    await game.save();
    return this.getPlayerDetails(gameId, playerId);
  }

  getNextPlayer(game: GameDocument): PlayerDocument {
    const totalPlayers = game.players.length;
    let currentPos = 0;

    game.players.forEach((player, i) => {
      if (game.currentPlayer.equals(player)) {
        currentPos = i;
      }
    });

    currentPos++;
    if (currentPos == totalPlayers) {
      currentPos = 0;
    }

    return game.players[currentPos];
  }

  getAvailableMoves(deck, cardOnTop, buyAmount) {
    const availableMoves = [];

    deck.forEach((card) => {
      if (this.isCardValid(card, cardOnTop, buyAmount)) {
        availableMoves.push(card);
      }
    });

    return availableMoves;
  }

  isCardValid(currentCard, topCard, buyAmount) {
    if (topCard.equals(currentCard)) {
      return false;
    } else if (topCard.label == 'P4' && buyAmount > 0) {
      // + 4 card
      if (currentCard.label == topCard.label) {
        return true;
      }
    } else if (topCard.label == 'P2') {
      // + 2 card
      if (['P2', 'P4'].includes(currentCard.label)) {
        return true;
      }
    } else if (['CC', 'P4'].includes(currentCard.label)) {
      return true;
    } else if (currentCard.color == topCard.color) {
      return true;
    } else if (currentCard.label == topCard.label) {
      return true;
    }
    return false;
  }
}
