class CardManager implements Game {
  constructor(public game: UndertheLeavesGame) {}

  public setup() {
    const cardsBox = document.getElementById('undertheleaves-cards');
    const { leaf, mushroom, puddle } = this.game.gamedatas.cards;

    cardsBox.insertAdjacentHTML('beforeend', this.formatCard(leaf));
    cardsBox.insertAdjacentHTML('beforeend', this.formatCard(mushroom));
    cardsBox.insertAdjacentHTML('beforeend', this.formatCard(puddle));

    this.game.addTooltipHtml('undertheleaves-card-leaf', this.formatCardTooltip(leaf));
    this.game.addTooltipHtml('undertheleaves-card-mushroom', this.formatCardTooltip(mushroom));
    this.game.addTooltipHtml('undertheleaves-card-puddle', this.formatCardTooltip(puddle));
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
    return `<div id="undertheleaves-card-${card.type}" class="undertheleaves-card" line="${card.position.row}" column="${card.position.column}"></div>`;
  }

  public formatCardTooltip(card: CardConfig) {
    const typeName = {
      leaf: _('Leaf Dweller'),
      mushroom: _('Mushroom Dweller'),
      puddle: _('Puddle Dweller'),
    };

    return `
      <div class="undertheleaves-card-tooltip">
        <span class="undertheleaves-card-tooltip-type">${typeName[card.type]}</span>
        <span class="undertheleaves-card-tooltip-name">${_(card.name)}</span>
        <span class="undertheleaves-card-tooltip-description">${_(card.description)}</span>
      </div>
    `;
  }
}
