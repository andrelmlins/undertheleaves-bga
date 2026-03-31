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

        $baseTargets = [];
        $bonusTargets = [];
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

            $baseTargets[$key] = $allPollinized ? 1 : 0;
            $bonusTargets[$key] = 0;
        }

        foreach ($tilePositions as $key => [$tx, $ty]) {
            if ($baseTargets[$key] !== 1) {
                continue;
            }

            $leftKey = ($tx - 1) . "_{$ty}";
            $rightKey = ($tx + 1) . "_{$ty}";
            if (
                isset($baseTargets[$leftKey]) && $baseTargets[$leftKey] === 1 &&
                isset($baseTargets[$rightKey]) && $baseTargets[$rightKey] === 1
            ) {
                $bonusTargets[$key]++;
            }

            $downKey = "{$tx}_" . ($ty - 1);
            $upKey = "{$tx}_" . ($ty + 1);
            if (
                isset($baseTargets[$downKey]) && $baseTargets[$downKey] === 1 &&
                isset($baseTargets[$upKey]) && $baseTargets[$upKey] === 1
            ) {
                $bonusTargets[$key]++;
            }
        }

        $existingHummingbirds = $this->game->beingService->getBeingsByType($playerId, 'hummingbird');
        $existingByTile = [];

        foreach ($existingHummingbirds as $being) {
            $key = "{$being->x}_{$being->y}";
            $existingByTile[$key] = $being->count;
        }

        $baseHummingbirds = [];
        $bonusHummingbirds = [];
        $addedByTile = [];

        foreach ($baseTargets as $key => $baseCount) {
            if ($baseCount === 0) {
                continue;
            }

            $existingCount = $existingByTile[$key] ?? 0;
            $delta = max(0, $baseCount - $existingCount);
            if ($delta > 0) {
                [$tx, $ty] = $tilePositions[$key];
                $this->game->beingService->upsertHummingbird($playerId, $tx, $ty, $delta);
                $baseHummingbirds[] = ['x' => $tx, 'y' => $ty, 'delta' => $delta];
                $addedByTile[$key] = $delta;
                $this->game->statsService->incHummingbird($delta, $playerId);
            }
        }

        foreach ($bonusTargets as $key => $bonusCount) {
            if ($bonusCount === 0) {
                continue;
            }

            $existingCount = $existingByTile[$key] ?? 0;
            $alreadyAdded = $addedByTile[$key] ?? 0;
            $totalExisting = $existingCount + $alreadyAdded;
            $totalTarget = ($baseTargets[$key] ?? 0) + $bonusCount;
            $delta = max(0, $totalTarget - $totalExisting);
            if ($delta > 0) {
                [$tx, $ty] = $tilePositions[$key];
                $this->game->beingService->upsertHummingbird($playerId, $tx, $ty, $delta);
                $bonusHummingbirds[] = ['x' => $tx, 'y' => $ty, 'delta' => $delta];
                $this->game->statsService->incHummingbird($delta, $playerId);
            }
        }

        $newHummingbirds = array_merge($baseHummingbirds, $bonusHummingbirds);

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
        $this->game->beingService->notifyBeingArrivalPause($totalCount);
    }
}
