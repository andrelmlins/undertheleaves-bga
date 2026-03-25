class BeingsManager implements Game {
  constructor(public game: UndertheLeavesGame) {}

  public setup() {
    for (let playerId in this.game.gamedatas.beings) {
      const playerBeings = this.game.gamedatas.beings[playerId];

      for (const being of playerBeings) {
        if (being.type === 'hummingbird') {
          this.renderHummingbird(being);
        } else {
          this.renderBeing(being);
        }
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
    dojo.subscribe('arrivalHummingbird', this, (notif) => this.arrivalHummingbirdNotif(notif));
  }

  public renderBeing(being: Being) {
    const gridBox = this.game.games.tileManager.getGridBoxDiv(being.playerId);

    for (let i = 0; i < being.count; i++) {
      const cell = being.cells[i % being.cells.length];
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

  public renderHummingbird(being: Being) {
    const gridBox = this.game.games.tileManager.getGridBoxDiv(being.playerId);

    for (let i = 0; i < being.count; i++) {
      const nestBox = gridBox.querySelector(
        `.undertheleaves-being-center-position[data-x='${being.x}'][data-y='${being.y}']`,
      );
      nestBox?.insertAdjacentHTML('beforeend', this.formatPiece('hummingbird'));
    }
  }

  private async arrivalHummingbirdNotif(notif: Notif<ArrivalHummingbirdNotif>) {
    const gridBox = this.game.games.tileManager.getGridBoxDiv(notif.args.playerId);

    for (const tile of notif.args.tiles) {
      for (let i = 0; i < tile.delta; i++) {
        const id = generateId();
        document
          .getElementById('undertheleaves-general-void-stock')
          .insertAdjacentHTML('beforeend', this.formatPiece('hummingbird', id));

        const nestBox = gridBox.querySelector<HTMLElement>(
          `.undertheleaves-being-center-position[data-x='${tile.x}'][data-y='${tile.y}']`,
        );

        const beingElement = document.getElementById(id);

        if (!nestBox) {
          beingElement?.remove();
          continue;
        }

        const animation = new BgaLocalAnimation(this.game);
        animation.setWhere('afterbegin');
        animation.setOptions(beingElement, nestBox, 500);
        await animation.call();
      }
    }
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
