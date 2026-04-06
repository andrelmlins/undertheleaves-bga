class PlayerManager implements Game {
  counters: Record<string, Record<string, Counter>> = {};

  constructor(public game: UndertheLeavesGame) {}

  public setup() {
    for (let playerId in this.game.gamedatas.players) {
      this.counters[playerId] = {
        leaf: new ebg.counter(),
        puddle: new ebg.counter(),
        mushroom: new ebg.counter(),
        hummingbird: new ebg.counter(),
        bee: new ebg.counter(),
        round: new ebg.counter(),
      };

      const playerBoardHtml = `
        <div id="undertheleaves-player-board-${playerId}" class="undertheleaves-player-board">
          <div id="undertheleaves-player-board-round-${playerId}" class="undertheleaves-player-board-round">
            <span>
              <span class="undertheleaves-player-board-round-icon"></span>
              <span id="undertheleaves-round-count-${playerId}">0</span>&nbsp;/ 13
            </span>
          </div>
          <div class="undertheleaves-player-board-counters">
            <div class="undertheleaves-player-board-count">
              ${this.game.games.beingsManager.formatPiece('bee')}
              <span id="undertheleaves-bee-count-${playerId}">0</span>
            </div>
            <div class="undertheleaves-player-board-count">
              ${this.game.games.beingsManager.formatPiece('hummingbird')}
              <span id="undertheleaves-hummingbird-count-${playerId}">0</span>
            </div>
            <div class="undertheleaves-player-board-count">
              ${this.game.games.beingsManager.formatPiece('leaf')}
              <span id="undertheleaves-leaf-count-${playerId}">0</span>
            </div>
            <div class="undertheleaves-player-board-count">
              ${this.game.games.beingsManager.formatPiece('mushroom')}
              <span id="undertheleaves-mushroom-count-${playerId}">0</span>
            </div>
            <div class="undertheleaves-player-board-count">
              ${this.game.games.beingsManager.formatPiece('puddle')}
              <span id="undertheleaves-puddle-count-${playerId}">0</span>
            </div>
          </div>
        </div>
      `;

      this.game.bga.playerPanels.getElement(Number(playerId)).insertAdjacentHTML('beforeend', playerBoardHtml);

      this.counters[playerId].leaf.create(`undertheleaves-leaf-count-${playerId}`);
      this.counters[playerId].puddle.create(`undertheleaves-puddle-count-${playerId}`);
      this.counters[playerId].mushroom.create(`undertheleaves-mushroom-count-${playerId}`);
      this.counters[playerId].hummingbird.create(`undertheleaves-hummingbird-count-${playerId}`);
      this.counters[playerId].bee.create(`undertheleaves-bee-count-${playerId}`);
      this.counters[playerId].round.create(`undertheleaves-round-count-${playerId}`);

      const playerBeings = this.game.gamedatas.beings[playerId] ?? [];
      const totals = playerBeings.reduce(
        (acc, b) => {
          acc[b.type] = (acc[b.type] ?? 0) + b.count;
          return acc;
        },
        {} as Record<string, number>,
      );

      this.counters[playerId].bee.setValue(totals['bee'] ?? 0);
      this.counters[playerId].hummingbird.setValue(totals['hummingbird'] ?? 0);
      this.counters[playerId].leaf.setValue(totals['leaf'] ?? 0);
      this.counters[playerId].mushroom.setValue(totals['mushroom'] ?? 0);
      this.counters[playerId].puddle.setValue(totals['puddle'] ?? 0);
      this.counters[playerId].round.setValue(this.game.gamedatas.gridTiles[Number(playerId)]?.length ?? 0);
    }

    document
      .getElementById(`undertheleaves-player-board-round-${this.game.gamedatas.firstPlayerId}`)
      .insertAdjacentHTML('beforeend', '<div id="undertheleaves-first-player" class="undertheleaves-first-player"/>');
    this.game.addTooltip('undertheleaves-first-player', '', _('This is the first player'));
  }

  public incCounter(playerId: string | number, type: BeingType | string, by: number) {
    this.counters[String(playerId)]?.[type]?.incValue(by);
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
    dojo.subscribe('score', this, (notif) => this.scoreNotif(notif));
  }

  private async scoreNotif(notif: Notif<ScoreNotif>) {
    this.game.scoreCtrl[notif.args.playerId].toValue(notif.args.playerScore);
  }
}
