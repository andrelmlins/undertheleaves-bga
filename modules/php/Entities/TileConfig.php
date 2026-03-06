<?php

namespace Bga\Games\undertheleaves\Entities;

class TileConfig
{
    /**
     * @param Terrain[] $terrains
     */
    public function __construct(
        public Position $position,
        public array $terrains,
    ) {}

    /**
     * @return Terrain[]
     */
    function getTerrains(bool $isBack)
    {
        if ($isBack) {
            return [$this->terrains[1], $this->terrains[0], $this->terrains[3], $this->terrains[2]];
        }

        return $this->terrains;
    }
}
