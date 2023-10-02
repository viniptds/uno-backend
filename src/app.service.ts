import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      message: 'Bem-vindo à API de UNO.',
    };
  }
}
