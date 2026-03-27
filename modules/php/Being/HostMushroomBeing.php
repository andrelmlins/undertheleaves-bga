<?php

declare(strict_types=1);

namespace Bga\Games\undertheleaves\Being;

use Bga\Games\undertheleaves\Entities\Being;
use Bga\Games\undertheleaves\Entities\CardType;
use Bga\Games\undertheleaves\Entities\DwellerBeing;
use Bga\Games\undertheleaves\Entities\Messages;
use Bga\Games\undertheleaves\Entities\TerrainType;
use Bga\Games\undertheleaves\Services\SectorService;

class HostMushroomBeing extends DwellerBeing
{
    public function process(int $playerId): void
    {
        $sectorService = new SectorService($this->game);
        $sectorService->buildGrid(
            $playerId,
            fn($t) => $t->type !== TerrainType::Puddle ? $t->type->value : false
        );
        $colorGroups = $sectorService->getAllTerrainGroups(1);

        if (empty($colorGroups)) {
            return;
        }

        $mushroomService = new SectorService($this->game);
        $mushroomService->buildGrid(
            $playerId,
            fn($t) => $t->mushroom ? 'mushroom' : false
        );
        $mushroomKeySet = array_flip($mushroomService->getTerrainKeys());

        $qualifiedSectors = [];
        foreach ($colorGroups as $sectors) {
            foreach ($sectors as $sectorCells) {
                $mushroomCount = count(array_filter(
                    $sectorCells,
                    fn($key) => isset($mushroomKeySet[$key])
                ));
                if ($mushroomCount >= 2) {
                    $qualifiedSectors[] = $sectorCells;
                }
            }
        }

        if (empty($qualifiedSectors)) {
            return;
        }

        $registeredHosts = $this->game->beingService->getBeingsBySector($playerId, 'mushroom', 'host');

        $newSectors = array_values(array_filter(
            $qualifiedSectors,
            fn($sectorCells) => !$this->hasExistingHost($registeredHosts, $sectorCells)
        ));

        if (empty($newSectors)) {
            return;
        }

        foreach ($newSectors as $sectorCells) {
            $cells = array_map(fn($key) => SectorService::cellKeyToCoordinates($key), $sectorCells);

            $this->game->beingService->addBeing(new Being(
                playerId: $playerId,
                type: 'mushroom',
                subtype: 'host',
                cells: $cells,
                count: 1,
            ));

            $this->game->statsService->incDweller(CardType::Mushroom, 1, $playerId);
        }

        $transformedSectors = array_map(function ($sectorCells) {
            $cells = array_map(fn($key) => SectorService::cellKeyToCoordinates($key), $sectorCells);
            usort($cells, fn($a, $b) => $a[1] !== $b[1] ? $b[1] - $a[1] : $a[0] - $b[0]);
            return ['cells' => $cells];
        }, $newSectors);

        $this->game->notify->all('arrivalHostMushroom', Messages::$ArrivalBeing, [
            'player_name' => $this->game->getPlayerNameById($playerId),
            'playerId' => $playerId,
            'count_beings' => count($newSectors),
            'sectors' => $transformedSectors,
            'being_icon' => 'mushroom',
        ]);
        $this->game->beingService->notifyBeingArrivalPause(count($newSectors));
    }

    private function hasExistingHost(array $registeredHosts, array $sectorCells): bool
    {
        foreach ($registeredHosts as $being) {
            $beingCellKeys = array_map(
                fn($coord) => SectorService::coordinatesToCellKey($coord),
                $being->cells
            );
            if ($this->isContained($beingCellKeys, $sectorCells)) {
                return true;
            }
        }
        return false;
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
