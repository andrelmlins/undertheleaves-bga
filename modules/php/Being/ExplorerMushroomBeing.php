<?php

declare(strict_types=1);

namespace Bga\Games\undertheleaves\Being;

use Bga\Games\undertheleaves\Entities\Being;
use Bga\Games\undertheleaves\Entities\CardType;
use Bga\Games\undertheleaves\Entities\DwellerBeing;
use Bga\Games\undertheleaves\Entities\Messages;
use Bga\Games\undertheleaves\Services\SectorService;

class ExplorerMushroomBeing extends DwellerBeing
{
    public function process(int $playerId): void
    {
        $mushroomService = new SectorService($this->game);
        $mushroomService->buildGrid($playerId, fn($t) => $t->mushroom ? 'mushroom' : false);
        $mushroomKeys = $mushroomService->getTerrainKeys();

        if (count($mushroomKeys) < 3) {
            return;
        }

        $registeredExplorers = $this->game->beingService->getBeingsBySector($playerId, 'mushroom', 'explorer');

        $occupiedMiddles = [];
        foreach ($registeredExplorers as $being) {
            if (!empty($being->cells)) {
                $occupiedMiddles[SectorService::coordinatesToCellKey($being->cells[0])] = true;
            }
        }

        $availableKeys = array_values(array_filter($mushroomKeys, fn($k) => !isset($occupiedMiddles[$k])));

        if (count($availableKeys) < 3) {
            return;
        }

        $availableCoords = array_map(fn($k) => SectorService::cellKeyToCoordinates($k), $availableKeys);

        $newMiddles = [];
        foreach ($availableCoords as $candidate) {
            $candidateKey = SectorService::coordinatesToCellKey($candidate);
            $others = array_values(array_filter($availableCoords, fn($c) => $c !== $candidate));

            foreach ($others as $outerIdx => $first) {
                foreach (array_slice($others, $outerIdx + 1) as $second) {
                    if ($this->isMiddle($candidate, $first, $second)) {
                        $newMiddles[$candidateKey] = $candidate;
                        break 2;
                    }
                }
            }
        }

        if (empty($newMiddles)) {
            return;
        }

        foreach ($newMiddles as $middleCoord) {
            $this->game->beingService->addBeing(new Being(
                playerId: $playerId,
                type: 'mushroom',
                subtype: 'explorer',
                cells: [$middleCoord],
                count: 1,
            ));

            $this->game->statsService->incDweller(CardType::Mushroom, 1, $playerId);
        }

        $playerName = $this->game->getPlayerNameById($playerId);

        foreach ($newMiddles as $middleCoord) {
            $this->game->notify->all('arrivalExplorerMushroom', Messages::$ArrivalExplorerMushroom, [
                'player_name'  => $playerName,
                'playerId'     => $playerId,
                'count_beings' => 1,
                'sectors'      => [['cells' => [$middleCoord]]],
                'being'        => 'mushroom',
                'being_icon'   => 'mushroom',
            ]);
            $this->game->notify->all('simplePause', '', ['time' => 600]);
        }
    }

    private function isMiddle(array $m, array $a, array $b): bool
    {
        $orthogonal = $a[0] === $b[0] || $a[1] === $b[1];
        $collinear = ($m[0] - $a[0]) * ($b[1] - $a[1]) === ($b[0] - $a[0]) * ($m[1] - $a[1]);
        $between = ($m[0] - $a[0]) * ($m[0] - $b[0]) <= 0
            && ($m[1] - $a[1]) * ($m[1] - $b[1]) <= 0;
        return $orthogonal && $collinear && $between;
    }
}
