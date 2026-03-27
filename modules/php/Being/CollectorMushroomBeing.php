<?php

declare(strict_types=1);

namespace Bga\Games\undertheleaves\Being;

use Bga\Games\undertheleaves\Entities\Being;
use Bga\Games\undertheleaves\Entities\CardType;
use Bga\Games\undertheleaves\Entities\DwellerBeing;
use Bga\Games\undertheleaves\Entities\Messages;
use Bga\Games\undertheleaves\Services\SectorService;

class CollectorMushroomBeing extends DwellerBeing
{

    public function process(int $playerId): void
    {
        $sectorService = new SectorService($this->game);
        $sectorService->buildGrid($playerId, fn($t) => $t->mushroom ? 'mushroom' : false);
        $mushroomKeys = $sectorService->getTerrainKeys();

        $diagonalPairs = [];

        foreach ($mushroomKeys as $keyA) {
            foreach ($mushroomKeys as $keyB) {
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

        $registeredCollectors = $this->game->beingService->getBeingsBySector($playerId, 'mushroom', 'collector');

        $newPairs = [];

        foreach ($diagonalPairs as $pair) {
            if (!$this->hasExistingCollector($registeredCollectors, $pair)) {
                $newPairs[] = $pair;
            }
        }

        if (empty($newPairs)) {
            return;
        }

        $pending = $this->game->globals->get('pending:beings') ?? [];
        $pending['mushroom'] = $newPairs;
        $this->game->globals->set('pending:beings', $pending);
    }

    public function endProcess(int $playerId, array $placedCells): void
    {
        foreach ($placedCells as $coords) {
            $this->game->beingService->addBeing(new Being(
                playerId: $playerId,
                type: 'mushroom',
                subtype: 'collector',
                cells: [$coords],
                count: 1,
            ));

            $this->game->statsService->incDweller(CardType::Mushroom, 1, $playerId);
        }

        $transformedSectors = array_map(fn($c) => ['cells' => [$c]], $placedCells);

        $this->game->notify->all('arrivalCollectorMushroom', Messages::$ArrivalBeing, [
            'player_name' => $this->game->getPlayerNameById($playerId),
            'playerId' => $playerId,
            'count_beings' => count($placedCells),
            'sectors' => $transformedSectors,
            'being_icon' => 'mushroom',
        ]);
        $this->game->beingService->notifyBeingArrivalPause(count($placedCells));
    }

    private function hasExistingCollector(array $registeredCollectors, array $pair): bool
    {
        [$coordA, $coordB] = $pair;
        $keyA = SectorService::coordinatesToCellKey($coordA);
        $keyB = SectorService::coordinatesToCellKey($coordB);

        foreach ($registeredCollectors as $being) {
            $beingKeys = array_map(fn($coord) => SectorService::coordinatesToCellKey($coord), $being->cells);

            if (in_array($keyA, $beingKeys) || in_array($keyB, $beingKeys)) {
                return true;
            }
        }

        return false;
    }
}
