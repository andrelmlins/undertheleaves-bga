-- ------
-- BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
-- undertheleaves implementation : © André Lins andrelumlins@gmail.com
-- 
-- This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
-- See http://en.boardgamearena.com/#!doc/Studio for more information.
-- -----
CREATE TABLE IF NOT EXISTS `tile` (
    `card_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `card_type` varchar(24) NOT NULL,
    `card_type_arg` varchar(11) NOT NULL,
    `card_location` varchar(20) NOT NULL,
    `card_location_arg` int(11) NOT NULL,
    PRIMARY KEY (`card_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 AUTO_INCREMENT = 1;
CREATE TABLE IF NOT EXISTS `grid_tile` (
    `tile_x` int(11) NOT NULL,
    `tile_y` int(11) NOT NULL,
    `tile_player_id` int(11) NOT NULL,
    `tile_rotation` int(11) NOT NULL,
    `tile_side` int(11) NOT NULL,
    `tile_card_id` int(11) NOT NULL,
    PRIMARY KEY (`tile_x`, `tile_y`, `tile_player_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;