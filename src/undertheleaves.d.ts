interface UndertheLeavesGamedatas extends Gamedatas {
  tableTiles: Record<string, Tile>;
  initialTileConfigs: TileConfig[];
  tileConfigs: TileConfig[];
  gridTiles: Record<string, GridTile[]>;
  cards: { leaf: CardConfig; mushroom: CardConfig; puddle: CardConfig };
}

interface UndertheLeavesGames {
  tileManager: TileManager;
  cardManager: CardManager;
  playerManager: PlayerManager;
  placeTile: PlaceTile;
}

interface Tile {
  id: string;
  type: string;
  type_arg: string;
  location_arg: string;
}

interface Position {
  row: number;
  column: number;
}

interface Terrain {
  type: string;
  mushroom: boolean;
}

interface TileConfig {
  position: Position;
  terrains: Terrain[];
}

interface GridTile {
  x: number;
  y: number;
  playerId: number;
  rotation: number;
  side: number;
  tile: Tile;
}

interface CardConfig {
  position: Position;
  type: string;
  name: string;
  description: string;
  firstGame: boolean;
}

interface PlaceTileState {
  tableTiles: GridTile[];
}

interface RevealTileNotif {
  tile: Tile;
}

interface PlaceTileNotif {
  gridTile: GridTile;
  playerId: number;
}
