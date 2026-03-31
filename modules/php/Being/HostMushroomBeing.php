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
        $sectorService->buildGrid($playerId, fn($t) => $t->type !== TerrainType::Puddle ? $t->type->value : false);
        $colorGroups = $sectorService->getAllTerrainGroups(1);

        if (empty($colorGroups)) {
            return;
        }

        $mushroomService = new SectorService($this->game);
        $mushroomService->buildGrid($playerId, fn($t) => $t->mushroom ? 'mushroom' : false);
        $mushroomKeySet = array_flip($mushroomService->getTerrainKeys());

        $qualifiedGroups = [];
        foreach ($colorGroups as $sectors) {
            foreach ($sectors as $sectorCells) {
                $mushroomCells = array_values(array_filter($sectorCells, fn($key) => isset($mushroomKeySet[$key])));
                if (count($mushroomCells) >= 2) {
                    $qualifiedGroups[] = $mushroomCells;
                }
            }
        }

        if (empty($qualifiedGroups)) {
            return;
        }

        $registeredHosts = $this->game->beingService->getBeingsBySector($playerId, 'mushroom', 'host');

        $newGroups = [];

        foreach ($qualifiedGroups as $groupCells) {
            if (!$this->hasExistingHost($registeredHosts, $groupCells)) {
                $newGroups[] = $groupCells;
            }
        }

        if (empty($newGroups)) {
            return;
        }

        foreach ($newGroups as $groupCells) {
            $cells = array_map(fn($key) => SectorService::cellKeyToCoordinates($key), $groupCells);

            $this->game->beingService->addBeing(new Being(
                playerId: $playerId,
                type: 'mushroom',
                subtype: 'host',
                cells: $cells,
                count: 1,
            ));

            $this->game->statsService->incDweller(CardType::Mushroom, 1, $playerId);
        }

        $transformedGroups = array_map(function ($groupCells) {
            $cells = array_map(fn($key) => SectorService::cellKeyToCoordinates($key), $groupCells);
            usort($cells, fn($a, $b) => $a[1] !== $b[1] ? $b[1] - $a[1] : $a[0] - $b[0]);

            return ['cells' => $cells];
        }, $newGroups);

        $this->game->notify->all('arrivalHostMushroom', Messages::$ArrivalBeing, [
            'player_name' => $this->game->getPlayerNameById($playerId),
            'playerId' => $playerId,
            'count_beings' => count($newGroups),
            'sectors' => $transformedGroups,
            'being_icon' => 'mushroom',
        ]);
        $this->game->beingService->notifyBeingArrivalPause(count($newGroups));
    }

    private function hasExistingHost(array $registeredHosts, array $groupCells): bool
    {
        $groupKeySet = array_flip($groupCells);
        foreach ($registeredHosts as $being) {
            $beingCellKeys = array_map(fn($coord) => SectorService::coordinatesToCellKey($coord), $being->cells);

            foreach ($beingCellKeys as $key) {
                if (isset($groupKeySet[$key])) {
                    return true;
                }
            }
        }

        return false;
    }
}
