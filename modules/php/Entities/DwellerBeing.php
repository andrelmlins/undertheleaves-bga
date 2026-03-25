<?php

declare(strict_types=1);

namespace Bga\Games\undertheleaves\Entities;

use Bga\Games\undertheleaves\Game;

abstract class DwellerBeing
{
    protected Game $game;

    public function setGame(Game $game): static
    {
        $this->game = $game;
        return $this;
    }

    abstract public function process(int $playerId): void;
}
