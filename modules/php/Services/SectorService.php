<?php

namespace Bga\Games\undertheleaves\Services;

use Bga\Games\undertheleaves\Entities\GridTile;
use Bga\Games\undertheleaves\Entities\TerrainType;
use Bga\Games\undertheleaves\Game;

class SectorService
{
    private array $terrainGrid = [];

    public function __construct(public Game $game) {}

    public function buildTerrainGrid(int $playerId, ?array $includeTiles = null, ?GridTile $excludeTile = null): self
    {
        $this->terrainGrid = [];

        if ($includeTiles === null) {
            $includeTiles = $this->game->tileService->listPlayerTiles($playerId);
        }

        foreach ($includeTiles as $gridTile) {
            if ($excludeTile && $gridTile->x === $excludeTile->x && $gridTile->y === $excludeTile->y) {
                continue;
            }

            $this->addTileToGrid($gridTile);
        }

        return $this;
    }

    private function addTileToGrid(GridTile $gridTile): void
    {
        $tileConfig = $this->game->tileService->getTileConfigFromCard($gridTile->tile);
        if ($tileConfig === null) {
            return;
        }
        $terrains = $tileConfig->getTerrains($gridTile->side === 1);

        $terrains = $this->rotateTerrains($terrains, $gridTile->rotation);

        $positions = [
            0 => [0, 0],
            1 => [1, 0],
            2 => [0, -1],
            3 => [1, -1],
        ];

        foreach ($positions as $index => $coords) {
            list($x, $y) = $coords;
            $terrain = $terrains[$index];

            if ($terrain->type === TerrainType::Puddle) {
                continue;
            }

            $globalX = $gridTile->x * 2 + $x;
            $globalY = $gridTile->y * 2 + $y;
            $key = "{$globalX}_{$globalY}";

            $this->terrainGrid[$key] = $terrain->type;
        }
    }

    private function rotateTerrains(array $terrains, int $rotation): array
    {
        $rotationMappings = [
            0   => [0, 1, 2, 3],
            90  => [2, 0, 3, 1],
            180 => [3, 2, 1, 0],
            270 => [1, 3, 0, 2],
        ];

        $mapping = $rotationMappings[$rotation];
        return [$terrains[$mapping[0]], $terrains[$mapping[1]], $terrains[$mapping[2]], $terrains[$mapping[3]]];
    }

    public function getAllTerrainGroups(int $minSize = 2): array
    {
        $groups = [];
        $visited = [];

        foreach ($this->terrainGrid as $cellKey => $terrainType) {
            if (!isset($visited[$cellKey])) {
                $group = $this->dfs($cellKey, $terrainType, $visited);

                if (count($group) >= $minSize) {
                    $colorKey = $terrainType->value;
                    if (!isset($groups[$colorKey])) {
                        $groups[$colorKey] = [];
                    }
                    $groups[$colorKey][] = $group;
                }
            }
        }

        return $groups;
    }

    private function dfs(string $startKey, TerrainType $color, array &$visited): array
    {
        $stack = [$startKey];
        $sector = [];
        $explored = [];

        while (!empty($stack)) {
            $currentKey = array_pop($stack);

            if (isset($explored[$currentKey])) {
                continue;
            }

            $explored[$currentKey] = true;
            $visited[$currentKey] = true;
            $sector[] = $currentKey;

            $neighbors = $this->getOrthogonalNeighbors($currentKey);

            foreach ($neighbors as $neighborKey) {
                if (
                    !isset($visited[$neighborKey]) &&
                    isset($this->terrainGrid[$neighborKey]) &&
                    $this->terrainGrid[$neighborKey] === $color
                ) {
                    $stack[] = $neighborKey;
                }
            }
        }

        return $sector;
    }

    private function getOrthogonalNeighbors(string $cellKey): array
    {
        $coords = array_map('intval', explode('_', $cellKey));
        $x = $coords[0];
        $y = $coords[1];

        return [
            ($x - 1) . "_{$y}",
            ($x + 1) . "_{$y}",
            "{$x}_" . ($y - 1),
            "{$x}_" . ($y + 1)
        ];
    }

    public function findNewlySectors(array $beforeSectors, array $afterSectors): array
    {
        $newlySectors = [];

        foreach ($afterSectors as $color => $sectors) {
            foreach ($sectors as $afterSector) {
                $isNew = true;

                if (isset($beforeSectors[$color])) {
                    foreach ($beforeSectors[$color] as $beforeSector) {
                        if ($this->game->beingService->areSectorsSame($beforeSector, $afterSector)) {
                            $isNew = false;
                            break;
                        }
                    }
                }

                if ($isNew) {
                    $newlySectors[] = [
                        'color' => $color,
                        'cells' => $afterSector
                    ];
                }
            }
        }

        return $newlySectors;
    }

    public static function cellKeyToCoordinates(string $cellKey): array
    {
        return array_map('intval', explode('_', $cellKey));
    }
}
