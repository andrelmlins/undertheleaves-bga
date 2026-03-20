class BeingsManager implements Game {
  constructor(public game: UndertheLeavesGame) {}

  public setup() {
    for (let playerId in this.game.gamedatas.beings) {
      const playerBeings = this.game.gamedatas.beings[playerId];

      for (const being of playerBeings) {
        this.renderBeing(being);
      }
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
    dojo.subscribe('arrivalBee', this, (notif) => this.arrivalBeeNotif(notif));
  }

  public renderBeing(being: Being) {
    const gridBox = this.game.games.tileManager.getGridBoxDiv(being.playerId);

    for (let i = 1; i <= being.count; i++) {
      const cellIndex = i % being.cells.length;

      const cell = being.cells[cellIndex - 1];
      const cellBox = gridBox.querySelector(`.undertheleaves-being-position[data-x='${cell[0]}'][data-y='${cell[1]}']`);

      cellBox.insertAdjacentHTML('beforeend', this.formatPiece('bee'));
    }
  }

  public formatPiece(piece: string, id?: string) {
    return `<div ${id ? `id=${id}` : ''} class="undertheleaves-piece" piece="${piece}"></div>`;
  }

  private async arrivalBeeNotif(notif: Notif<ArrivalBee>) {
    const gridBox = this.game.games.tileManager.getGridBoxDiv(notif.args.playerId);

    notif.args.sectors.map((sector) => {
      const id = generateId();
      document
        .getElementById('undertheleaves-general-void-stock')
        .insertAdjacentHTML('beforeend', this.formatPiece('bee', id));

      const countBeings = sector.cells.reduce((acc, cell) => {
        const itens = gridBox
          .querySelector(`.undertheleaves-being-position[data-x='${cell[0]}'][data-y='${cell[1]}']`)
          .querySelectorAll<HTMLElement>('.undertheleaves-piece[piece="bee"]');

        return [...acc, ...Array.from(itens)];
      }, []).length;

      const cellDestination = sector.cells[(countBeings % sector.cells.length) - 1];

      const beingElement = document.getElementById(id);
      const beingPositionElement = gridBox.querySelector<HTMLElement>(
        `.undertheleaves-being-position[data-x='${cellDestination[0]}'][data-y='${cellDestination[1]}']`,
      );

      const animation = new BgaLocalAnimation(this.game);
      animation.setWhere('afterbegin');
      animation.setOptions(beingElement, beingPositionElement, 500);

      animation.call();
    });
  }
}
