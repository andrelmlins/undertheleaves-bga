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
      };

      const playerBoardHtml = `
        <div id="undertheleaves-player-board-${playerId}" class="undertheleaves-player-board">
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
      `;

      this.game.bga.playerPanels.getElement(Number(playerId)).insertAdjacentHTML('beforeend', playerBoardHtml);

      this.counters[playerId].leaf.create(`undertheleaves-leaf-count-${playerId}`);
      this.counters[playerId].puddle.create(`undertheleaves-puddle-count-${playerId}`);
      this.counters[playerId].mushroom.create(`undertheleaves-mushroom-count-${playerId}`);
      this.counters[playerId].hummingbird.create(`undertheleaves-hummingbird-count-${playerId}`);
      this.counters[playerId].bee.create(`undertheleaves-bee-count-${playerId}`);

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
    }
  }

  public incCounter(playerId: string | number, type: BeingType, by: number) {
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
