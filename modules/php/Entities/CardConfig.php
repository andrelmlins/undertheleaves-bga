<?php

namespace Bga\Games\undertheleaves\Entities;

class CardConfig
{
    public function __construct(
        public Position $position,
        public CardType $type,
        public string $name,
        public string $description,
        public bool $firstGame = false
    ) {}
}
