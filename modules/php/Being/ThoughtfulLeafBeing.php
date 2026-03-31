<?php

declare(strict_types=1);

namespace Bga\Games\undertheleaves\Being;

use Bga\Games\undertheleaves\Entities\Being;
use Bga\Games\undertheleaves\Entities\CardType;
use Bga\Games\undertheleaves\Entities\DwellerBeing;
use Bga\Games\undertheleaves\Entities\Messages;
use Bga\Games\undertheleaves\Entities\TerrainType;
use Bga\Games\undertheleaves\Services\SectorService;

class ThoughtfulLeafBeing extends DwellerBeing
{
    public function process(int $playerId): void
    {
        $sectorService = new SectorService($this->game);
        $sectorService->buildGrid($playerId, fn($t) => $t->type !== TerrainType::Puddle ? $t->type->value : false);
        $allTerrainGroups = $sectorService->getAllTerrainGroups(minSize: 3);

        $registeredThoughtfuls = $this->game->beingService->getBeingsBySector($playerId, 'leaf', 'thoughtful');

        $newSquares = [];

        foreach ($allTerrainGroups as $colorGroup) {
            foreach ($colorGroup as $sectorCells) {
                $sectorSet = array_flip($sectorCells);

                foreach ($sectorCells as $cellKey) {
                    [$x, $y] = SectorService::cellKeyToCoordinates($cellKey);

                    $tr = SectorService::coordinatesToCellKey([$x + 1, $y]);
                    $bl = SectorService::coordinatesToCellKey([$x, $y + 1]);
                    $br = SectorService::coordinatesToCellKey([$x + 1, $y + 1]);

                    if (isset($sectorSet[$tr]) && isset($sectorSet[$bl]) && isset($sectorSet[$br])) {
                        $square = [[$x, $y], [$x + 1, $y], [$x, $y + 1], [$x + 1, $y + 1]];
                        if (!$this->hasExistingThoughtful($registeredThoughtfuls, $square)) {
                            $newSquares[] = $square;
                            break; // 1 leaf por setor — parar após o primeiro quadrado válido
                        }
                    }
                }
            }
        }

        if (empty($newSquares)) {
            return;
        }

        foreach ($newSquares as $square) {
            $this->game->beingService->addBeing(new Being(
                playerId: $playerId,
                type: 'leaf',
                subtype: 'thoughtful',
                cells: $square,
                count: 1,
            ));

            $this->game->statsService->incDweller(CardType::Leaf, 1, $playerId);
        }

        $transformedSquares = array_map(fn($square) => ['cells' => $square], $newSquares);

        $this->game->notify->all('arrivalThoughtfulLeaf', Messages::$ArrivalBeing, [
            'player_name' => $this->game->getPlayerNameById($playerId),
            'playerId' => $playerId,
            'count_beings' => count($newSquares),
            'sectors' => $transformedSquares,
            'being_icon' => 'leaf',
        ]);
        $this->game->beingService->notifyBeingArrivalPause(count($newSquares));
    }

    private function hasExistingThoughtful(array $registeredThoughtfuls, array $square): bool
    {
        $squareKeys = array_map(fn($c) => SectorService::coordinatesToCellKey($c), $square);

        foreach ($registeredThoughtfuls as $being) {
            $beingKeys = array_map(fn($c) => SectorService::coordinatesToCellKey($c), $being->cells);
            foreach ($squareKeys as $key) {
                if (in_array($key, $beingKeys)) {
                    return true;
                }
            }
        }

        return false;
    }
}
