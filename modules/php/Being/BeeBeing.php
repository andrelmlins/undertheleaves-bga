<?php

declare(strict_types=1);

namespace Bga\Games\undertheleaves\Being;

use Bga\Games\undertheleaves\Entities\Being;
use Bga\Games\undertheleaves\Entities\Messages;
use Bga\Games\undertheleaves\Entities\TerrainType;
use Bga\Games\undertheleaves\Services\SectorService;
use Bga\Games\undertheleaves\Game;

class BeeBeing
{
    public function __construct(public Game $game) {}

    public function process(int $playerId): void
    {
        $sectorService = new SectorService($this->game);
        $sectorService->buildGrid($playerId, fn($t) => $t->type !== TerrainType::Puddle ? $t->type->value : false);
        $allTerrainGroups = $sectorService->getAllTerrainGroups(3);

        if (empty($allTerrainGroups)) {
            return;
        }

        $registeredBees = $this->game->beingService->getBeingsBySector($playerId, 'bee');
        $colorsWithExistingBees = array_unique(array_map(fn($b) => $b->color, $registeredBees));

        $newSectors = [];

        foreach ($allTerrainGroups as $color => $sectors) {
            foreach ($sectors as $sectorCells) {
                $beingsInSector = $this->findBeingsContainedInSector($registeredBees, $color, $sectorCells);
                $sectorExistsUnchanged = $this->sectorMatchesExistingBeing($registeredBees, $color, $sectorCells);

                if ($sectorExistsUnchanged) {
                } else if (count($beingsInSector) > 1) {
                    $registeredBees = $this->processMergedSector($playerId, $beingsInSector, $sectorCells, $registeredBees);
                } else if (count($beingsInSector) === 1) {
                    $cells = array_map(fn($key) => SectorService::cellKeyToCoordinates($key), $sectorCells);
                    $this->game->beingService->updateBeingCells($beingsInSector[0]->copyWith(cells: $cells));
                } else {
                    $newSectors[] = ['color' => $color, 'cells' => $sectorCells];
                }
            }
        }

        if (empty($newSectors)) {
            return;
        }

        $colorsToIncrement = array_unique(array_filter(
            array_column($newSectors, 'color'),
            fn($color) => in_array($color, $colorsWithExistingBees)
        ));

        $existingSectorsForNotif = array_values(array_filter(
            $registeredBees,
            fn($being) => in_array($being->color, $colorsToIncrement)
        ));

        foreach ($newSectors as $newSector) {
            $cells = array_map(fn($key) => SectorService::cellKeyToCoordinates($key), $newSector['cells']);

            $this->game->beingService->addBeing(new Being(
                playerId: $playerId,
                type: 'bee',
                cells: $cells,
                count: 1,
                color: $newSector['color'],
            ));
            $this->game->statsService->incBee(1, $playerId, false);
        }

        foreach ($colorsToIncrement as $color) {
            $this->game->beingService->incrementBeesByColor($playerId, $color);
            $this->game->statsService->incBee(1, $playerId, true);
        }

        $transformedNew = array_map(function ($sector) {
            $cells = array_map(fn($key) => SectorService::cellKeyToCoordinates($key), $sector['cells']);
            usort($cells, fn($a, $b) => $a[1] !== $b[1] ? $b[1] - $a[1] : $a[0] - $b[0]);

            return ['color' => $sector['color'], 'cells' => $cells];
        }, $newSectors);

        $transformedExisting = array_map(fn($being) => [
            'color' => $being->color,
            'cells' => $being->cells,
        ], $existingSectorsForNotif);

        $countBeings = count($newSectors) + count($existingSectorsForNotif);

        $this->game->notify->all('arrivalBee', Messages::$ArrivalBeing, [
            'player_name' => $this->game->getPlayerNameById($playerId),
            'playerId' => $playerId,
            'count_beings' => $countBeings,
            'sectors' => array_merge($transformedNew, $transformedExisting),
            'being' => 'bee',
            'being_icon' => 'bee',
        ]);
        $this->game->beingService->notifyBeingArrivalPause($countBeings);
    }

    private function findBeingsContainedInSector(array $registeredBees, string $color, array $sectorCells): array
    {
        return array_values(array_filter($registeredBees, function ($being) use ($color, $sectorCells) {
            if ($being->color !== $color) return false;
            $beingCellKeys = array_map(fn($coord) => SectorService::coordinatesToCellKey($coord), $being->cells);
            return $this->isContained($beingCellKeys, $sectorCells);
        }));
    }

    private function sectorMatchesExistingBeing(array $registeredBees, string $color, array $sectorCells): bool
    {
        foreach ($registeredBees as $being) {
            if ($being->color !== $color) continue;

            $beingCellKeys = array_map(fn($coord) => SectorService::coordinatesToCellKey($coord), $being->cells);

            if ($this->game->beingService->areSectorsSame($beingCellKeys, $sectorCells)) return true;
        }
        return false;
    }

    private function processMergedSector(int $playerId, array $beingsInSector, array $sectorCells, array $registeredBees): array
    {
        $cells = array_map(fn($key) => SectorService::cellKeyToCoordinates($key), $sectorCells);
        $primaryBeing = $beingsInSector[0];
        $beingsToMerge = array_slice($beingsInSector, 1);

        $mergedBeing = $this->game->beingService->mergeBeing(
            $primaryBeing->copyWith(cells: $cells),
            $beingsToMerge
        );

        $mergedIds = array_map(fn($b) => $b->id, $beingsToMerge);
        $updatedBeings = array_values(array_filter($registeredBees, fn($b) => !in_array($b->id, $mergedIds)));
        $updatedBeings = array_map(fn($b) => $b->id === $primaryBeing->id ? $mergedBeing : $b, $updatedBeings);

        $this->game->notify->all('mergeBee', '', [
            'playerId' => $playerId,
            'mergedBeing' => ['cells' => $mergedBeing->cells, 'count' => $mergedBeing->count, 'color' => $mergedBeing->color],
            'oldBeings' => array_map(fn($b) => ['cells' => $b->cells], $beingsInSector),
        ]);
        $this->game->notify->all('simplePause', '', ['time' => 500]);

        return $updatedBeings;
    }

    private function isContained(array $subset, array $superset): bool
    {
        foreach ($subset as $cell) {
            if (!in_array($cell, $superset)) {
                return false;
            }
        }

        return true;
    }
}
