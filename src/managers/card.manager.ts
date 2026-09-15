class CardManager implements Game {
  constructor(public game: UndertheLeavesGame) {}

  public setup() {
    const cardsBox = document.getElementById('undertheleaves-cards');
    const { leaf, mushroom, puddle, tree } = this.game.gamedatas.cards;

    cardsBox.insertAdjacentHTML('beforeend', this.formatCard(leaf));
    cardsBox.insertAdjacentHTML('beforeend', this.formatCard(mushroom));
    cardsBox.insertAdjacentHTML('beforeend', this.formatCard(puddle));

    this.game.addTooltipHtml('undertheleaves-card-leaf', this.formatCardTooltip(leaf));
    this.game.addTooltipHtml('undertheleaves-card-mushroom', this.formatCardTooltip(mushroom));
    this.game.addTooltipHtml('undertheleaves-card-puddle', this.formatCardTooltip(puddle));

    if (tree) {
      this.renderTreeCard(tree, this.game.gamedatas.treeCardOwnerId);
      this.game.addTooltipHtml('undertheleaves-card-tree', this.formatCardTooltip(tree));
    }
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
    dojo.subscribe('takeBurlyTreeCard', this, (notif) => this.takeBurlyTreeCardNotif(notif));
  }

  private async takeBurlyTreeCardNotif(notif: Notif<TakeBurlyTreeCardNotif>) {
    const tree = this.game.gamedatas.cards.tree;
    if (!tree) return;

    this.game.gamedatas.treeCardOwnerId = notif.args.playerId;
    await this.moveTreeCard(notif.args.playerId);
  }

  private renderTreeCard(tree: CardConfig, ownerId: number | null) {
    const isOwned = ownerId != null;
    const container = isOwned
      ? document.getElementById(`undertheleaves-player-board-tree-${ownerId}`)
      : document.getElementById('undertheleaves-cards');

    if (!container) return;

    container.insertAdjacentHTML('beforeend', this.formatCard(tree, isOwned));
  }

  private async moveTreeCard(ownerId: number | null): Promise<void> {
    const cardElement = document.getElementById('undertheleaves-card-tree');
    const isOwned = ownerId != null;
    const container = isOwned
      ? document.getElementById(`undertheleaves-player-board-tree-${ownerId}`)
      : document.getElementById('undertheleaves-cards');

    if (!cardElement || !container) return;

    cardElement.classList.toggle('undertheleaves-card-mini', isOwned);

    const animation = new BgaLocalAnimation(this.game);
    animation.setWhere('beforeend');
    animation.setOptions(cardElement, container, 500);
    await animation.call();
  }

  public formatCard(card: CardConfig, mini: boolean = false) {
    return `<div id="undertheleaves-card-${card.type}" class="undertheleaves-card${mini ? ' undertheleaves-card-mini' : ''}" line="${card.position.row}" column="${card.position.column}"></div>`;
  }

  public formatCardTooltip(card: CardConfig) {
    const typeName = {
      leaf: _('Leaf Dweller'),
      mushroom: _('Mushroom Dweller'),
      puddle: _('Puddle Dweller'),
      tree: _('Tree Dweller'),
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
