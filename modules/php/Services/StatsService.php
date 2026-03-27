<?php

namespace Bga\Games\undertheleaves\Services;

use Bga\Games\undertheleaves\Entities\CardType;
use Bga\Games\undertheleaves\Game;

class StatsService
{
    public function __construct(public Game $game) {}

    public function setup()
    {
        $this->game->playerStats->init('beeArrived', 0);
        $this->game->playerStats->init('beeArrivedSameTerrain', 0);
        $this->game->playerStats->init('hummingbirdArrived', 0);
        $this->game->playerStats->init('leafArrived', 0);
        $this->game->playerStats->init('mushroomArrived', 0);
        $this->game->playerStats->init('puddleArrived', 0);
    }

    public function incBee(int $count, int $playerId, bool $variant)
    {
        if ($variant) {
            $this->game->playerStats->inc('beeArrivedSameTerrain', $count, $playerId);
        } else {
            $this->game->playerStats->inc('beeArrived', $count, $playerId);
        }
    }

    public function incHummingbird(int $count, int $playerId)
    {
        $this->game->playerStats->inc('hummingbirdArrived', $count, $playerId);
    }

    public function incDweller(CardType $cardType, int $count, int $playerId)
    {
        $this->game->playerStats->inc("{$cardType->value}Arrived", $count, $playerId);
    }
}
