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

        $newSquares = [];

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

            $square = [[$x, $y], [$x + 1, $y], [$x, $y + 1], [$x + 1, $y + 1]];

            if (!$this->hasExistingFlirty($registeredFlirtys, $newSquares, $square)) {
                $newSquares[] = $square;
            }
        }

        if (empty($newSquares)) {
            return;
        }

        foreach ($newSquares as $square) {
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

        foreach ($newSquares as $square) {
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

    private function hasExistingFlirty(array $registeredFlirtys, array $newSquares, array $square): bool
    {
        $squareKeys = array_map(fn($c) => SectorService::coordinatesToCellKey($c), $square);

        foreach ($registeredFlirtys as $being) {
            $beingKeys = array_map(fn($c) => SectorService::coordinatesToCellKey($c), $being->cells);
            foreach ($squareKeys as $key) {
                if (in_array($key, $beingKeys)) {
                    return true;
                }
            }
        }

        foreach ($newSquares as $existingSquare) {
            $existingKeys = array_map(fn($c) => SectorService::coordinatesToCellKey($c), $existingSquare);
            foreach ($squareKeys as $key) {
                if (in_array($key, $existingKeys)) {
                    return true;
                }
            }
        }

        return false;
    }
}
