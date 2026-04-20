<?php

namespace Bga\Games\undertheleaves\Entities;

class Messages
{
    static string $PlaceTile = '';
    static string $RevealTile = '';

    static string $ArrivalBeing = '';
    static string $PlaceBeing = '';

    static string $ArrivalBeeNew = '';
    static string $ArrivalBeeExisting = '';

    static string $ArrivalHummingbirdBase = '';
    static string $ArrivalHummingbirdBonus = '';

    static string $ArrivalDiverPuddle = '';
    static string $ArrivalSkipperPuddle = '';
    static string $ArrivalShyPuddle = '';
    static string $ArrivalFriendlyPuddle = '';

    static string $ArrivalHostMushroom = '';
    static string $ArrivalExplorerMushroom = '';
    static string $ArrivalLonerMushroom = '';
    static string $ArrivalCollectorMushroom = '';

    static string $ArrivalThoughtfulLeaf = '';
    static string $ArrivalFlirtyLeaf = '';
    static string $ArrivalRestlessLeaf = '';
    static string $ArrivalRunnerLeaf = '';


    static string $InvalidPosition = '';
    static string $InvalidTile = '';

    static function initMessages()
    {
        Messages::$PlaceTile = '${player_name} places a garden tile ${tile_image}';
        Messages::$RevealTile = '${player_name} reveals a new garden tile ${tile_image}';

        Messages::$ArrivalBeing = '${player_name} receives ${count_beings} ${being_icon}';
        Messages::$PlaceBeing = '${player_name} places a dweller ${being_icon}';

        Messages::$ArrivalBeeNew = '${player_name} receives 1 ${being_icon} by forming a new ${color_name} group of ${size_label} terrains';
        Messages::$ArrivalBeeExisting = '${player_name} receives 1 ${being_icon} as a bonus for their existing ${color_name} group (multiple ${color_name} groups)';

        Messages::$ArrivalHummingbirdBase  = '${player_name} receives 1 ${being_icon} with all corners of tile pollinated';
        Messages::$ArrivalHummingbirdBonus = '${player_name} receives 1 bonus ${being_icon} with tile aligned with pollinated neighbors';

        Messages::$ArrivalDiverPuddle = '${player_name} receives 1 ${being_icon} with a connected puddle of ${size_label} cells';
        Messages::$ArrivalSkipperPuddle = '${player_name} receives 1 ${being_icon} by placing a terrain between two puddles';
        Messages::$ArrivalShyPuddle = '${player_name} receives 1 ${being_icon} with a puddle surrounded by terrains on all sides';
        Messages::$ArrivalFriendlyPuddle = '${player_name} receives 1 ${being_icon} by forming a diagonal puddle pair';

        Messages::$ArrivalHostMushroom = '${player_name} receives 1 ${being_icon} with a ${color_name} group containing ${count_label} mushroom tokens';
        Messages::$ArrivalExplorerMushroom = '${player_name} receives 1 ${being_icon} with a mushroom aligned between two others';
        Messages::$ArrivalLonerMushroom = '${player_name} receives 1 ${being_icon} with a mushroom surrounded by terrains on all sides';
        Messages::$ArrivalCollectorMushroom = '${player_name} receives 1 ${being_icon} by forming a diagonal mushroom pair';

        Messages::$ArrivalThoughtfulLeaf = '${player_name} receives 1 ${being_icon} by completing a ${color_name} 2x2 terrain square';
        Messages::$ArrivalFlirtyLeaf = '${player_name} receives 1 ${being_icon} by completing a 2x2 square with 4 different terrain types';
        Messages::$ArrivalRestlessLeaf = '${player_name} receives 1 ${being_icon} with a ${color_name} connected group of ${size_label} terrains';
        Messages::$ArrivalRunnerLeaf = '${player_name} receives 1 ${being_icon} by forming a 4-in-a-row of ${color_name} terrains';

        Messages::$InvalidPosition = 'Invalid position';
        Messages::$InvalidTile = 'Invalid tile';
    }
}
