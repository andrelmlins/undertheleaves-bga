<?php

namespace Bga\Games\undertheleaves\Entities;

class Position
{
    public function __construct(
        public int $row,
        public int $column,
    ) {}

    public function typeArg()
    {
        return "{$this->row}_{$this->column}";
    }
}
