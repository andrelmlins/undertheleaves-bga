<?php

namespace Bga\Games\undertheleaves\Entities;

class GridTile
{
    public function __construct(
        public int $x,
        public int $y,
        public int $playerId,
        public int $rotation,
        public int $side,
        public array $tile,
    ) {}

    public function copyWith(
        ?int $x = null,
        ?int $y = null,
        ?int $playerId = null,
        ?int $rotation = null,
        ?int $side = null,
        ?int $tile = null,
    ): GridTile {
        return new GridTile(
            x: $x ?? $this->x,
            y: $y ?? $this->y,
            playerId: $playerId ?? $this->playerId,
            rotation: $rotation ?? $this->rotation,
            side: $side ?? $this->side,
            tile: $this->tile
        );
    }
}
