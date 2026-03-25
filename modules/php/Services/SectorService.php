<?php

namespace Bga\Games\undertheleaves\Services;

use Bga\Games\undertheleaves\Entities\GridTile;
use Bga\Games\undertheleaves\Game;

class SectorService
{
    private array $terrainGrid = [];

    public function __construct(public Game $game) {}

    public function buildGrid(int $playerId, callable $terrainFilter, ?array $includeTiles = null, ?GridTile $excludeTile = null): self
    {
        $this->terrainGrid = [];

        if ($includeTiles === null) {
            $includeTiles = $this->game->tileService->listPlayerTiles($playerId);
        }

        $positions = [
            0 => [0, 0],
            1 => [1, 0],
            2 => [0, -1],
            3 => [1, -1],
        ];

        foreach ($includeTiles as $gridTile) {
            if ($excludeTile && $gridTile->x === $excludeTile->x && $gridTile->y === $excludeTile->y) {
                continue;
            }

            $tileConfig = $this->game->tileService->getTileConfigFromCard($gridTile->tile);
            if ($tileConfig === null) {
                continue;
            }

            $terrains = $tileConfig->getTerrains($gridTile->side === 1);
            $terrains = $this->rotateTerrains($terrains, $gridTile->rotation);

            foreach ($positions as $index => $coords) {
                $groupKey = $terrainFilter($terrains[$index]);
                if ($groupKey === false) {
                    continue;
                }

                $globalX = $gridTile->x * 2 + $coords[0];
                $globalY = $gridTile->y * 2 + $coords[1];
                $this->terrainGrid["{$globalX}_{$globalY}"] = $groupKey;
            }
        }

        return $this;
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

        foreach ($this->terrainGrid as $cellKey => $groupKey) {
            if (!isset($visited[$cellKey])) {
                $group = $this->dfs($cellKey, $groupKey, $visited);

                if (count($group) >= $minSize) {
                    if (!isset($groups[$groupKey])) {
                        $groups[$groupKey] = [];
                    }
                    $groups[$groupKey][] = $group;
                }
            }
        }

        return $groups;
    }

    private function dfs(string $startKey, string $color, array &$visited): array
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


    public function getTerrainKeys(): array
    {
        return array_keys($this->terrainGrid);
    }

    public static function cellKeyToCoordinates(string $cellKey): array
    {
        return array_map('intval', explode('_', $cellKey));
    }

    public static function coordinatesToCellKey(array $coordinates): string
    {
        return $coordinates[0] . '_' . $coordinates[1];
    }

    public static function getAllNeighbors(string $cellKey): array
    {
        [$x, $y] = array_map('intval', explode('_', $cellKey));
        $neighbors = [];

        foreach ([-1, 0, 1] as $dx) {
            foreach ([-1, 0, 1] as $dy) {
                if ($dx === 0 && $dy === 0) {
                    continue;
                }
                $neighbors[] = ($x + $dx) . '_' . ($y + $dy);
            }
        }

        return $neighbors;
    }
}
