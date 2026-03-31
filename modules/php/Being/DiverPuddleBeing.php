<?php

declare(strict_types=1);

namespace Bga\Games\undertheleaves\Being;

use Bga\Games\undertheleaves\Entities\Being;
use Bga\Games\undertheleaves\Entities\CardType;
use Bga\Games\undertheleaves\Entities\DwellerBeing;
use Bga\Games\undertheleaves\Entities\Messages;
use Bga\Games\undertheleaves\Entities\TerrainType;
use Bga\Games\undertheleaves\Services\SectorService;

class DiverPuddleBeing extends DwellerBeing
{
    public function process(int $playerId): void
    {
        $sectorService = new SectorService($this->game);
        $sectorService->buildGrid($playerId, fn($t) => $t->type === TerrainType::Puddle ? 'puddle' : false);
        $puddleGroups = $sectorService->getAllTerrainGroups(2)['puddle'] ?? [];

        if (empty($puddleGroups)) {
            return;
        }

        $registeredDivers = $this->game->beingService->getBeingsBySector($playerId, 'puddle', 'diver');

        $newGroups = [];

        foreach ($puddleGroups as $groupCells) {
            if (!$this->hasExistingDiver($registeredDivers, $groupCells)) {
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
                type: 'puddle',
                subtype: 'diver',
                cells: $cells,
                count: 1,
            ));

            $this->game->statsService->incDweller(CardType::Puddle, 1, $playerId);
        }

        $transformedGroups = array_map(function ($groupCells) {
            $cells = array_map(fn($key) => SectorService::cellKeyToCoordinates($key), $groupCells);
            usort($cells, fn($a, $b) => $a[1] !== $b[1] ? $b[1] - $a[1] : $a[0] - $b[0]);

            return ['cells' => $cells];
        }, $newGroups);

        $this->game->notify->all('arrivalDiverPuddle', Messages::$ArrivalBeing, [
            'player_name' => $this->game->getPlayerNameById($playerId),
            'playerId' => $playerId,
            'count_beings' => count($newGroups),
            'sectors' => $transformedGroups,
            'being' => 'puddle',
            'being_icon' => 'puddle',
        ]);
        $this->game->beingService->notifyBeingArrivalPause(count($newGroups));
    }

    private function hasExistingDiver(array $registeredDivers, array $groupCells): bool
    {
        foreach ($registeredDivers as $being) {
            $beingCellKeys = array_map(fn($coord) => SectorService::coordinatesToCellKey($coord), $being->cells);

            if ($this->isContained($beingCellKeys, $groupCells)) {
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
