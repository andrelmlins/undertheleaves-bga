<?php

declare(strict_types=1);

namespace Bga\Games\undertheleaves\Being;

use Bga\Games\undertheleaves\Entities\Being;
use Bga\Games\undertheleaves\Entities\CardType;
use Bga\Games\undertheleaves\Entities\DwellerBeing;
use Bga\Games\undertheleaves\Entities\Messages;
use Bga\Games\undertheleaves\Entities\TerrainType;
use Bga\Games\undertheleaves\Services\SectorService;

class SkipperPuddleBeing extends DwellerBeing
{
    public function process(int $playerId): void
    {
        $puddleService = new SectorService($this->game);
        $puddleService->buildGrid($playerId, fn($t) => $t->type === TerrainType::Puddle ? 'puddle' : false);
        $puddleKeys = array_flip($puddleService->getTerrainKeys());

        $allService = new SectorService($this->game);
        $allService->buildGrid($playerId, fn($t) => 'terrain');
        $allKeys = $allService->getTerrainKeys();

        $axes = [[1, 0], [0, 1]];
        $middleCells = [];

        foreach ($allKeys as $cellKey) {
            if (isset($puddleKeys[$cellKey])) {
                continue;
            }

            $coords = SectorService::cellKeyToCoordinates($cellKey);

            foreach ($axes as [$dx, $dy]) {
                $neighbor1 = ($coords[0] + $dx) . '_' . ($coords[1] + $dy);
                $neighbor2 = ($coords[0] - $dx) . '_' . ($coords[1] - $dy);

                if (isset($puddleKeys[$neighbor1]) && isset($puddleKeys[$neighbor2])) {
                    $middleCells[] = $cellKey;
                    break;
                }
            }
        }

        if (empty($middleCells)) {
            return;
        }

        $registeredSkippers = $this->game->beingService->getBeingsBySector($playerId, 'puddle', 'skipper');
        $registeredKeys = [];
        foreach ($registeredSkippers as $being) {
            foreach ($being->cells as $coord) {
                $registeredKeys[] = SectorService::coordinatesToCellKey($coord);
            }
        }

        $newMiddleCells = array_filter($middleCells, fn($key) => !in_array($key, $registeredKeys));

        if (empty($newMiddleCells)) {
            return;
        }

        foreach ($newMiddleCells as $cellKey) {
            $coords = SectorService::cellKeyToCoordinates($cellKey);

            $this->game->beingService->addBeing(new Being(
                playerId: $playerId,
                type: 'puddle',
                subtype: 'skipper',
                cells: [$coords],
                count: 1,
            ));

            $this->game->statsService->incDweller(CardType::Puddle, 1, $playerId);
        }

        $transformedSectors = array_values(array_map(
            fn($cellKey) => ['cells' => [SectorService::cellKeyToCoordinates($cellKey)]],
            $newMiddleCells
        ));

        $this->game->notify->all('arrivalSkipperPuddle', Messages::$ArrivalBeing, [
            'player_name' => $this->game->getPlayerNameById($playerId),
            'playerId' => $playerId,
            'count_beings' => count($newMiddleCells),
            'sectors' => $transformedSectors,
            'being' => 'puddle',
            'being_icon' => 'puddle',
        ]);
        $this->game->notify->all('simplePause', '', ['time' => 1000]);
    }
}
