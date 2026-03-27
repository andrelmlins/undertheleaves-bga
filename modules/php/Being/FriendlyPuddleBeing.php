<?php

declare(strict_types=1);

namespace Bga\Games\undertheleaves\Being;

use Bga\Games\undertheleaves\Entities\Being;
use Bga\Games\undertheleaves\Entities\DwellerBeing;
use Bga\Games\undertheleaves\Entities\Messages;
use Bga\Games\undertheleaves\Entities\TerrainType;
use Bga\Games\undertheleaves\Services\SectorService;

class FriendlyPuddleBeing extends DwellerBeing
{
    public function process(int $playerId): void
    {
        $sectorService = new SectorService($this->game);
        $sectorService->buildGrid($playerId, fn($t) => $t->type === TerrainType::Puddle ? 'puddle' : false);
        $puddleKeys = $sectorService->getTerrainKeys();

        $diagonalPairs = [];

        foreach ($puddleKeys as $keyA) {
            foreach ($puddleKeys as $keyB) {
                if ($keyA >= $keyB) {
                    continue;
                }

                [$xA, $yA] = SectorService::cellKeyToCoordinates($keyA);
                [$xB, $yB] = SectorService::cellKeyToCoordinates($keyB);

                if (abs($xA - $xB) === 1 && abs($yA - $yB) === 1) {
                    $diagonalPairs[] = [[$xA, $yA], [$xB, $yB]];
                }
            }
        }

        if (empty($diagonalPairs)) {
            return;
        }

        $registeredFriendlies = $this->game->beingService->getBeingsBySector($playerId, 'puddle', 'friendly');

        $newPairs = [];

        foreach ($diagonalPairs as $pair) {
            if (!$this->hasExistingFriendly($registeredFriendlies, $pair)) {
                $newPairs[] = $pair;
            }
        }

        if (empty($newPairs)) {
            return;
        }

        $pending = $this->game->globals->get('pending:beings') ?? [];
        $pending['puddle'] = $newPairs;
        $this->game->globals->set('pending:beings', $pending);
    }

    public function endProcess(int $playerId, array $placedCells): void
    {
        foreach ($placedCells as $coords) {
            $this->game->beingService->addBeing(new Being(
                playerId: $playerId,
                type: 'puddle',
                subtype: 'friendly',
                cells: [$coords],
                count: 1,
            ));
        }

        $transformedSectors = array_map(fn($c) => ['cells' => [$c]], $placedCells);

        $this->game->notify->all('arrivalFriendlyPuddle', Messages::$ArrivalBeing, [
            'player_name' => $this->game->getPlayerNameById($playerId),
            'playerId' => $playerId,
            'count_beings' => count($placedCells),
            'sectors' => $transformedSectors,
            'being_icon' => 'puddle',
        ]);
        $this->game->beingService->notifyBeingArrivalPause(count($placedCells));
    }

    private function hasExistingFriendly(array $registeredFriendlies, array $pair): bool
    {
        [$coordA, $coordB] = $pair;
        $keyA = SectorService::coordinatesToCellKey($coordA);
        $keyB = SectorService::coordinatesToCellKey($coordB);

        foreach ($registeredFriendlies as $being) {
            $beingKeys = array_map(fn($coord) => SectorService::coordinatesToCellKey($coord), $being->cells);

            if (in_array($keyA, $beingKeys) || in_array($keyB, $beingKeys)) {
                return true;
            }
        }

        return false;
    }
}
