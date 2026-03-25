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
    dojo.subscribe('arrivalDiverPuddle',   this, (notif) => this.arrivalPuddleDwellerNotif(notif));
    dojo.subscribe('arrivalSkipperPuddle', this, (notif) => this.arrivalPuddleDwellerNotif(notif));
    dojo.subscribe('arrivalShyPuddle',     this, (notif) => this.arrivalPuddleDwellerNotif(notif));
    dojo.subscribe('arrivalHostMushroom',  this, (notif) => this.arrivalMushroomDwellerNotif(notif));
    dojo.subscribe('majorityBonus', this, (notif) => this.majorityBonusNotif(notif));
  }

  public renderBeing(being: Being) {
    const gridBox = this.game.games.tileManager.getGridBoxDiv(being.playerId);

    for (let i = 0; i < being.count; i++) {
      const cell = being.cells[i % being.cells.length];
      this.getCellDiv(gridBox, cell)?.insertAdjacentHTML('beforeend', this.formatPiece(being.type));
    }
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

  public formatPiece(piece: string, id?: string) {
    return `<div ${id ? `id=${id}` : ''} class="undertheleaves-piece" piece="${piece}"></div>`;
  }

  private getCellDiv(gridBox: HTMLElement, cell: number[]): HTMLElement | null {
    return gridBox.querySelector(`.undertheleaves-being-position[data-x='${cell[0]}'][data-y='${cell[1]}']`);
  }

  private countPiecesInSector(gridBox: HTMLElement, cells: number[][], pieceType: BeingType): number {
    return cells.reduce((acc, cell) => {
      const items =
        this.getCellDiv(gridBox, cell)?.querySelectorAll<HTMLElement>(`.undertheleaves-piece[piece="${pieceType}"]`) ??
        [];
      return acc + items.length;
    }, 0);
  }

  private async animatePieceFromVoid(pieceType: BeingType, destElement: HTMLElement): Promise<void> {
    const id = generateId();
    document
      .getElementById('undertheleaves-general-void-stock')
      .insertAdjacentHTML('beforeend', this.formatPiece(pieceType, id));

    const beingElement = document.getElementById(id);
    const animation = new BgaLocalAnimation(this.game);
    animation.setWhere('afterbegin');
    animation.setOptions(beingElement, destElement, 500);
    await animation.call();
  }

  private async mergeBeeNotif(notif: Notif<MergeBeeNotif>) {
    const gridBox = this.game.games.tileManager.getGridBoxDiv(notif.args.playerId);

    const existingPieces: HTMLElement[] = [];
    notif.args.oldBeings.forEach((being) => {
      being.cells.forEach((cell) => {
        this.getCellDiv(gridBox, cell)
          ?.querySelectorAll<HTMLElement>('.undertheleaves-piece[piece="bee"]')
          .forEach((el) => existingPieces.push(el));
      });
    });

    const { cells } = notif.args.mergedBeing;

    existingPieces.forEach((piece, i) => {
      const cell = cells[i % cells.length];
      const beingPositionElement = this.getCellDiv(gridBox, cell);

      const animation = new BgaLocalAnimation(this.game);
      animation.setWhere('afterbegin');
      animation.setOptions(piece, beingPositionElement, 300);
      animation.call();
    });
  }

  private async arrivalMushroomDwellerNotif(notif: Notif<ArrivalMushroomDwellerNotif>) {
    const gridBox = this.game.games.tileManager.getGridBoxDiv(notif.args.playerId);

    for (const sector of notif.args.sectors) {
      const countBeings = this.countPiecesInSector(gridBox, sector.cells, 'mushroom');
      const cellDestination = sector.cells[countBeings % sector.cells.length];
      const destElement = this.getCellDiv(gridBox, cellDestination);

      if (!destElement) continue;

      await this.animatePieceFromVoid('mushroom', destElement);
    }

    this.game.games.playerManager.incCounter(notif.args.playerId, 'mushroom', notif.args.count_beings);
  }

  private async arrivalPuddleDwellerNotif(notif: Notif<ArrivalPuddleDwellerNotif>) {
    const gridBox = this.game.games.tileManager.getGridBoxDiv(notif.args.playerId);

    for (const sector of notif.args.sectors) {
      const countBeings = this.countPiecesInSector(gridBox, sector.cells, 'puddle');
      const cellDestination = sector.cells[countBeings % sector.cells.length];
      const destElement = this.getCellDiv(gridBox, cellDestination);

      if (!destElement) continue;

      await this.animatePieceFromVoid('puddle', destElement);
    }

    this.game.games.playerManager.incCounter(notif.args.playerId, 'puddle', notif.args.count_beings);
  }

  private async arrivalHummingbirdNotif(notif: Notif<ArrivalHummingbirdNotif>) {
    const gridBox = this.game.games.tileManager.getGridBoxDiv(notif.args.playerId);

    for (const tile of notif.args.tiles) {
      const nestBox = gridBox.querySelector<HTMLElement>(
        `.undertheleaves-being-center-position[data-x='${tile.x}'][data-y='${tile.y}']`,
      );

      for (let i = 0; i < tile.delta; i++) {
        if (!nestBox) continue;
        await this.animatePieceFromVoid('hummingbird', nestBox);
      }
    }

    this.game.games.playerManager.incCounter(notif.args.playerId, 'hummingbird', notif.args.count_beings);
  }

  private async arrivalBeeNotif(notif: Notif<ArrivalBeeNotif>) {
    const gridBox = this.game.games.tileManager.getGridBoxDiv(notif.args.playerId);

    for (const sector of notif.args.sectors) {
      const countBeings = this.countPiecesInSector(gridBox, sector.cells, 'bee');
      const cellDestination = sector.cells[countBeings % sector.cells.length];
      const destElement = this.getCellDiv(gridBox, cellDestination);

      if (!destElement) continue;

      await this.animatePieceFromVoid('bee', destElement);
    }

    this.game.games.playerManager.incCounter(notif.args.playerId, 'bee', notif.args.sectors.length);
  }

  private async majorityBonusNotif(notif: Notif<MajorityBonusNotif>) {
    const pieceType = notif.args.type.replace('_dweller', '') as BeingType;
    const gridBox = this.game.games.tileManager.getGridBoxDiv(notif.args.player_id);

    for (let i = 0; i < notif.args.count; i++) {
      const cell = notif.args.cells[i % notif.args.cells.length];
      const destBox = this.getCellDiv(gridBox, cell);

      if (!destBox) continue;

      await this.animatePieceFromVoid(pieceType, destBox);
    }

    this.game.games.playerManager.incCounter(notif.args.player_id, notif.args.type, notif.args.count);
  }
}
