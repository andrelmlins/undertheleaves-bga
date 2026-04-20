<?php

declare(strict_types=1);

namespace Bga\Games\undertheleaves\Being;

use Bga\Games\undertheleaves\Entities\Being;
use Bga\Games\undertheleaves\Entities\CardType;
use Bga\Games\undertheleaves\Entities\DwellerBeing;
use Bga\Games\undertheleaves\Entities\Messages;
use Bga\Games\undertheleaves\Entities\TerrainType;
use Bga\Games\undertheleaves\Services\SectorService;

class RunnerLeafBeing extends DwellerBeing
{
    public function process(int $playerId): void
    {
        $sectorService = new SectorService($this->game);
        $sectorService->buildGrid($playerId, fn($t) => $t->type !== TerrainType::Puddle ? $t->type->value : false);
        $allTerrainGroups = $sectorService->getAllTerrainGroups(minSize: 4);

        $registeredRunners = $this->game->beingService->getBeingsBySector($playerId, 'leaf', 'runner');

        $newGroups = [];

        foreach ($allTerrainGroups as $color => $colorGroup) {
            foreach ($colorGroup as $sectorCells) {
                if ($this->hasFourInRow($sectorCells) && !$this->hasExistingRunner($registeredRunners, $sectorCells)) {
                    $newGroups[] = ['cells' => $sectorCells, 'color' => $color];
                }
            }
        }

        if (empty($newGroups)) {
            return;
        }

        foreach ($newGroups as $group) {
            $cells = array_map(fn($key) => SectorService::cellKeyToCoordinates($key), $group['cells']);

            $this->game->beingService->addBeing(new Being(
                playerId: $playerId,
                type: 'leaf',
                subtype: 'runner',
                cells: $cells,
                count: 1,
            ));

            $this->game->statsService->incDweller(CardType::Leaf, 1, $playerId);
        }

        $playerName = $this->game->getPlayerNameById($playerId);

        foreach ($newGroups as $group) {
            $cells = array_map(fn($key) => SectorService::cellKeyToCoordinates($key), $group['cells']);
            usort($cells, fn($a, $b) => $a[1] !== $b[1] ? $b[1] - $a[1] : $a[0] - $b[0]);

            $this->game->notify->all('arrivalRunnerLeaf', Messages::$ArrivalRunnerLeaf, [
                'player_name'  => $playerName,
                'playerId'     => $playerId,
                'count_beings' => 1,
                'sectors'      => [['cells' => $cells]],
                'being'        => 'leaf',
                'being_icon'   => 'leaf',
                'color_name'   => TerrainType::getTranslatedName($group['color']),
                'i18n'         => ['color_name'],
            ]);
            $this->game->notify->all('simplePause', '', ['time' => 600]);
        }
    }

    private function hasFourInRow(array $sectorCells): bool
    {
        $byRow = [];
        $byCol = [];

        foreach ($sectorCells as $cellKey) {
            [$x, $y] = SectorService::cellKeyToCoordinates($cellKey);
            $byRow[$y][] = $x;
            $byCol[$x][] = $y;
        }

        foreach ($byRow as $xValues) {
            sort($xValues);
            if ($this->hasConsecutiveRun($xValues, 4)) {
                return true;
            }
        }

        foreach ($byCol as $yValues) {
            sort($yValues);
            if ($this->hasConsecutiveRun($yValues, 4)) {
                return true;
            }
        }

        return false;
    }

    private function hasConsecutiveRun(array $values, int $length): bool
    {
        $count = 1;
        for ($i = 1; $i < count($values); $i++) {
            if ($values[$i] === $values[$i - 1] + 1) {
                $count++;
                if ($count >= $length) {
                    return true;
                }
            } else {
                $count = 1;
            }
        }

        return false;
    }

    private function hasExistingRunner(array $registeredRunners, array $sectorCells): bool
    {
        $sectorSet = array_flip($sectorCells);

        foreach ($registeredRunners as $being) {
            $beingCellKeys = array_map(fn($coord) => SectorService::coordinatesToCellKey($coord), $being->cells);

            foreach ($beingCellKeys as $key) {
                if (isset($sectorSet[$key])) {
                    return true;
                }
            }
        }

        return false;
    }
}
