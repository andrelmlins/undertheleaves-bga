class TileManager implements Game {
  private handlers: any[];
  public tileSelected: string;

  gridMap: Record<string, ScrollmapWithZoomNS.ScrollmapWithZoom>;

  constructor(public game: UndertheLeavesGame) {
    this.gridMap = {};
    this.handlers = [];
  }

  public setup() {
    const offerBox = document.getElementById('undertheleaves-offer');
    const box = document.getElementById('undertheleaves-box');

    for (const tileId in this.game.gamedatas.tableTiles) {
      const tile = this.game.gamedatas.tableTiles[tileId];

      offerBox.insertAdjacentHTML('beforeend', this.formatTile(tile));
    }

    this.game.gamedatas.playerorder.forEach((playerId) => {
      const player = this.game.gamedatas.players[playerId];

      box.insertAdjacentHTML(
        'beforeend',
        `
          <div id="undertheleaves-player-${playerId}" class="undertheleaves-player">
            <span style="--color: #${player.color}">${player.name}</span>
            <div id="undertheleaves-player-map-container-${playerId}">
              <div id="undertheleaves-player-map-scrollable-${playerId}"></div>
              <div id="undertheleaves-player-map-surface-${playerId}"></div>
              <div id="undertheleaves-player-map-scrollable-oversurface-${playerId}"></div>
            </div>
          </div>
        `,
      );

      this.gridMap[playerId] = new ebg.scrollmapWithZoom();
      this.gridMap[playerId].bAdaptHeightAuto = true;
      this.gridMap[playerId].bEnableLongPress = false;

      this.gridMap[playerId].create(
        $(`undertheleaves-player-map-container-${playerId}`),
        $(`undertheleaves-player-map-scrollable-${playerId}`),
        $(`undertheleaves-player-map-surface-${playerId}`),
        $(`undertheleaves-player-map-scrollable-oversurface-${playerId}`),
      );

      this.gridMap[playerId].onsurface_div.insertAdjacentHTML(
        'beforeend',
        `<div id="undertheleaves-player-grid-${playerId}" class="undertheleaves-player-grid"></div>`,
      );

      this.createGridTiles(this.game.gamedatas.gridTiles[playerId], Number(playerId));
    });
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

  public formatTile(tile: Tile, notif: boolean = false) {
    const tileConfig = this.getTileConfig(tile);

    return `
      <div ${!notif ? `id="undertheleaves-tile-${tile.id}"` : ''} class="undertheleaves-tile ${notif ? 'notif' : ''}" line="${tileConfig.position.row}" column="${tileConfig.position.column}">
        <div class="undertheleaves-tile-box">  
          <div class="undertheleaves-tile-inner">
            <div class="undertheleaves-tile-front"></div>
            <div class="undertheleaves-tile-back"></div>
          </div>
        </div>
      </div>
    `;
  }

  public formatGridTile(gridTile: GridTile) {
    const tileConfig = this.getTileConfig(gridTile.tile);

    return `
      <div id="undertheleaves-tile-${gridTile.tile.id}" class="undertheleaves-tile" line="${tileConfig.position.row}" column="${tileConfig.position.column}">
        <div class="undertheleaves-tile-box" style="transform: rotate(${gridTile.rotation}deg)">
          <div class="undertheleaves-tile-inner" style="${gridTile.side == 1 ? 'transform: rotateY(180deg)' : ''}">
            <div class="undertheleaves-tile-front"></div>
            <div class="undertheleaves-tile-back"></div>
          </div>
        </div>
      </div>
    `;
  }

  public getTileConfig(tile: Tile) {
    const [row, column] = tile.type_arg.split('_').map((item) => Number(item));

    if (tile.type === 'initial') {
      return this.game.gamedatas.initialTileConfigs.find(
        (tile) => tile.position.row === row && tile.position.column === column,
      );
    }

    return this.game.gamedatas.tileConfigs.find((tile) => tile.position.row === row && tile.position.column === column);
  }

  public getGridBoxDiv(playerId: number) {
    return document.getElementById(`undertheleaves-player-grid-${playerId}`);
  }

  public createGridTiles(tiles: GridTile[], playerId: number) {
    const playerGridBox = this.getGridBoxDiv(Number(playerId));

    playerGridBox.innerHTML = '';

    tiles.forEach((gridTile) => {
      playerGridBox.insertAdjacentHTML(
        'beforeend',
        `<div class="undertheleaves-player-cell" data-x=${gridTile.x} data-y=${gridTile.y}></div>`,
      );

      playerGridBox
        .querySelector('[data-x="' + gridTile.x + '"][data-y="' + gridTile.y + '"]')
        .insertAdjacentHTML('beforeend', this.formatGridTile(gridTile));
    });

    this.recalculateGrid(playerId);
  }

  public recalculateGrid(playerId: number) {
    const playerGridBox = this.getGridBoxDiv(Number(playerId));

    (Array.from(playerGridBox.children) as HTMLElement[]).forEach((cell) => {
      if (!cell.classList.contains('selectable') && cell.childNodes.length === 0) {
        cell.remove();
      }
    });

    const cells = (Array.from(playerGridBox.children) as HTMLElement[]).filter(
      (cell) => cell.classList.contains('selectable') || cell.childNodes.length > 0,
    );

    const coords = cells.map((el) => ({
      x: Number(el.dataset.x),
      y: Number(el.dataset.y),
    }));

    const xs = coords.map((c) => c.x);
    const ys = coords.map((c) => c.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const width = maxX - minX + 1;
    const height = maxY - minY + 1;

    for (let y = maxY; y >= minY; y--) {
      for (let x = minX; x <= maxX; x++) {
        if (!playerGridBox.querySelector(`[data-x="${x}"][data-y="${y}"]`)) {
          playerGridBox.insertAdjacentHTML(
            'beforeend',
            `<div class="undertheleaves-player-cell" data-x="${x}" data-y="${y}"></div>`,
          );
        }
      }
    }

    playerGridBox.style.gridTemplateColumns = `repeat(${width}, ${TILE_SIZE}px)`;
    playerGridBox.style.gridTemplateRows = `repeat(${height}, ${TILE_SIZE}px)`;

    const newCells = Array.from(playerGridBox.children) as HTMLElement[];

    newCells.sort((a, b) => {
      const ay = Number(a.dataset.y);
      const by = Number(b.dataset.y);
      const ax = Number(a.dataset.x);
      const bx = Number(b.dataset.x);

      if (ay !== by) return by - ay;
      return ax - bx;
    });

    const frag = document.createDocumentFragment();
    newCells.forEach((el) => frag.appendChild(el));
    playerGridBox.appendChild(frag);
  }

  public showOfferCardSelectable(onChanged: (tileId?: string) => void) {
    const tiles = document.getElementById('undertheleaves-offer').querySelectorAll<HTMLElement>('.undertheleaves-tile');

    tiles.forEach((element) => {
      const id = element.id.split('-')[2];
      element.classList.add('selectable');

      this.handlers.push(
        dojo.connect(element, 'onclick', () => {
          if (this.tileSelected) {
            document.getElementById(`undertheleaves-tile-${this.tileSelected}`).classList.remove('selected');
          }

          if (this.tileSelected == id) {
            element.classList.remove('selected');
            this.tileSelected = null;
          } else {
            element.classList.add('selected');
            this.tileSelected = id;
          }

          onChanged(this.tileSelected);
        }),
      );
    });
  }

  public removeOfferCardSelectable() {
    const tiles = document.getElementById('undertheleaves-offer').querySelectorAll('.undertheleaves-tile');

    tiles.forEach((element) => {
      element.classList.remove('selectable');
      element.classList.remove('selected');
      this.handlers.forEach((handler) => dojo.disconnect(handler));
      this.handlers = [];
    });

    this.tileSelected = null;
  }

  public getTileById(id: string | number) {
    return document.getElementById(`undertheleaves-tile-${id}`);
  }

  public getBoxTileById(id: string | number) {
    return this.getTileById(id).querySelector<HTMLElement>('.undertheleaves-tile-box');
  }
}
