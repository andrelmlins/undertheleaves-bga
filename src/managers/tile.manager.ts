class TileManager implements Game {
  gridMap: Record<string, ScrollmapWithZoomNS.ScrollmapWithZoom>;

  constructor(public game: UndertheLeavesGame) {
    this.gridMap = {};
  }

  public setup() {
    const tableBbox = document.getElementById('undertheleaves-table');
    const box = document.getElementById('undertheleaves-box');

    for (const tileId in this.game.gamedatas.tableTiles) {
      const tile = this.game.gamedatas.tableTiles[tileId];

      tableBbox.insertAdjacentHTML('beforeend', this.formatTile(tile));
    }

    for (const playerId in this.game.gamedatas.players) {
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
      this.gridMap[playerId].hideInfoButton();

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

      const playerGridBox = this.getGridBoxDiv(Number(playerId));
      const xs = this.game.gamedatas.gridTiles[playerId].map((i) => i.x);
      const ys = this.game.gamedatas.gridTiles[playerId].map((i) => i.y);

      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);

      const width = maxX - minX + 1;
      const height = maxY - minY + 1;

      for (let y = maxY; y >= minY; y--) {
        for (let x = minX; x <= maxX; x++) {
          document
            .getElementById(`undertheleaves-player-grid-${playerId}`)
            .insertAdjacentHTML(
              'beforeend',
              `<div class="undertheleaves-player-cell" --data-x=${x} --data-y=${y}></div>`,
            );
        }
      }

      playerGridBox.style.gridTemplateColumns = `repeat(${width}, 80px)`;
      playerGridBox.style.gridTemplateRows = `repeat(${height}, 80px)`;

      this.game.gamedatas.gridTiles[playerId].forEach((gridTile) => {
        playerGridBox
          .querySelector('.undertheleaves-player-cell[--data-x="' + gridTile.x + '"][--data-y="' + gridTile.y + '"]')
          .insertAdjacentHTML('beforeend', this.formatTile(gridTile.tile));
      });
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

  public formatTile(tile: Tile) {
    const tileConfig = this.getTileConfig(tile);

    return `
      <div class="undertheleaves-tile" line="${tileConfig.position.row}" column="${tileConfig.position.column}">
        <div class="undertheleaves-tile-inner">
          <div class="undertheleaves-tile-front"></div>
          <div class="undertheleaves-tile-back"></div>
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
}
