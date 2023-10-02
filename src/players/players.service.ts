import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlayerDto } from './dto/create-players.dto';
import { Player, PlayerDocument } from './players.schema';
import { UpdatePlayerDto } from './dto/update-players.dto';
import { Card, CardDocument } from 'src/cards/cards.schema';

@Injectable()
export class PlayerService {
  // private readonly players: Player[] = [];
  // private player: Player;

  constructor(@InjectModel(Player.name) private playerModel: Model<Player>) {}

  create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const createdPlayer = new this.playerModel(createPlayerDto);
    return createdPlayer.save();
  }

  async findAll(): Promise<Player[]> {
    return this.playerModel.find().exec();
  }

  async find(
    playerId: string,
    populate: string[] = [],
  ): Promise<PlayerDocument> {
    const playerQuery = this.playerModel.findById(playerId);

    populate.forEach((item) => {
      playerQuery.populate(item);
    });

    return playerQuery.exec();
  }

  async update(playerId: string, updatePlayerDto: UpdatePlayerDto) {
    return this.playerModel.updateOne({ _id: playerId }, updatePlayerDto);
  }

  async populateCards(player: Player, playerCards: Card[]): Promise<Player> {
    const cards = playerCards;
    return this.playerModel.findByIdAndUpdate(player, { cardDeck: cards });
  }

  async dropCard(playerId, card: CardDocument): Promise<PlayerDocument> {
    const player = await this.find(playerId, ['cardDeck']);
    const deckUpdate = player.cardDeck;

    const playerUpdate = {
      cardDeck: deckUpdate.filter((i) => !card.equals(i)),
    };

    return this.playerModel.findByIdAndUpdate(player, playerUpdate, {
      new: true,
    });
  }

  async buyCards(playerId, cards: CardDocument[]): Promise<PlayerDocument> {
    const player = await this.find(playerId, ['cardDeck']);

    cards.forEach((card) => {
      player.cardDeck.push(card);
    });

    return player.save();
  }

  async setWinner(playerId: string) {
    const player = await this.find(playerId);
    // const wins = player.wins;
    return this.playerModel.findByIdAndUpdate(player, {
      wins: player.wins + 1,
    });
  }

  async isWinner(playerId) {
    const player = await this.find(playerId);
    if (player.cardDeck.length == 0) {
      return true;
    }
    return false;
  }
}
