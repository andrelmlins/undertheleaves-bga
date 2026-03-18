class CardManager implements Game {
  constructor(public game: UndertheLeavesGame) {}

  public setup() {
    const cardsBox = document.getElementById('undertheleaves-cards');

    cardsBox.insertAdjacentHTML('beforeend', this.formatCard(this.game.gamedatas.cards.leaf));
    cardsBox.insertAdjacentHTML('beforeend', this.formatCard(this.game.gamedatas.cards.mushroom));
    cardsBox.insertAdjacentHTML('beforeend', this.formatCard(this.game.gamedatas.cards.puddle));
  }

  public onEnteringState(stateName: string, notif: Notif<any>) {
    //
  }

  public onLeavingState(stateName: string) {
    //
  }

  public onUpdateActionButtons(stateName: string, args: Notif<any>) {
    //
  }

  public setupNotifications() {
    //
  }

  public formatCard(card: CardConfig) {
    return `<div class="undertheleaves-card" line="${card.position.row}" column="${card.position.column}"></div>`;
  }
}
