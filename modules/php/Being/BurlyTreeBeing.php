<?php

declare(strict_types=1);

namespace Bga\Games\undertheleaves\Being;

use Bga\Games\undertheleaves\Entities\DwellerBeing;
use Bga\Games\undertheleaves\Entities\Messages;
use Bga\Games\undertheleaves\Entities\TerrainType;
use Bga\Games\undertheleaves\Services\SectorService;

class BurlyTreeBeing extends DwellerBeing
{
    const MIN_SECTOR_SIZE = 5;

    public function process(int $playerId): void
    {
        $sectorService = new SectorService($this->game);
        $sectorService->buildGrid($playerId, fn($t) => $t->type !== TerrainType::Puddle ? $t->type->value : false);
        $colorGroups = $sectorService->getAllTerrainGroups(self::MIN_SECTOR_SIZE);

        if (empty($colorGroups)) {
            return;
        }

        $largest = null;

        foreach ($colorGroups as $color => $sectors) {
            foreach ($sectors as $sectorCells) {
                if ($largest === null || count($sectorCells) > count($largest['cells'])) {
                    $largest = ['cells' => $sectorCells, 'color' => $color];
                }
            }
        }

        $newSize = count($largest['cells']);

        $currentOwnerRaw = $this->game->globals->get('card:tree:owner');
        $currentOwner = $currentOwnerRaw !== null ? (int)$currentOwnerRaw : null;
        $currentSize = (int)$this->game->globals->get('card:tree:size', 0);

        if ($newSize <= $currentSize) {
            return;
        }

        $this->game->globals->set('card:tree:owner', $playerId);
        $this->game->globals->set('card:tree:size', $newSize);

        if ($currentOwner === $playerId) {
            return;
        }

        $playerName = $this->game->getPlayerNameById($playerId);

        if ($currentOwner === null) {
            $this->game->notify->all('takeBurlyTreeCard', Messages::$ClaimBurlyTreeCard, [
                'player_name' => $playerName,
                'playerId'    => $playerId,
                'color_name'  => TerrainType::getTranslatedName($largest['color']),
                'size_label'  => $newSize,
                'burly_image' => true,
            ]);
        } else {
            $this->game->notify->all('takeBurlyTreeCard', Messages::$StealBurlyTreeCard, [
                'player_name'      => $playerName,
                'playerId'         => $playerId,
                'previousPlayerId' => $currentOwner,
                'color_name'       => TerrainType::getTranslatedName($largest['color']),
                'size_label'       => $newSize,
                'burly_image'      => true,
            ]);
        }

        $this->game->notify->all('simplePause', '', ['time' => 600]);
    }
}
