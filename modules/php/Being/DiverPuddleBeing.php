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

        $playerName = $this->game->getPlayerNameById($playerId);

        foreach ($newGroups as $groupCells) {
            $cells = array_map(fn($key) => SectorService::cellKeyToCoordinates($key), $groupCells);
            usort($cells, fn($a, $b) => $a[1] !== $b[1] ? $b[1] - $a[1] : $a[0] - $b[0]);

            $this->game->notify->all('arrivalDiverPuddle', Messages::$ArrivalDiverPuddle, [
                'player_name'  => $playerName,
                'playerId'     => $playerId,
                'count_beings' => 1,
                'sectors'      => [['cells' => $cells]],
                'being'        => 'puddle',
                'being_icon'   => 'puddle',
                'size'         => count($groupCells),
                'size_label'   => count($groupCells),
            ]);
            $this->game->notify->all('simplePause', '', ['time' => 600]);
        }
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
