interface UndertheLeavesGamedatas extends Gamedatas {
  tableTiles: Record<string, Tile>;
  initialTileConfigs: TileConfig[];
  tileConfigs: TileConfig[];
  gridTiles: Record<string, GridTile[]>;
  cards: { leaf: CardConfig; mushroom: CardConfig; puddle: CardConfig };
  beings: Record<string, Being[]>;
}

interface BeingPosition {
  localX: number;
  localY: number;
  x: number;
  y: number;
}

interface UndertheLeavesGames {
  tileManager: TileManager;
  cardManager: CardManager;
  playerManager: PlayerManager;
  beingsManager: BeingsManager;
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

interface Being {
  playerId: number;
  type: 'bee' | 'hummingbird' | 'leaf_dweller' | 'puddle_dweller' | 'mushroom_dweller';
  color?: string;
  cells: number[][];
  count: number;
  x?: number;
  y?: number;
}

interface BeingsAddedNotif {
  playerId: number;
  player_name: string;
  being_type: string;
  newSectors: number;
}

interface ArrivalBeeNotif {
  playerId: number;
  sectors: { cells: number[][] }[];
}

interface MergeBeeNotif {
  playerId: number;
  mergedBeing: { cells: number[][]; count: number; color: string };
  oldBeings: { cells: number[][] }[];
}
