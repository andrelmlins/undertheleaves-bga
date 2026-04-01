class BeingsManager implements Game {
  constructor(public game: UndertheLeavesGame) {}

  public setup() {
    for (let playerId in this.game.gamedatas.beings) {
      const playerBeings = this.game.gamedatas.beings[playerId];

      for (const being of playerBeings) {
        if (being.type === 'hummingbird') {
          this.renderHummingbird(being);
        } else if (being.type === 'leaf' && (being.subtype === 'thoughtful' || being.subtype === 'flirty')) {
          const centerDiv = this.getOrCreateCornerDiv(being.playerId, being.cells);
          for (let i = 0; i < being.count; i++) {
            centerDiv?.insertAdjacentHTML('beforeend', this.formatPiece('leaf'));
          }
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
    dojo.subscribe('arrivalBee', this, (notif) => this.arrivalGenericNotif(notif));
    dojo.subscribe('mergeBee', this, (notif) => this.mergeBeeNotif(notif));
    dojo.subscribe('arrivalHummingbird', this, (notif) => this.arrivalHummingbirdNotif(notif));
    dojo.subscribe('arrivalDiverPuddle', this, (notif) => this.arrivalGenericNotif(notif));
    dojo.subscribe('arrivalSkipperPuddle', this, (notif) => this.arrivalGenericNotif(notif));
    dojo.subscribe('arrivalShyPuddle', this, (notif) => this.arrivalGenericNotif(notif));
    dojo.subscribe('arrivalFriendlyPuddle', this, (notif) => this.arrivalGenericNotif(notif));
    dojo.subscribe('arrivalHostMushroom', this, (notif) => this.arrivalGenericNotif(notif));
    dojo.subscribe('arrivalExplorerMushroom', this, (notif) => this.arrivalGenericNotif(notif));
    dojo.subscribe('arrivalLonerMushroom', this, (notif) => this.arrivalGenericNotif(notif));
    dojo.subscribe('arrivalCollectorMushroom', this, (notif) => this.arrivalGenericNotif(notif));
    dojo.subscribe('arrivalThoughtfulLeaf', this, (notif) => this.arrivalLeafDwellerNotif(notif));
    dojo.subscribe('arrivalFlirtyLeaf', this, (notif) => this.arrivalLeafDwellerNotif(notif));
    dojo.subscribe('arrivalRestlessLeaf', this, (notif) => this.arrivalGenericNotif(notif));
    dojo.subscribe('arrivalRunnerLeaf', this, (notif) => this.arrivalGenericNotif(notif));
    dojo.subscribe('majorityBonus', this, (notif) => this.majorityBonusNotif(notif));
  }

  public renderBeing(being: Being) {
    for (let i = 0; i < being.count; i++) {
      const cell = being.cells[i % being.cells.length];
      this.getTerrainDiv(being.playerId, cell)?.insertAdjacentHTML('beforeend', this.formatPiece(being.type));
    }
  }

  public renderHummingbird(being: Being) {
    const centerDiv = this.getOrCreateCornerDiv(being.playerId, this.getTileCells(being.x, being.y));
    for (let i = 0; i < being.count; i++) {
      centerDiv?.insertAdjacentHTML('beforeend', this.formatPiece('hummingbird'));
    }
  }

  private getTileCells(x: number, y: number): number[][] {
    return [
      [x * 2, y * 2],
      [x * 2 + 1, y * 2],
      [x * 2, y * 2 - 1],
      [x * 2 + 1, y * 2 - 1],
    ];
  }

  public formatPiece(piece: string, id?: string) {
    return `<div ${id ? `id=${id}` : ''} class="undertheleaves-piece" piece="${piece}"></div>`;
  }

  public getTerrainDiv(playerId: number, cell: number[]): HTMLElement | null {
    return document.querySelector(
      `#undertheleaves-player-grid-${playerId} .undertheleaves-terrain[data-x='${cell[0]}'][data-y='${cell[1]}']`,
    );
  }

  private countPiecesInSector(playerId: number, cells: number[][], pieceType: BeingType): number {
    return cells.reduce((acc, cell) => {
      const items =
        this.getTerrainDiv(playerId, cell)?.querySelectorAll<HTMLElement>(
          `.undertheleaves-piece[piece="${pieceType}"]`,
        ) ?? [];
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
    const existingPieces: HTMLElement[] = [];
    notif.args.oldBeings.forEach((being) => {
      being.cells.forEach((cell) => {
        this.getTerrainDiv(notif.args.playerId, cell)
          ?.querySelectorAll<HTMLElement>('.undertheleaves-piece[piece="bee"]')
          .forEach((el) => existingPieces.push(el));
      });
    });

    const { cells } = notif.args.mergedBeing;

    existingPieces.forEach((piece, i) => {
      const cell = cells[i % cells.length];
      const beingPositionElement = this.getTerrainDiv(notif.args.playerId, cell);

      const animation = new BgaLocalAnimation(this.game);
      animation.setWhere('afterbegin');
      animation.setOptions(piece, beingPositionElement, 300);
      animation.call();
    });
  }

  private async arrivalGenericNotif(notif: Notif<ArrivalGenericNotif>) {
    for (const sector of notif.args.sectors) {
      const countBeings = this.countPiecesInSector(notif.args.playerId, sector.cells, notif.args.being);
      const cellDestination = sector.cells[countBeings % sector.cells.length];
      const destElement = this.getTerrainDiv(notif.args.playerId, cellDestination);

      if (!destElement) continue;

      await this.animatePieceFromVoid(notif.args.being, destElement);
    }

    this.game.games.playerManager.incCounter(notif.args.playerId, 'mushroom', notif.args.sectors.length);
  }

  private async arrivalLeafDwellerNotif(notif: Notif<ArrivalGenericNotif>) {
    for (const sector of notif.args.sectors) {
      const centerDiv = this.getOrCreateCornerDiv(notif.args.playerId, sector.cells);
      if (!centerDiv) continue;
      await this.animatePieceFromVoid('leaf', centerDiv);
    }

    this.game.games.playerManager.incCounter(notif.args.playerId, 'leaf', notif.args.sectors.length);
  }

  private getOrCreateCornerDiv(playerId: number, cells: number[][]): HTMLElement | null {
    const minX = Math.min(...cells.map((c) => c[0]));
    const minY = Math.min(...cells.map((c) => c[1]));
    const id = `undertheleaves-being-center-${playerId}-${minX}-${minY}`;

    const existing = document.getElementById(id);
    if (existing) return existing;

    const maxY = Math.max(...cells.map((c) => c[1]));
    const topLeftCell = cells.filter((c) => c[1] === maxY).sort((a, b) => a[0] - b[0])[0];
    const terrainDiv = this.getTerrainDiv(playerId, topLeftCell);
    if (!terrainDiv) return null;

    terrainDiv.style.zIndex = '10';

    const centerDiv = document.createElement('div');
    centerDiv.id = id;
    centerDiv.className = 'undertheleaves-being-corner-position';
    terrainDiv.appendChild(centerDiv);

    return centerDiv;
  }

  private async arrivalHummingbirdNotif(notif: Notif<ArrivalHummingbirdNotif>) {
    for (const tile of notif.args.tiles) {
      const nestBox = this.getOrCreateCornerDiv(notif.args.playerId, this.getTileCells(tile.x, tile.y));

      for (let i = 0; i < tile.delta; i++) {
        if (!nestBox) continue;
        await this.animatePieceFromVoid('hummingbird', nestBox);
      }
    }

    const totalDelta = notif.args.tiles.reduce((sum, t) => sum + t.delta, 0);
    this.game.games.playerManager.incCounter(notif.args.playerId, 'leaf', totalDelta);
  }

  private async majorityBonusNotif(notif: Notif<MajorityBonusNotif>) {
    const pieceType = notif.args.type.replace('_dweller', '') as BeingType;

    for (let i = 0; i < notif.args.count; i++) {
      const cell = notif.args.cells[i % notif.args.cells.length];
      const destBox = this.getTerrainDiv(notif.args.playerId, cell);

      if (!destBox) continue;

      await this.animatePieceFromVoid(pieceType, destBox);
    }

    this.game.games.playerManager.incCounter(notif.args.playerId, notif.args.type, notif.args.count);
  }
}
