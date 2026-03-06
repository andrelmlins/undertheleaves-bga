<?php

namespace Bga\Games\undertheleaves\Entities;

class Terrain
{
    public function __construct(
        public TerrainType $type,
        public bool $mushroom = false,
    ) {}
}
