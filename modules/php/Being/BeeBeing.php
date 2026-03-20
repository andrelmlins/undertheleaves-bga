<?php

declare(strict_types=1);

namespace Bga\Games\undertheleaves\Being;

use Bga\Games\undertheleaves\Entities\GridTile;
use Bga\Games\undertheleaves\Entities\Messages;
use Bga\Games\undertheleaves\Services\SectorService;
use Bga\Games\undertheleaves\Game;

class BeeBeing
{
    public function __construct(public Game $game) {}

    public function process(int $playerId, GridTile $newGridTile): void
    {
        $allTiles = $this->game->tileService->listPlayerTiles($playerId);

        $sectorService = new SectorService($this->game);

        $sectorService->buildTerrainGrid($playerId);
        $allSectors = $sectorService->getAllTerrainGroups(3);

        if (empty($allSectors)) {
            return;
        }

        $tilesWithoutNew = array_filter(
            $allTiles,
            fn($t) => !($t->x === $newGridTile->x && $t->y === $newGridTile->y && $t->side === $newGridTile->side && $t->rotation === $newGridTile->rotation)
        );

        $sectorServiceBefore = new SectorService($this->game);
        $sectorServiceBefore->buildTerrainGrid($playerId, includeTiles: array_values($tilesWithoutNew));
        $beforeSectors = $sectorServiceBefore->getAllTerrainGroups(3);

        $newlySectors = $sectorService->findNewlySectors($beforeSectors, $allSectors);

        $this->updateGrowthSectors($playerId, $beforeSectors, $allSectors);

        if (empty($newlySectors)) {
            return;
        }

        foreach ($newlySectors as $newSector) {
            $color = $newSector['color'];
            $cells = $newSector['cells'];

            $this->game->beingService->addBeing($playerId, 'bee', $cells, $color, 1);

            if (isset($allSectors[$color])) {
                foreach ($allSectors[$color] as $existingSector) {
                    if ($this->game->beingService->areSectorsSame($existingSector, $cells)) {
                        continue;
                    }

                    if (!$this->game->beingService->beingExists($playerId, 'bee', $existingSector, $color)) {
                        $this->game->beingService->addBeing($playerId, 'bee', $existingSector, $color, 1);
                    }
                }
            }
        }

        $this->game->notify->all('arrivalBee', Messages::$ArrivalBeing, [
            'player_name' => $this->game->getPlayerNameById($playerId),
            'playerId' => $playerId,
            'count_beings' => count($newlySectors),
            'sectors' => $newlySectors,
            'being_icon' => 'bee',
        ]);
    }

    private function updateGrowthSectors(int $playerId, array $beforeSectors, array $allSectors): void
    {
        foreach ($allSectors as $color => $currentSectors) {
            if (!isset($beforeSectors[$color])) {
                continue;
            }

            foreach ($currentSectors as $currentSector) {
                foreach ($beforeSectors[$color] as $beforeSector) {
                    if ($this->game->beingService->areSectorsSame($currentSector, $beforeSector)) {
                        continue 2;
                    }

                    if ($this->isSectorGrowth($beforeSector, $currentSector)) {
                        $this->game->beingService->updateBeingCells($playerId, 'bee', $beforeSector, $currentSector, $color);
                        continue 2;
                    }
                }
            }
        }
    }

    private function isSectorGrowth(array $beforeSector, array $currentSector): bool
    {
        if (count($currentSector) <= count($beforeSector)) {
            return false;
        }

        $beforeSorted = $beforeSector;
        sort($beforeSorted);

        $currentSorted = $currentSector;
        sort($currentSorted);

        foreach ($beforeSorted as $cell) {
            if (!in_array($cell, $currentSorted)) {
                return false;
            }
        }

        return true;
    }
}
