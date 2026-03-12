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
      this.game.games.tileManager.getTileById(this.externalTileSelected.tileId).classList.add('selected');
      this.showSelectExternals(notif.args.tableTiles);
    }
  }

  public onUpdateActionButtons(stateName: string, args: PlaceTileState) {
    if (stateName === 'client_MoveTile') {
      this.game.statusBar.addActionButton(_('Place tile'), () => this.onClick(args.tableTiles));
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
      this.game.statusBar.addActionButton(_('Cancel'), () => this.onClickCancel(args.tableTiles), {
        color: 'alert',
      });
    }
  }

  public onLeavingState(stateName: string) {}

  public setupNotifications() {
    //
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

    this.game.games.tileManager.createGridTiles(tiles, playerId);

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

    externalsMap.forEach((pos) => {
      let element = gridBoxDiv.querySelector<HTMLElement>(`[data-x="${pos.x}"][data-y="${pos.y}"]`);

      if (!element) {
        gridBoxDiv.insertAdjacentHTML(
          'beforeend',
          `<div class="undertheleaves-player-cell selectable" data-x=${pos.x} data-y=${pos.y}></div>`,
        );

        element = gridBoxDiv.querySelector<HTMLElement>(`[data-x="${pos.x}"][data-y="${pos.y}"]`);
      } else {
        element.classList.add('selectable');
      }

      this.handlers.push(
        dojo.connect(element, 'onclick', async () => {
          if (this.externalTileSelected?.x != pos.x || this.externalTileSelected?.y != pos.y) {
            this.externalTileSelected.x = pos.x;
            this.externalTileSelected.y = pos.y;

            await this.moveTileSelected(this.externalTileSelected.tileId);

            this.game.bga.states.setClientState('client_MoveTile', {
              descriptionmyturn: _('${you} must place a garden tile'),
            });
          }
        }),
      );
    });

    this.game.games.tileManager.recalculateGrid(playerId);
    this.game.games.tileManager.gridMap[playerId].scrollToCenter();
  }

  public async removeSelectExternals(tiles: GridTile[]) {
    const playerId = this.game.bga.players.getCurrentPlayerId();
    this.game.games.tileManager.createGridTiles(tiles, playerId);

    await delayTime(300);

    this.game.games.tileManager.gridMap[playerId].scrollToCenter();
  }

  public onClick(tiles: GridTile[]) {
    this.game.bga.actions
      .performAction('actPlaceTile', {
        ...this.externalTileSelected,
        rotation: this.externalTileSelected.rotation % 360,
      })
      .then(() => {
        this.game.games.tileManager.getTileById(this.externalTileSelected.tileId).classList.remove('selected');

        this.externalTileSelected = null;
        this.removeSelectExternals(tiles);
      });
  }

  public async onClickCancel(tiles: GridTile[]) {
    const tileElement = this.game.games.tileManager.getTileById(this.externalTileSelected.tileId);
    const offerElement = document.getElementById('undertheleaves-offer');

    tileElement.classList.remove('selected');

    if (tileElement.parentElement.id !== 'undertheleaves-offer') {
      const animation = new BgaLocalAnimation(this.game);
      animation.setOptions(tileElement, offerElement, 500);
      await animation.call();
    }

    tileElement.querySelector<HTMLElement>('.undertheleaves-tile-box').style.transform = `rotate(0deg)`;
    tileElement.querySelector<HTMLElement>('.undertheleaves-tile-inner').style.transform = '';

    this.externalTileSelected = null;
    this.removeSelectExternals(tiles);
    this.game.bga.states.setClientState('client_SelectTile', {
      descriptionmyturn: _('${you} must select a garden tile'),
    });
  }

  public async onClickChangeDirection(type: 'right' | 'left' | 'inverse') {
    if (this.isAnimating) return;

    const tileElement = this.game.games.tileManager.getBoxTileById(this.externalTileSelected.tileId);
    const inner = tileElement.querySelector<HTMLElement>('.undertheleaves-tile-inner');

    this.isAnimating = true;

    if (type === 'right') this.externalTileSelected.rotation += 90;
    if (type === 'left') this.externalTileSelected.rotation -= 90;
    if (type === 'inverse') this.externalTileSelected.inverse = !this.externalTileSelected.inverse;

    tileElement.style.transform = `rotate(${this.externalTileSelected.rotation}deg)`;

    inner.style.transform = this.externalTileSelected.inverse ? 'rotateY(180deg)' : '';

    await delayTime(300);

    this.isAnimating = false;
  }

  public async moveTileSelected(tileSelectedId: string) {
    const playerId = this.game.bga.players.getCurrentPlayerId();
    const tileElement = this.game.games.tileManager.getTileById(tileSelectedId);
    const externalTileSelectedElement = this.game.games.tileManager
      .getGridBoxDiv(playerId)
      .querySelector<HTMLElement>(`[data-x="${this.externalTileSelected.x}"][data-y="${this.externalTileSelected.y}"]`);

    const animation = new BgaLocalAnimation(this.game);
    animation.setOptions(tileElement, externalTileSelectedElement, 500);

    await animation.call();
  }
}
