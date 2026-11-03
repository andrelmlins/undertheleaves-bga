<?php

declare(strict_types=1);

namespace Bga\Games\undertheleaves\Being;

use Bga\Games\undertheleaves\Entities\Being;
use Bga\Games\undertheleaves\Entities\CardType;
use Bga\Games\undertheleaves\Entities\DwellerBeing;
use Bga\Games\undertheleaves\Entities\Messages;
use Bga\Games\undertheleaves\Services\SectorService;

class FlirtyLeafBeing extends DwellerBeing
{
    public function process(int $playerId): void
    {
        $sectorService = new SectorService($this->game);
        $sectorService->buildGrid($playerId, fn($t) => $t->type->value);
        $terrainGrid = $sectorService->getTerrainGrid();

        $registeredFlirtys = $this->game->beingService->getBeingsBySector($playerId, 'leaf', 'flirty');
        $usedKeys = [];
        foreach ($registeredFlirtys as $being) {
            foreach ($being->cells as $coord) {
                $usedKeys[SectorService::coordinatesToCellKey($coord)] = true;
            }
        }

        $candidates = [];

        foreach ($terrainGrid as $cellKey => $type) {
            [$x, $y] = SectorService::cellKeyToCoordinates($cellKey);

            if ($x === 0 && $y === -1) {
                continue;
            }

            $trKey = SectorService::coordinatesToCellKey([$x + 1, $y]);
            $blKey = SectorService::coordinatesToCellKey([$x, $y + 1]);
            $brKey = SectorService::coordinatesToCellKey([$x + 1, $y + 1]);

            if (!isset($terrainGrid[$trKey]) || !isset($terrainGrid[$blKey]) || !isset($terrainGrid[$brKey])) {
                continue;
            }

            $types = [$type, $terrainGrid[$trKey], $terrainGrid[$blKey], $terrainGrid[$brKey]];

            if (count(array_unique($types)) < 4) {
                continue;
            }

            $squareKeys = [$cellKey, $trKey, $blKey, $brKey];

            if (array_intersect_key($usedKeys, array_flip($squareKeys))) {
                continue;
            }

            $candidates[] = [
                'square' => [[$x, $y], [$x + 1, $y], [$x, $y + 1], [$x + 1, $y + 1]],
                'keys' => $squareKeys,
            ];
        }

        if (empty($candidates)) {
            return;
        }

        // Two candidate squares conflict when they share a space: the rule says a space
        // used by one Flirty can never attract another, so at most one of them can be
        // granted. Squares with no conflict are unambiguous and get placed immediately;
        // conflicting ones must be resolved by the player (see ChooseBeing).
        $autoSquares = [];
        $conflictingSquares = [];

        foreach ($candidates as $i => $candidate) {
            $hasConflict = false;

            foreach ($candidates as $j => $other) {
                if ($i === $j) {
                    continue;
                }

                if (array_intersect($candidate['keys'], $other['keys'])) {
                    $hasConflict = true;
                    break;
                }
            }

            if ($hasConflict) {
                $conflictingSquares[] = $candidate['square'];
            } else {
                $autoSquares[] = $candidate['square'];
            }
        }

        if (!empty($autoSquares)) {
            $this->commitSquares($playerId, $autoSquares);
        }

        if (!empty($conflictingSquares)) {
            $pending = $this->game->globals->get('pending:beings') ?? [];
            $pending['leaf'] = $conflictingSquares;
            $this->game->globals->set('pending:beings', $pending);
        }
    }

    public function endProcess(int $playerId, array $placedCells, array $selectedGroup = []): void
    {
        $this->commitSquares($playerId, [$selectedGroup]);
    }

    private function commitSquares(int $playerId, array $squares): void
    {
        foreach ($squares as $square) {
            $this->game->beingService->addBeing(new Being(
                playerId: $playerId,
                type: 'leaf',
                subtype: 'flirty',
                cells: $square,
                count: 1,
            ));

            $this->game->statsService->incDweller(CardType::Leaf, 1, $playerId);
        }

        $playerName = $this->game->getPlayerNameById($playerId);

        foreach ($squares as $square) {
            $this->game->notify->all('arrivalFlirtyLeaf', Messages::$ArrivalFlirtyLeaf, [
                'player_name'  => $playerName,
                'playerId'     => $playerId,
                'count_beings' => 1,
                'sectors'      => [['cells' => $square]],
                'being_icon'   => 'leaf',
            ]);
            $this->game->notify->all('simplePause', '', ['time' => 600]);
        }
    }
}
