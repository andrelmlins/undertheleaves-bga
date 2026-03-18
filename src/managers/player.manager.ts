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
            <div class="undertheleaves-piece" piece="bee"></div>
            <span id="undertheleaves-bee-count-${playerId}">0</span>
          </div>
          <div class="undertheleaves-player-board-count">
            <div class="undertheleaves-piece" piece="hummingbird"></div>
            <span id="undertheleaves-hummingbird-count-${playerId}">0</span>
          </div>
          <div class="undertheleaves-player-board-count">
            <div class="undertheleaves-piece" piece="leaf"></div>
            <span id="undertheleaves-leaf-count-${playerId}">0</span>
          </div>
          <div class="undertheleaves-player-board-count">
            <div class="undertheleaves-piece" piece="mushroom"></div>
            <span id="undertheleaves-mushroom-count-${playerId}">0</span>
          </div>
          <div class="undertheleaves-player-board-count">
            <div class="undertheleaves-piece" piece="puddle"></div>
            <span id="undertheleaves-puddle-count-${playerId}">0</span>
          </div>
        </div>
      `;

      document.getElementById(`overall_player_board_${playerId}`).insertAdjacentHTML('beforeend', playerBoardHtml);

      this.counters[playerId].leaf.create(`undertheleaves-leaf-count-${playerId}`);
      this.counters[playerId].puddle.create(`undertheleaves-puddle-count-${playerId}`);
      this.counters[playerId].mushroom.create(`undertheleaves-mushroom-count-${playerId}`);
      this.counters[playerId].hummingbird.create(`undertheleaves-hummingbird-count-${playerId}`);
      this.counters[playerId].bee.create(`undertheleaves-bee-count-${playerId}`);
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
    //
  }
}
