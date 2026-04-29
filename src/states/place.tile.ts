class PlaceTile implements Game {
  private handlers: any[];
  private externalTileSelected: { x: number; y: number; rotation: number; inverse: boolean; tileId: string };

  private isAnimating = false;

  constructor(public game: UndertheLeavesGame) {
    this.handlers = [];
  }

  public setup() {
    //
  }

  public onEnteringState(stateName: string, notif: Notif<PlaceTileState>) {
    if (stateName === 'PlaceTile' && this.game.bga.players.isCurrentPlayerActive()) {
      this.game.bga.states.setClientState('client_SelectTile', {
        descriptionmyturn: _('${you} must select a garden tile'),
      });
    } else if (stateName === 'client_SelectTile') {
      this.game.games.tileManager.showOfferCardSelectable((tileId: string) => {
        this.externalTileSelected = { x: null, y: null, rotation: 0, inverse: false, tileId };
        this.game.bga.states.setClientState('client_PlaceTile', {
          descriptionmyturn: _('${you} must place a garden tile'),
        });
      });
    } else if (stateName === 'client_PlaceTile') {
      this.game.games.tileManager.removeOfferCardSelectable();
      const tileElement = this.game.games.tileManager.getTileById(this.externalTileSelected.tileId)!;
      tileElement.classList.add('selected');
      this.handlers.push(dojo.connect(tileElement, 'onclick', () => this.onClickChangeDirection('right')));
      this.showSelectExternals(notif.args.tableTiles);
    }
  }

  public onUpdateActionButtons(stateName: string, args: PlaceTileState) {
    if (stateName === 'client_MoveTile') {
      this.game.statusBar.addActionButton(_('Place tile'), () => this.onClick());
    }

    if (stateName === 'client_PlaceTile' || stateName === 'client_MoveTile') {
      this.game.statusBar.addActionButton(
        '<i class="fa6 fa6-rotate-right"></i>',
        () => this.onClickChangeDirection('right'),
        { color: 'secondary' },
      );
      this.game.statusBar.addActionButton(
        '<i class="fa6 fa6-rotate-left"></i>',
        () => this.onClickChangeDirection('left'),
        { color: 'secondary' },
      );
      this.game.statusBar.addActionButton(
        '<i class="fa6 fa6-right-left"></i>',
        () => this.onClickChangeDirection('inverse'),
        { color: 'secondary' },
      );
      this.game.statusBar.addActionButton(_('Cancel'), () => this.onClickCancel(), {
        color: 'alert',
      });
    }
  }

  public onLeavingState(stateName: string) {
    //
  }

  public setupNotifications() {
    dojo.subscribe('revealTile', this, (notif) => this.revealTileNotif(notif));
    dojo.subscribe('placeTile', this, (notif) => this.placeTileNotif(notif));
  }

  public showSelectExternals(tiles: GridTile[]) {
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const tileMap = new Set(tiles.map((t) => `${t.x},${t.y}`));
    const externalsMap: { x: number; y: number }[] = [];
    const playerId = this.game.bga.players.getCurrentPlayerId();
    const gridBoxDiv = this.game.games.tileManager.getGridBoxDiv(playerId);

    gridBoxDiv.querySelectorAll<HTMLElement>('.undertheleaves-player-cell').forEach((cell) => {
      if (cell.childNodes.length === 0) cell.remove();
    });

    tiles.forEach((tile) => {
      dirs.forEach(([dx, dy]) => {
        const x = tile.x + dx;
        const y = tile.y + dy;

        const key = `${x},${y}`;

        if (!tileMap.has(key)) {
          tileMap.add(key);
          externalsMap.push({ x, y });
        }
      });
    });

    const externalsSet = new Set(externalsMap.map((p) => `${p.x},${p.y}`));

    externalsMap.forEach((pos) => {
      let element = gridBoxDiv.querySelector<HTMLElement>(
        `.undertheleaves-player-cell[data-x="${pos.x}"][data-y="${pos.y}"]`,
      );

      if (!element) {
        gridBoxDiv.insertAdjacentHTML(
          'beforeend',
          `<div class="undertheleaves-player-cell selectable" data-x=${pos.x} data-y=${pos.y}></div>`,
        );

        element = gridBoxDiv.querySelector<HTMLElement>(
          `.undertheleaves-player-cell[data-x="${pos.x}"][data-y="${pos.y}"]`,
        );
      } else {
        element.classList.add('selectable');
      }

      if (!externalsSet.has(`${pos.x},${pos.y + 1}`)) element.classList.add('selectable-border-top');
      if (!externalsSet.has(`${pos.x - 1},${pos.y}`)) element.classList.add('selectable-border-left');

      this.handlers.push(
        dojo.connect(element, 'onclick', async () => {
          if (this.externalTileSelected && (this.externalTileSelected.x != pos.x || this.externalTileSelected.y != pos.y)) {
            this.externalTileSelected.x = pos.x;
            this.externalTileSelected.y = pos.y;

            await this.moveTileSelected(this.externalTileSelected.tileId);

            const tileElement = this.game.games.tileManager.getTileById(this.externalTileSelected.tileId);
            tileElement.querySelectorAll('.undertheleaves-terrain').forEach((item) => item.remove());
            tileElement.insertAdjacentHTML('beforeend', this.game.games.tileManager.formatBeingPositions(pos.x, pos.y));

            this.game.bga.states.setClientState('client_MoveTile', {
              descriptionmyturn: _('${you} must place a garden tile'),
            });
          }
        }),
      );
    });

    this.game.games.tileManager.recalculateGrid(playerId);
    this.game.games.tileManager.applyZoom(Number(playerId), false);
  }

  public async removeSelectExternals() {
    this.handlers.forEach((h) => dojo.disconnect(h));
    this.handlers = [];

    const playerId = this.game.bga.players.getCurrentPlayerId();
    this.game.games.tileManager
      .getGridBoxDiv(playerId)
      .querySelectorAll<HTMLElement>('.selectable')
      .forEach((item) => item.classList.remove('selectable'));

    this.game.games.tileManager.recalculateGrid(playerId);
    this.game.games.tileManager.applyZoom(playerId, false);
  }

  public onClick() {
    const rotation = ((this.externalTileSelected.rotation % 360) + 360) % 360;
    const tileId = this.externalTileSelected.tileId;

    this.game.bga.actions.performAction('actPlaceTile', { ...this.externalTileSelected, rotation }).then(() => {
      this.game.games.tileManager.getTileById(tileId)?.classList.remove('selected');

      this.externalTileSelected = null;
      this.removeSelectExternals();
    });
  }

  public async onClickCancel() {
    const tileElement = this.game.games.tileManager.getTileById(this.externalTileSelected.tileId);
    const offerElement = document.getElementById('undertheleaves-offer');

    tileElement.classList.remove('selected');

    if (tileElement.parentElement.id !== 'undertheleaves-offer') {
      const animation = new BgaLocalAnimation(this.game);
      animation.setOptions(tileElement, offerElement, 500);
      await animation.call();
    }

    tileElement.querySelector<HTMLElement>('.undertheleaves-tile-box').style.transform = `rotate(0deg)`;
    tileElement.querySelector<HTMLElement>('.undertheleaves-tile-flipper').style.transform = '';

    this.externalTileSelected = null;
    this.removeSelectExternals();
    this.game.bga.states.setClientState('client_SelectTile', {
      descriptionmyturn: _('${you} must select a garden tile'),
    });
  }

  public async onClickChangeDirection(type: 'right' | 'left' | 'inverse') {
    if (this.isAnimating) return;

    const tileElement = this.game.games.tileManager.getBoxTileById(this.externalTileSelected.tileId);
    const flipper = this.game.games.tileManager.getFlipperTileById(this.externalTileSelected.tileId);

    this.isAnimating = true;

    const rotationDelta = this.externalTileSelected.inverse ? -90 : 90;
    if (type === 'right') this.externalTileSelected.rotation += rotationDelta;
    if (type === 'left') this.externalTileSelected.rotation -= rotationDelta;
    if (type === 'inverse') this.externalTileSelected.inverse = !this.externalTileSelected.inverse;

    tileElement.style.transform = `rotate(${this.externalTileSelected.rotation}deg)`;
    flipper.style.transform = this.externalTileSelected.inverse ? 'rotateY(180deg)' : '';

    await delayTime(300);

    this.isAnimating = false;
  }

  public async moveTileSelected(tileSelectedId: string) {
    const playerId = this.game.bga.players.getCurrentPlayerId();
    const tileElement = this.game.games.tileManager.getTileById(tileSelectedId);
    const externalTileSelectedElement = this.game.games.tileManager
      .getGridBoxDiv(playerId)
      .querySelector<HTMLElement>(
        `.undertheleaves-player-cell[data-x="${this.externalTileSelected.x}"][data-y="${this.externalTileSelected.y}"]`,
      );

    const animation = new BgaLocalAnimation(this.game);
    animation.setOptions(tileElement, externalTileSelectedElement, 500);

    await animation.call();
  }

  private async revealTileNotif(notif: Notif<RevealTileNotif>) {
    document
      .getElementById('undertheleaves-bag')
      .insertAdjacentHTML('beforeend', this.game.games.tileManager.formatTile(notif.args.tile));

    const offerElement = document.getElementById('undertheleaves-offer');
    const tileSelectedElement = this.game.games.tileManager.getTileById(notif.args.tile.id);

    const animation = new BgaLocalAnimation(this.game);
    animation.setWhere('afterbegin');
    animation.setOptions(tileSelectedElement, offerElement, 500);

    animation.call().then(() => this.game.games.tileManager.deckCounter.incValue(-1));
  }

  private async placeTileNotif(notif: Notif<PlaceTileNotif>) {
    const tileElement = this.game.games.tileManager.getTileById(notif.args.gridTile.tile.id);
    const alreadyInGrid = !!tileElement?.closest('.undertheleaves-player-cell');

    if (!alreadyInGrid) {
      const tileBoxElement = this.game.games.tileManager.getBoxTileById(notif.args.gridTile.tile.id);
      const flipperElement = this.game.games.tileManager.getFlipperTileById(notif.args.gridTile.tile.id);
      tileBoxElement.style.transform = `rotate(${notif.args.gridTile.rotation}deg)`;
      flipperElement.style.transform = notif.args.gridTile.side == 1 ? 'rotateY(180deg)' : '';

      const playerGridBoxElement = this.game.games.tileManager.getGridBoxDiv(notif.args.playerId);

      if (
        !playerGridBoxElement.querySelector<HTMLElement>(
          `.undertheleaves-player-cell[data-x="${notif.args.gridTile.x}"][data-y="${notif.args.gridTile.y}"]`,
        )
      ) {
        this.game.games.tileManager
          .getGridBoxDiv(notif.args.playerId)
          .insertAdjacentHTML(
            'afterbegin',
            `<div class="undertheleaves-player-cell selectable" data-x="${notif.args.gridTile.x}" data-y="${notif.args.gridTile.y}"></div>`,
          );
      }

      this.game.games.tileManager.recalculateGrid(notif.args.playerId);
      this.game.games.tileManager.applyZoom(notif.args.playerId);
      this.game.games.tileManager.addTileToBeingsOverlay(notif.args.gridTile, notif.args.playerId);

      await delayTime(300);

      const externalElement = playerGridBoxElement.querySelector<HTMLElement>(
        `.undertheleaves-player-cell[data-x="${notif.args.gridTile.x}"][data-y="${notif.args.gridTile.y}"]`,
      );

      const animation = new BgaLocalAnimation(this.game);
      animation.setWhere('afterbegin');
      animation.setOptions(tileElement, externalElement, 700);

      await animation.call();

      externalElement.classList.remove('selectable');
    } else {
      this.game.games.tileManager.addTileToBeingsOverlay(notif.args.gridTile, notif.args.playerId);
    }

    this.game.games.playerManager.incCounter(notif.args.playerId, 'round', 1);
  }
}
