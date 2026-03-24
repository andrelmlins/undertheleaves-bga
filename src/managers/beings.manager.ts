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
    dojo.subscribe('mergeBee', this, (notif) => this.mergeBeeNotif(notif));
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

  private async mergeBeeNotif(notif: Notif<MergeBeeNotif>) {
    const gridBox = this.game.games.tileManager.getGridBoxDiv(notif.args.playerId);

    const existingPieces: HTMLElement[] = [];
    notif.args.oldBeings.forEach((being) => {
      being.cells.forEach((cell) => {
        gridBox
          .querySelectorAll<HTMLElement>(
            `.undertheleaves-being-position[data-x='${cell[0]}'][data-y='${cell[1]}'] .undertheleaves-piece[piece="bee"]`,
          )
          .forEach((el) => existingPieces.push(el));
      });
    });

    const { cells } = notif.args.mergedBeing;

    existingPieces.forEach((piece, i) => {
      const cell = cells[i % cells.length];
      const beingPositionElement = gridBox.querySelector<HTMLElement>(
        `.undertheleaves-being-position[data-x='${cell[0]}'][data-y='${cell[1]}']`,
      );

      const animation = new BgaLocalAnimation(this.game);
      animation.setWhere('afterbegin');
      animation.setOptions(piece, beingPositionElement, 300);
      animation.call();
    });
  }

  private async arrivalBeeNotif(notif: Notif<ArrivalBeeNotif>) {
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

      const cellDestination = sector.cells[countBeings % sector.cells.length];

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
