<?php

namespace Bga\Games\undertheleaves\Entities;

enum TerrainType: string
{
    case Puddle = 'puddle';
    case Yellow = 'yellow';
    case Brown = 'brown';
    case Pink = 'pink';
    case Orange = 'orange';
    case Purple = 'purple';
    case Green = 'green';

    public function clienttranslateName(): string
    {
        return match($this) {
            TerrainType::Puddle => clienttranslate('puddle'),
            TerrainType::Yellow => clienttranslate('yellow'),
            TerrainType::Brown  => clienttranslate('brown'),
            TerrainType::Pink   => clienttranslate('pink'),
            TerrainType::Orange => clienttranslate('orange'),
            TerrainType::Purple => clienttranslate('purple'),
            TerrainType::Green  => clienttranslate('green'),
        };
    }

    public static function getTranslatedName(string $color): string
    {
        return TerrainType::from($color)->clienttranslateName();
    }
}
