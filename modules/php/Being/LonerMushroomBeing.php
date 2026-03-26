<?php

declare(strict_types=1);

namespace Bga\Games\undertheleaves\Being;

use Bga\Games\undertheleaves\Entities\Being;
use Bga\Games\undertheleaves\Entities\DwellerBeing;
use Bga\Games\undertheleaves\Entities\Messages;
use Bga\Games\undertheleaves\Services\SectorService;

class LonerMushroomBeing extends DwellerBeing
{
    public function process(int $playerId): void
    {
        $mushroomService = new SectorService($this->game);
        $mushroomService->buildGrid($playerId, fn($t) => $t->mushroom ? 'mushroom' : false);
        $mushroomKeys = $mushroomService->getTerrainKeys();

        if (empty($mushroomKeys)) {
            return;
        }

        $allService = new SectorService($this->game);
        $allService->buildGrid($playerId, fn($t) => 'terrain');
        $allKeys = array_flip($allService->getTerrainKeys());

        $mushroomKeySet = array_flip($mushroomKeys);

        $surroundedCells = [];

        foreach ($mushroomKeys as $cellKey) {
            $neighbors = SectorService::getAllNeighbors($cellKey);

            $surrounded = true;
            foreach ($neighbors as $neighbor) {
                if (!isset($allKeys[$neighbor]) || isset($mushroomKeySet[$neighbor])) {
                    $surrounded = false;
                    break;
                }
            }

            if ($surrounded) {
                $surroundedCells[] = $cellKey;
            }
        }

        if (empty($surroundedCells)) {
            return;
        }

        $registeredLoners = $this->game->beingService->getBeingsBySector($playerId, 'mushroom', 'loner');
        $registeredKeys = [];
        foreach ($registeredLoners as $being) {
            foreach ($being->cells as $coord) {
                $registeredKeys[] = SectorService::coordinatesToCellKey($coord);
            }
        }

        $newCells = array_filter($surroundedCells, fn($key) => !in_array($key, $registeredKeys));

        if (empty($newCells)) {
            return;
        }

        foreach ($newCells as $cellKey) {
            $coords = SectorService::cellKeyToCoordinates($cellKey);
            $this->game->beingService->addBeing(new Being(
                playerId: $playerId,
                type: 'mushroom',
                subtype: 'loner',
                cells: [$coords],
                count: 1,
            ));
        }

        $transformedSectors = array_values(array_map(
            fn($cellKey) => ['cells' => [SectorService::cellKeyToCoordinates($cellKey)]],
            $newCells
        ));

        $this->game->notify->all('arrivalLonerMushroom', Messages::$ArrivalBeing, [
            'player_name' => $this->game->getPlayerNameById($playerId),
            'playerId' => $playerId,
            'count_beings' => count($newCells),
            'sectors' => $transformedSectors,
            'being_icon' => 'mushroom',
        ]);
        $this->game->beingService->notifyBeingArrivalPause(count($newCells));
    }
}
