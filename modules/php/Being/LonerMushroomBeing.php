<?php

declare(strict_types=1);

namespace Bga\Games\undertheleaves\Being;

use Bga\Games\undertheleaves\Entities\Being;
use Bga\Games\undertheleaves\Entities\CardType;
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

            $this->game->statsService->incDweller(CardType::Mushroom, 1, $playerId);
        }

        $playerName = $this->game->getPlayerNameById($playerId);

        foreach ($newCells as $cellKey) {
            $this->game->notify->all('arrivalLonerMushroom', Messages::$ArrivalLonerMushroom, [
                'player_name'  => $playerName,
                'playerId'     => $playerId,
                'count_beings' => 1,
                'sectors'      => [['cells' => [SectorService::cellKeyToCoordinates($cellKey)]]],
                'being'        => 'mushroom',
                'being_icon'   => 'mushroom',
            ]);
            $this->game->notify->all('simplePause', '', ['time' => 600]);
        }
    }
}
