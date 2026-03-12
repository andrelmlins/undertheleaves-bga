<?php

namespace Bga\Games\undertheleaves\Entities;

class Messages
{
    static string $PlaceTile = '';
    static string $RevealTile = '';

    static string $InvalidPosition = '';
    static string $InvalidTile = '';

    static function initMessages()
    {
        Messages::$PlaceTile = '${player_name} places a garden tile ${tile_image}';
        Messages::$RevealTile = '${player_name} reveals a new garden tile ${tile_image}';

        Messages::$InvalidPosition = 'Invalid position';
        Messages::$InvalidTile = 'Invalid tile';
    }
}
