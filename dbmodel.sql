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
CREATE TABLE IF NOT EXISTS `beings` (
    `being_id` int(11) NOT NULL AUTO_INCREMENT,
    `being_player_id` int(11) NOT NULL,
    `being_type` varchar(32) NOT NULL COMMENT 'bee | hummingbird | leaf | puddle | mushroom',
    `being_color` varchar(20) COMMENT 'For bees and hummingbirds - the terrain color',
    `being_cells` varchar(2000) NOT NULL COMMENT 'JSON array of [x, y] coordinates for sector cells',
    `being_count` int(11) NOT NULL DEFAULT 1 COMMENT 'How many of this being in this sector',
    `being_x` int(11) COMMENT 'For dwellers - x position to render',
    `being_y` int(11) COMMENT 'For dwellers - y position to render',
    PRIMARY KEY (`being_id`),
    KEY `being_player_id` (`being_player_id`),
    KEY `being_type` (`being_type`),
    UNIQUE KEY `unique_being_sector` (
        `being_player_id`,
        `being_type`,
        `being_color`,
        `being_cells`(200)
    )
) ENGINE = InnoDB DEFAULT CHARSET = utf8;