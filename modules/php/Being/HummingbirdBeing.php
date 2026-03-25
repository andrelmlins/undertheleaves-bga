<?php

declare(strict_types=1);

namespace Bga\Games\undertheleaves\Being;

use Bga\Games\undertheleaves\Entities\Messages;
use Bga\Games\undertheleaves\Entities\TerrainType;
use Bga\Games\undertheleaves\Services\SectorService;
use Bga\Games\undertheleaves\Game;

class HummingbirdBeing
{
    public function __construct(public Game $game) {}

    public function process(int $playerId): void
    {
        $sectorService = new SectorService($this->game);
        $sectorService->buildGrid($playerId, fn($t) => $t->type !== TerrainType::Puddle ? $t->type->value : false);

        $allTerrainGroups = $sectorService->getAllTerrainGroups(3);

        $pollinizedCells = [];
        foreach ($allTerrainGroups as $sectors) {
            foreach ($sectors as $sectorCells) {
                foreach ($sectorCells as $cellKey) {
                    $pollinizedCells[$cellKey] = true;
                }
            }
        }

        $terrainKeys = array_flip($sectorService->getTerrainKeys());

        $tiles = $this->game->tileService->listPlayerTiles($playerId);

        $tileTargets = [];
        $tilePositions = [];

        foreach ($tiles as $gridTile) {
            $tx = $gridTile->x;
            $ty = $gridTile->y;
            $key = "{$tx}_{$ty}";

            $tilePositions[$key] = [$tx, $ty];

            $localPositions = [[0, 0], [1, 0], [0, -1], [1, -1]];
            $allPollinized = true;

            foreach ($localPositions as [$lx, $ly]) {
                $globalKey = ($tx * 2 + $lx) . '_' . ($ty * 2 + $ly);
                if (isset($terrainKeys[$globalKey]) && !isset($pollinizedCells[$globalKey])) {
                    $allPollinized = false;
                    break;
                }
            }

            $tileTargets[$key] = $allPollinized ? 1 : 0;
        }

        foreach ($tilePositions as $key => [$tx, $ty]) {
            if ($tileTargets[$key] !== 1) {
                continue;
            }

            $leftKey = ($tx - 1) . "_{$ty}";
            $rightKey = ($tx + 1) . "_{$ty}";
            if (
                isset($tileTargets[$leftKey]) && $tileTargets[$leftKey] === 1 &&
                isset($tileTargets[$rightKey]) && $tileTargets[$rightKey] === 1
            ) {
                $tileTargets[$key]++;
            }

            $downKey = "{$tx}_" . ($ty - 1);
            $upKey = "{$tx}_" . ($ty + 1);
            if (
                isset($tileTargets[$downKey]) && $tileTargets[$downKey] === 1 &&
                isset($tileTargets[$upKey]) && $tileTargets[$upKey] === 1
            ) {
                $tileTargets[$key]++;
            }
        }

        $existingHummingbirds = $this->game->beingService->getBeingsByType($playerId, 'hummingbird');
        $existingByTile = [];

        foreach ($existingHummingbirds as $being) {
            $key = "{$being->x}_{$being->y}";
            $existingByTile[$key] = $being->count;
        }

        $newHummingbirds = [];

        foreach ($tileTargets as $key => $targetCount) {
            if ($targetCount === 0) {
                continue;
            }

            $existingCount = $existingByTile[$key] ?? 0;
            if ($targetCount > $existingCount) {
                [$tx, $ty] = $tilePositions[$key];
                $delta = $targetCount - $existingCount;
                $this->game->beingService->upsertHummingbird($playerId, $tx, $ty, $delta);
                $newHummingbirds[] = ['x' => $tx, 'y' => $ty, 'delta' => $delta];
            }
        }

        if (empty($newHummingbirds)) {
            return;
        }

        $totalCount = array_sum(array_column($newHummingbirds, 'delta'));

        $this->game->notify->all('arrivalHummingbird', Messages::$ArrivalBeing, [
            'player_name' => $this->game->getPlayerNameById($playerId),
            'playerId' => $playerId,
            'count_beings' => $totalCount,
            'tiles' => $newHummingbirds,
            'being_icon' => 'hummingbird',
        ]);
        $this->game->notify->all('simplePause', '', ['time' => 1000]);
    }
}
