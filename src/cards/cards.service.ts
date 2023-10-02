import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Card, CardDocument } from './cards.schema';
import { CardUtil } from './cards.util';

@Injectable()
export class CardService {
  @Inject(CardUtil)
  public cardUtil: CardUtil;

  constructor(@InjectModel(Card.name) private cardModel: Model<Card>) {}

  async all(): Promise<Card[]> {
    return this.cardModel.find().exec();
  }

  // Triggers the card creation: Useful for app starting point
  async boot(): Promise<void> {
    const cards = await this.cardModel.find().exec();
    const requiredCards = this.cardUtil.getCards();

    if (cards.length != requiredCards.length) {
      this.cardModel.deleteMany({}).exec();
      this.cardModel.insertMany(requiredCards);
    } else {
      console.log('The cards are already set.');
    }
  }

  async get(cardId): Promise<CardDocument> {
    return this.cardModel.findById(cardId).exec();
  }

  getCards(): Card[] {
    return this.cardUtil.getCards().map((item: any) => {
      const card = new Card();
      card.label = item.label;
      card.color = item.color;
      return card;
    });
  }
}
