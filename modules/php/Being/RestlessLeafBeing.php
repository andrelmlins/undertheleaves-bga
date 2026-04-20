<?php

declare(strict_types=1);

namespace Bga\Games\undertheleaves\Being;

use Bga\Games\undertheleaves\Entities\Being;
use Bga\Games\undertheleaves\Entities\CardType;
use Bga\Games\undertheleaves\Entities\DwellerBeing;
use Bga\Games\undertheleaves\Entities\Messages;
use Bga\Games\undertheleaves\Entities\TerrainType;
use Bga\Games\undertheleaves\Services\SectorService;

class RestlessLeafBeing extends DwellerBeing
{
    public function process(int $playerId): void
    {
        $sectorService = new SectorService($this->game);
        $sectorService->buildGrid($playerId, fn($t) => $t->type !== TerrainType::Puddle ? $t->type->value : false);
        $allTerrainGroups = $sectorService->getAllTerrainGroups(minSize: 5);

        $registeredRestless = $this->game->beingService->getBeingsBySector($playerId, 'leaf', 'restless');

        $newGroups = [];

        foreach ($allTerrainGroups as $color => $colorGroup) {
            foreach ($colorGroup as $sectorCells) {
                if (!$this->hasExistingRestless($registeredRestless, $sectorCells)) {
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
                subtype: 'restless',
                cells: $cells,
                count: 1,
            ));

            $this->game->statsService->incDweller(CardType::Leaf, 1, $playerId);
        }

        $playerName = $this->game->getPlayerNameById($playerId);

        foreach ($newGroups as $group) {
            $cells = array_map(fn($key) => SectorService::cellKeyToCoordinates($key), $group['cells']);
            usort($cells, fn($a, $b) => $a[1] !== $b[1] ? $b[1] - $a[1] : $a[0] - $b[0]);

            $this->game->notify->all('arrivalRestlessLeaf', Messages::$ArrivalRestlessLeaf, [
                'player_name'  => $playerName,
                'playerId'     => $playerId,
                'count_beings' => 1,
                'sectors'      => [['cells' => $cells]],
                'being'        => 'leaf',
                'being_icon'   => 'leaf',
                'color_name'   => TerrainType::getTranslatedName($group['color']),
                'i18n'         => ['color_name'],
                'size'         => count($group['cells']),
                'size_label'   => count($group['cells']),
            ]);
            $this->game->notify->all('simplePause', '', ['time' => 600]);
        }
    }

    private function hasExistingRestless(array $registeredRestless, array $sectorCells): bool
    {
        $sectorSet = array_flip($sectorCells);

        foreach ($registeredRestless as $being) {
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
