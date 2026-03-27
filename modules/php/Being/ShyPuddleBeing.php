<?php

declare(strict_types=1);

namespace Bga\Games\undertheleaves\Being;

use Bga\Games\undertheleaves\Entities\Being;
use Bga\Games\undertheleaves\Entities\CardType;
use Bga\Games\undertheleaves\Entities\DwellerBeing;
use Bga\Games\undertheleaves\Entities\Messages;
use Bga\Games\undertheleaves\Entities\TerrainType;
use Bga\Games\undertheleaves\Services\SectorService;

class ShyPuddleBeing extends DwellerBeing
{
    public function process(int $playerId): void
    {
        $puddleService = new SectorService($this->game);
        $puddleService->buildGrid($playerId, fn($t) => $t->type === TerrainType::Puddle ? 'puddle' : false);
        $puddleKeys = $puddleService->getTerrainKeys();

        if (empty($puddleKeys)) {
            return;
        }

        $allService = new SectorService($this->game);
        $allService->buildGrid($playerId, fn($t) => 'terrain');
        $allKeys = array_flip($allService->getTerrainKeys());

        $puddleKeySet = array_flip($puddleKeys);

        $surroundedCells = [];

        foreach ($puddleKeys as $cellKey) {
            $neighbors = SectorService::getAllNeighbors($cellKey);

            $surrounded = true;
            foreach ($neighbors as $neighbor) {
                if (!isset($allKeys[$neighbor]) || isset($puddleKeySet[$neighbor])) {
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

        $registeredShys = $this->game->beingService->getBeingsBySector($playerId, 'puddle', 'shy');
        $registeredKeys = [];
        foreach ($registeredShys as $being) {
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
                type: 'puddle',
                subtype: 'shy',
                cells: [$coords],
                count: 1,
            ));

            $this->game->statsService->incDweller(CardType::Puddle, 1, $playerId);
        }

        $transformedSectors = array_values(array_map(
            fn($cellKey) => ['cells' => [SectorService::cellKeyToCoordinates($cellKey)]],
            $newCells
        ));

        $this->game->notify->all('arrivalShyPuddle', Messages::$ArrivalBeing, [
            'player_name' => $this->game->getPlayerNameById($playerId),
            'playerId' => $playerId,
            'count_beings' => count($newCells),
            'sectors' => $transformedSectors,
            'being_icon' => 'puddle',
        ]);
        $this->game->beingService->notifyBeingArrivalPause(count($newCells));
    }
}
