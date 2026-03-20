<?php

namespace Bga\Games\undertheleaves\Entities;

class Being
{
    public function __construct(
        public int $playerId,
        public string $type,
        public array $cells,
        public int $count,
        public ?string $color = null,
        public ?int $x = null,
        public ?int $y = null,
    ) {}

    public function copyWith(
        ?int $playerId = null,
        ?string $type = null,
        ?array $cells = null,
        ?int $count = null,
        ?string $color = null,
        ?int $x = null,
        ?int $y = null,
    ): Being {
        return new Being(
            playerId: $playerId ?? $this->playerId,
            type: $type ?? $this->type,
            cells: $cells ?? $this->cells,
            count: $count ?? $this->count,
            color: $color ?? $this->color,
            x: $x ?? $this->x,
            y: $y ?? $this->y,
        );
    }
}
