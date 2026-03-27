<?php

namespace Bga\Games\undertheleaves\Entities;

class Messages
{
    static string $PlaceTile = '';
    static string $RevealTile = '';

    static string $ArrivalBeing = '';
    static string $PlaceBeing = '';

    static string $InvalidPosition = '';
    static string $InvalidTile = '';

    static function initMessages()
    {
        Messages::$PlaceTile = '${player_name} places a garden tile ${tile_image}';
        Messages::$RevealTile = '${player_name} reveals a new garden tile ${tile_image}';

        Messages::$ArrivalBeing = '${player_name} receives ${count_beings} ${being_icon}';
        Messages::$PlaceBeing = '${player_name} places a dweller ${being_icon}';

        Messages::$InvalidPosition = 'Invalid position';
        Messages::$InvalidTile = 'Invalid tile';
    }
}
