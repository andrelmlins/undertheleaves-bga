<?php

declare(strict_types=1);

namespace Bga\Games\undertheleaves\Being;

use Bga\Games\undertheleaves\Entities\Being;
use Bga\Games\undertheleaves\Entities\CardType;
use Bga\Games\undertheleaves\Entities\DwellerBeing;
use Bga\Games\undertheleaves\Entities\Messages;
use Bga\Games\undertheleaves\Entities\TerrainType;
use Bga\Games\undertheleaves\Services\SectorService;

class HostMushroomBeing extends DwellerBeing
{
    public function process(int $playerId): void
    {
        $sectorService = new SectorService($this->game);
        $sectorService->buildGrid($playerId, fn($t) => $t->type !== TerrainType::Puddle ? $t->type->value : false);
        $colorGroups = $sectorService->getAllTerrainGroups(1);

        if (empty($colorGroups)) {
            return;
        }

        $mushroomService = new SectorService($this->game);
        $mushroomService->buildGrid($playerId, fn($t) => $t->mushroom ? 'mushroom' : false);
        $mushroomKeySet = array_flip($mushroomService->getTerrainKeys());

        $qualifiedGroups = [];
        foreach ($colorGroups as $color => $sectors) {
            foreach ($sectors as $sectorCells) {
                $mushroomCells = array_values(array_filter($sectorCells, fn($key) => isset($mushroomKeySet[$key])));
                if (count($mushroomCells) >= 2) {
                    $qualifiedGroups[] = ['cells' => $mushroomCells, 'color' => $color, 'count' => count($mushroomCells)];
                }
            }
        }

        if (empty($qualifiedGroups)) {
            return;
        }

        $registeredHosts = $this->game->beingService->getBeingsBySector($playerId, 'mushroom', 'host');

        $newGroups = [];

        foreach ($qualifiedGroups as $group) {
            if (!$this->hasExistingHost($registeredHosts, $group['cells'])) {
                $newGroups[] = $group;
            }
        }

        if (empty($newGroups)) {
            return;
        }

        foreach ($newGroups as $group) {
            $cells = array_map(fn($key) => SectorService::cellKeyToCoordinates($key), $group['cells']);

            $this->game->beingService->addBeing(new Being(
                playerId: $playerId,
                type: 'mushroom',
                subtype: 'host',
                cells: $cells,
                count: 1,
            ));

            $this->game->statsService->incDweller(CardType::Mushroom, 1, $playerId);
        }

        $playerName = $this->game->getPlayerNameById($playerId);

        foreach ($newGroups as $group) {
            $cells = array_map(fn($key) => SectorService::cellKeyToCoordinates($key), $group['cells']);
            usort($cells, fn($a, $b) => $a[1] !== $b[1] ? $b[1] - $a[1] : $a[0] - $b[0]);

            $this->game->notify->all('arrivalHostMushroom', Messages::$ArrivalHostMushroom, [
                'player_name'  => $playerName,
                'playerId'     => $playerId,
                'count_beings' => 1,
                'sectors'      => [['cells' => $cells]],
                'being'        => 'mushroom',
                'being_icon'   => 'mushroom',
                'color_name'   => TerrainType::getTranslatedName($group['color']),
                'i18n'         => ['color_name'],
                'count'        => $group['count'],
                'count_label'  => $group['count'],
            ]);
            $this->game->notify->all('simplePause', '', ['time' => 600]);
        }
    }

    private function hasExistingHost(array $registeredHosts, array $groupCells): bool
    {
        $groupKeySet = array_flip($groupCells);
        foreach ($registeredHosts as $being) {
            $beingCellKeys = array_map(fn($coord) => SectorService::coordinatesToCellKey($coord), $being->cells);

            foreach ($beingCellKeys as $key) {
                if (isset($groupKeySet[$key])) {
                    return true;
                }
            }
        }

        return false;
    }
}
