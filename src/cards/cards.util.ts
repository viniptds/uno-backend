export class CardUtil {
  getCards(): object[] {
    const cardList = [...this.getStandardCards(), ...this.getJokerCards()];
    return cardList;
  }

  getJokerCards(): object[] {
    const cardList = [];
    const labels = this.getJokerLabels();

    for (let i = 0; i < labels.length; i++) {
      const card = {
        color: 'black',
        label: labels[i],
      };

      cardList.push(card);
      cardList.push(card);
      cardList.push(card);
      cardList.push(card);
    }

    return cardList;
  }

  getStandardCards(): object[] {
    const colors = this.getColors();
    const labels = this.getLabels();

    const cardList = [];

    colors.forEach((color) => {
      labels.forEach((label) => {
        const card = {
          color: color,
          label: label,
        };
        cardList.push(card);
        cardList.push(card);
      });
    });

    return cardList;
  }

  getColors(): string[] {
    return ['red', 'blue', 'yellow', 'green'];
  }

  getLabels(): string[] {
    return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'B', 'T', 'P2'];
  }

  getJokerLabels(): string[] {
    return ['P4', 'CC'];
  }
}
