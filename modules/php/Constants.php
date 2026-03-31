<?php

namespace Bga\Games\undertheleaves;

use Bga\Games\undertheleaves\Being\CollectorMushroomBeing;
use Bga\Games\undertheleaves\Being\DiverPuddleBeing;
use Bga\Games\undertheleaves\Being\ExplorerMushroomBeing;
use Bga\Games\undertheleaves\Being\FriendlyPuddleBeing;
use Bga\Games\undertheleaves\Being\HostMushroomBeing;
use Bga\Games\undertheleaves\Being\LonerMushroomBeing;
use Bga\Games\undertheleaves\Being\ShyPuddleBeing;
use Bga\Games\undertheleaves\Being\SkipperPuddleBeing;
use Bga\Games\undertheleaves\Being\ThoughtfulLeafBeing;
use Bga\Games\undertheleaves\Entities\CardConfig;
use Bga\Games\undertheleaves\Entities\CardType;
use Bga\Games\undertheleaves\Entities\Position;
use Bga\Games\undertheleaves\Entities\Terrain;
use Bga\Games\undertheleaves\Entities\TerrainType;
use Bga\Games\undertheleaves\Entities\TileConfig;

trait Constants
{
    /** @var TileConfig[] $TILE_CONFIGS */
    public array $TILE_CONFIGS;

    /** @var TileConfig[] $INITIAL_TILE_CONFIGS */
    public array $INITIAL_TILE_CONFIGS;

    /** @var CardConfig[] $CARD_CONFIGS */
    public array $CARD_CONFIGS;

    /** @var int[] $REMOVE_TILES */
    public array $REMOVE_TILES;

    public function startConstants()
    {
        $this->INITIAL_TILE_CONFIGS = [
            new TileConfig(
                new Position(0, 0),
                [
                    new Terrain(TerrainType::Puddle),
                    new Terrain(TerrainType::Pink),
                    new Terrain(TerrainType::Purple),
                    new Terrain(TerrainType::Yellow, true),
                ]
            ),
            new TileConfig(
                new Position(0, 1),
                [
                    new Terrain(TerrainType::Puddle),
                    new Terrain(TerrainType::Orange),
                    new Terrain(TerrainType::Yellow),
                    new Terrain(TerrainType::Pink, true),
                ]
            ),
            new TileConfig(
                new Position(0, 2),
                [
                    new Terrain(TerrainType::Puddle),
                    new Terrain(TerrainType::Purple),
                    new Terrain(TerrainType::Pink),
                    new Terrain(TerrainType::Orange, true),
                ]
            ),
            new TileConfig(
                new Position(0, 3),
                [
                    new Terrain(TerrainType::Puddle),
                    new Terrain(TerrainType::Yellow),
                    new Terrain(TerrainType::Orange),
                    new Terrain(TerrainType::Purple, true),
                ]
            ),
        ];

        $this->TILE_CONFIGS = [
            new TileConfig(
                new Position(0, 0),
                [
                    new Terrain(TerrainType::Green, true),
                    new Terrain(TerrainType::Orange),
                    new Terrain(TerrainType::Pink),
                    new Terrain(TerrainType::Pink),
                ]
            ),
            new TileConfig(
                new Position(0, 1),
                [
                    new Terrain(TerrainType::Orange, true),
                    new Terrain(TerrainType::Yellow),
                    new Terrain(TerrainType::Pink),
                    new Terrain(TerrainType::Pink),
                ]
            ),
            new TileConfig(
                new Position(0, 2),
                [
                    new Terrain(TerrainType::Yellow, true),
                    new Terrain(TerrainType::Purple),
                    new Terrain(TerrainType::Pink),
                    new Terrain(TerrainType::Pink),
                ]
            ),
            new TileConfig(
                new Position(0, 3),
                [
                    new Terrain(TerrainType::Orange, true),
                    new Terrain(TerrainType::Purple),
                    new Terrain(TerrainType::Pink),
                    new Terrain(TerrainType::Pink),
                ]
            ),
            new TileConfig(
                new Position(0, 4),
                [
                    new Terrain(TerrainType::Purple, true),
                    new Terrain(TerrainType::Green),
                    new Terrain(TerrainType::Pink),
                    new Terrain(TerrainType::Pink),
                ]
            ),
            new TileConfig(
                new Position(1, 0),
                [
                    new Terrain(TerrainType::Green, true),
                    new Terrain(TerrainType::Yellow),
                    new Terrain(TerrainType::Pink),
                    new Terrain(TerrainType::Pink),
                ]
            ),
            new TileConfig(
                new Position(1, 1),
                [
                    new Terrain(TerrainType::Purple, true),
                    new Terrain(TerrainType::Pink),
                    new Terrain(TerrainType::Yellow),
                    new Terrain(TerrainType::Yellow),
                ]
            ),
            new TileConfig(
                new Position(1, 2),
                [
                    new Terrain(TerrainType::Pink, true),
                    new Terrain(TerrainType::Orange),
                    new Terrain(TerrainType::Yellow),
                    new Terrain(TerrainType::Yellow),
                ]
            ),
            new TileConfig(
                new Position(1, 3),
                [
                    new Terrain(TerrainType::Orange, true),
                    new Terrain(TerrainType::Green),
                    new Terrain(TerrainType::Yellow),
                    new Terrain(TerrainType::Yellow),
                ]
            ),
            new TileConfig(
                new Position(1, 4),
                [
                    new Terrain(TerrainType::Orange, true),
                    new Terrain(TerrainType::Purple),
                    new Terrain(TerrainType::Yellow),
                    new Terrain(TerrainType::Yellow),
                ]
            ),
            new TileConfig(
                new Position(2, 0),
                [
                    new Terrain(TerrainType::Green, true),
                    new Terrain(TerrainType::Purple),
                    new Terrain(TerrainType::Yellow),
                    new Terrain(TerrainType::Yellow),
                ]
            ),
            new TileConfig(
                new Position(2, 1),
                [
                    new Terrain(TerrainType::Pink, true),
                    new Terrain(TerrainType::Green),
                    new Terrain(TerrainType::Yellow),
                    new Terrain(TerrainType::Yellow),
                ]
            ),
            new TileConfig(
                new Position(2, 2),
                [
                    new Terrain(TerrainType::Purple, true),
                    new Terrain(TerrainType::Yellow),
                    new Terrain(TerrainType::Orange),
                    new Terrain(TerrainType::Orange),
                ]
            ),
            new TileConfig(
                new Position(2, 3),
                [
                    new Terrain(TerrainType::Yellow, true),
                    new Terrain(TerrainType::Pink),
                    new Terrain(TerrainType::Orange),
                    new Terrain(TerrainType::Orange),
                ]
            ),
            new TileConfig(
                new Position(2, 4),
                [
                    new Terrain(TerrainType::Pink, true),
                    new Terrain(TerrainType::Green),
                    new Terrain(TerrainType::Orange),
                    new Terrain(TerrainType::Orange),
                ]
            ),
            new TileConfig(
                new Position(3, 0),
                [
                    new Terrain(TerrainType::Purple, true),
                    new Terrain(TerrainType::Pink),
                    new Terrain(TerrainType::Orange),
                    new Terrain(TerrainType::Orange),
                ]
            ),
            new TileConfig(
                new Position(3, 1),
                [
                    new Terrain(TerrainType::Green, true),
                    new Terrain(TerrainType::Yellow),
                    new Terrain(TerrainType::Orange),
                    new Terrain(TerrainType::Orange),
                ]
            ),
            new TileConfig(
                new Position(3, 2),
                [
                    new Terrain(TerrainType::Green, true),
                    new Terrain(TerrainType::Purple),
                    new Terrain(TerrainType::Orange),
                    new Terrain(TerrainType::Orange),
                ]
            ),
            new TileConfig(
                new Position(3, 3),
                [
                    new Terrain(TerrainType::Orange, true),
                    new Terrain(TerrainType::Green),
                    new Terrain(TerrainType::Purple),
                    new Terrain(TerrainType::Purple),
                ]
            ),
            new TileConfig(
                new Position(3, 4),
                [
                    new Terrain(TerrainType::Pink, true),
                    new Terrain(TerrainType::Orange),
                    new Terrain(TerrainType::Purple),
                    new Terrain(TerrainType::Purple),
                ]
            ),
            new TileConfig(
                new Position(4, 0),
                [
                    new Terrain(TerrainType::Pink, true),
                    new Terrain(TerrainType::Yellow),
                    new Terrain(TerrainType::Purple),
                    new Terrain(TerrainType::Purple),
                ]
            ),
            new TileConfig(
                new Position(4, 1),
                [
                    new Terrain(TerrainType::Yellow, true),
                    new Terrain(TerrainType::Orange),
                    new Terrain(TerrainType::Purple),
                    new Terrain(TerrainType::Purple),
                ]
            ),
            new TileConfig(
                new Position(4, 2),
                [
                    new Terrain(TerrainType::Yellow, true),
                    new Terrain(TerrainType::Green),
                    new Terrain(TerrainType::Purple),
                    new Terrain(TerrainType::Purple),
                ]
            ),
            new TileConfig(
                new Position(4, 3),
                [
                    new Terrain(TerrainType::Green, true),
                    new Terrain(TerrainType::Pink),
                    new Terrain(TerrainType::Purple),
                    new Terrain(TerrainType::Purple),
                ]
            ),
            new TileConfig(
                new Position(4, 4),
                [
                    new Terrain(TerrainType::Purple, true),
                    new Terrain(TerrainType::Orange),
                    new Terrain(TerrainType::Green),
                    new Terrain(TerrainType::Green),
                ]
            ),
            new TileConfig(
                new Position(5, 0),
                [
                    new Terrain(TerrainType::Orange, true),
                    new Terrain(TerrainType::Pink),
                    new Terrain(TerrainType::Green),
                    new Terrain(TerrainType::Green),
                ]
            ),
            new TileConfig(
                new Position(5, 1),
                [
                    new Terrain(TerrainType::Yellow, true),
                    new Terrain(TerrainType::Pink),
                    new Terrain(TerrainType::Green),
                    new Terrain(TerrainType::Green),
                ]
            ),
            new TileConfig(
                new Position(5, 2),
                [
                    new Terrain(TerrainType::Yellow, true),
                    new Terrain(TerrainType::Orange),
                    new Terrain(TerrainType::Green),
                    new Terrain(TerrainType::Green),
                ]
            ),
            new TileConfig(
                new Position(5, 3),
                [
                    new Terrain(TerrainType::Purple, true),
                    new Terrain(TerrainType::Yellow),
                    new Terrain(TerrainType::Green),
                    new Terrain(TerrainType::Green),
                ]
            ),
            new TileConfig(
                new Position(5, 4),
                [
                    new Terrain(TerrainType::Pink, true),
                    new Terrain(TerrainType::Purple),
                    new Terrain(TerrainType::Green),
                    new Terrain(TerrainType::Green),
                ]
            ),
            new TileConfig(
                new Position(6, 0),
                [
                    new Terrain(TerrainType::Puddle),
                    new Terrain(TerrainType::Orange),
                    new Terrain(TerrainType::Pink),
                    new Terrain(TerrainType::Pink),
                ]
            ),
            new TileConfig(
                new Position(6, 1),
                [
                    new Terrain(TerrainType::Puddle),
                    new Terrain(TerrainType::Yellow),
                    new Terrain(TerrainType::Pink),
                    new Terrain(TerrainType::Pink),
                ]
            ),
            new TileConfig(
                new Position(6, 2),
                [
                    new Terrain(TerrainType::Puddle),
                    new Terrain(TerrainType::Green),
                    new Terrain(TerrainType::Pink),
                    new Terrain(TerrainType::Pink),
                ]
            ),
            new TileConfig(
                new Position(6, 3),
                [
                    new Terrain(TerrainType::Puddle),
                    new Terrain(TerrainType::Purple),
                    new Terrain(TerrainType::Pink),
                    new Terrain(TerrainType::Pink),
                ]
            ),
            new TileConfig(
                new Position(6, 4),
                [
                    new Terrain(TerrainType::Puddle),
                    new Terrain(TerrainType::Yellow),
                    new Terrain(TerrainType::Orange),
                    new Terrain(TerrainType::Orange),
                ]
            ),
            new TileConfig(
                new Position(7, 0),
                [
                    new Terrain(TerrainType::Puddle),
                    new Terrain(TerrainType::Purple),
                    new Terrain(TerrainType::Orange),
                    new Terrain(TerrainType::Orange),
                ]
            ),
            new TileConfig(
                new Position(7, 1),
                [
                    new Terrain(TerrainType::Puddle),
                    new Terrain(TerrainType::Green),
                    new Terrain(TerrainType::Orange),
                    new Terrain(TerrainType::Orange),
                ]
            ),
            new TileConfig(
                new Position(7, 2),
                [
                    new Terrain(TerrainType::Puddle),
                    new Terrain(TerrainType::Pink),
                    new Terrain(TerrainType::Orange),
                    new Terrain(TerrainType::Orange),
                ]
            ),
            new TileConfig(
                new Position(7, 3),
                [
                    new Terrain(TerrainType::Puddle),
                    new Terrain(TerrainType::Orange),
                    new Terrain(TerrainType::Yellow),
                    new Terrain(TerrainType::Yellow),
                ]
            ),
            new TileConfig(
                new Position(7, 4),
                [
                    new Terrain(TerrainType::Puddle),
                    new Terrain(TerrainType::Pink),
                    new Terrain(TerrainType::Yellow),
                    new Terrain(TerrainType::Yellow),
                ]
            ),
            new TileConfig(
                new Position(8, 0),
                [
                    new Terrain(TerrainType::Puddle),
                    new Terrain(TerrainType::Purple),
                    new Terrain(TerrainType::Yellow),
                    new Terrain(TerrainType::Yellow),
                ]
            ),
            new TileConfig(
                new Position(8, 1),
                [
                    new Terrain(TerrainType::Puddle),
                    new Terrain(TerrainType::Green),
                    new Terrain(TerrainType::Yellow),
                    new Terrain(TerrainType::Yellow),
                ]
            ),
            new TileConfig(
                new Position(8, 2),
                [
                    new Terrain(TerrainType::Puddle),
                    new Terrain(TerrainType::Orange),
                    new Terrain(TerrainType::Purple),
                    new Terrain(TerrainType::Purple),
                ]
            ),
            new TileConfig(
                new Position(8, 3),
                [
                    new Terrain(TerrainType::Puddle),
                    new Terrain(TerrainType::Yellow),
                    new Terrain(TerrainType::Purple),
                    new Terrain(TerrainType::Purple),
                ]
            ),
            new TileConfig(
                new Position(8, 4),
                [
                    new Terrain(TerrainType::Puddle),
                    new Terrain(TerrainType::Green),
                    new Terrain(TerrainType::Purple),
                    new Terrain(TerrainType::Purple),
                ]
            ),
            new TileConfig(
                new Position(9, 0),
                [
                    new Terrain(TerrainType::Puddle),
                    new Terrain(TerrainType::Pink),
                    new Terrain(TerrainType::Purple),
                    new Terrain(TerrainType::Purple),
                ]
            ),
            new TileConfig(
                new Position(9, 1),
                [
                    new Terrain(TerrainType::Puddle),
                    new Terrain(TerrainType::Pink),
                    new Terrain(TerrainType::Green),
                    new Terrain(TerrainType::Green),
                ]
            ),
            new TileConfig(
                new Position(9, 2),
                [
                    new Terrain(TerrainType::Puddle),
                    new Terrain(TerrainType::Orange),
                    new Terrain(TerrainType::Green),
                    new Terrain(TerrainType::Green),
                ]
            ),
            new TileConfig(
                new Position(9, 3),
                [
                    new Terrain(TerrainType::Puddle),
                    new Terrain(TerrainType::Yellow),
                    new Terrain(TerrainType::Green),
                    new Terrain(TerrainType::Green),
                ]
            ),
            new TileConfig(
                new Position(9, 3),
                [
                    new Terrain(TerrainType::Puddle),
                    new Terrain(TerrainType::Yellow),
                    new Terrain(TerrainType::Green),
                    new Terrain(TerrainType::Green),
                ]
            ),
        ];

        $this->CARD_CONFIGS = [
            new CardConfig(
                new Position(0, 0),
                CardType::Leaf,
                clienttranslate('Thoughtful'),
                clienttranslate('If a pollinized sector has four terrain spaces arranged in a square, it will attract a leaf dweller. Place its piece in the center of the square. You cannot use any of these four spaces to attract any other leaf dweller.'),
                true,
                dweller: new ThoughtfulLeafBeing(),
            ),
            new CardConfig(
                new Position(0, 1),
                CardType::Leaf,
                clienttranslate('Restless'),
                clienttranslate('If you have a pollinized sector of at least 5 terrain spaces, it will attract a leaf dweller. Place its piece anywhere within the sector.')
            ),
            new CardConfig(
                new Position(0, 2),
                CardType::Leaf,
                clienttranslate('Flirty'),
                clienttranslate('If you have 4 terrain spaces that are differently colored and/or a puddle, it will attract a leaf dweller. Place the dweller in the center of the four spaces. You cannot use any of these four spaces to attract any other leaf dweller.')
            ),
            new CardConfig(
                new Position(0, 3),
                CardType::Leaf,
                clienttranslate('Runner'),
                clienttranslate('If you have a pollinized sector with 4 terrain spaces in a row vertically or horizontally, it will attract a leaf dweller. Place its piece anywhere on the sector.')
            ),
            new CardConfig(
                new Position(1, 0),
                CardType::Mushroom,
                clienttranslate('Host'),
                clienttranslate('If a sector has at least 2 mushrooms, it attracts a mushroom dweller. The sector does not need to be pollinized. Place its piece anywhere on the sector.'),
                true,
                dweller: new HostMushroomBeing(),
            ),
            new CardConfig(
                new Position(1, 1),
                CardType::Mushroom,
                clienttranslate('Explorer'),
                clienttranslate('If you make a line that contains 3 mushrooms, regardless of the distance between each of them, it will attract a mushroom dweller. Put the mushroom dweller piece on the mushroom in the middle. The mushrooms can be on any type of terrain and at any distance from one another. You can attract another mushroom dweller with the mushrooms that do not have a mushroom dweller piece on them if you again fulfil this requirement with the placement of a new garden tile.'),
                dweller: new ExplorerMushroomBeing(),
            ),
            new CardConfig(
                new Position(1, 2),
                CardType::Mushroom,
                clienttranslate('Collector'),
                clienttranslate('If you form a diagonal of 2 spaces that contain mushrooms, it will attract a mushroom dweller. Place the dweller piece on one of the two the mushrooms. The mushroom that doesn’t have the dweller piece can be used again to atract a new dweller if you again fulfil this requirement with the placement of a new garden tile.'),
                dweller: new CollectorMushroomBeing(),
            ),
            new CardConfig(
                new Position(1, 3),
                CardType::Mushroom,
                clienttranslate('Loner'),
                clienttranslate('If you surround a terrain space that contains a mushroom with eight spaces of any type that do not have any mushrooms in them, it will attract a mushroom dweller. Place the dweller piece on the mushroom.'),
                dweller: new LonerMushroomBeing(),
            ),
            new CardConfig(
                new Position(2, 0),
                CardType::Puddle,
                clienttranslate('Diver'),
                clienttranslate('If you create a puddle of 2 or more spaces, it will attract a puddle dweller. No new dwellers will be attracted if the puddle grows in later turns.'),
                firstGame: true,
                dweller: new DiverPuddleBeing(),
            ),
            new CardConfig(
                new Position(2, 1),
                CardType::Puddle,
                clienttranslate('Skipper'),
                clienttranslate('If you align 2 puddles with one terrain space (not puddle) between them, it will attract a puddle dweller. Place its piece in that terrain space. You can attract more dwellers using the existing puddles if the condition is fulfilled again by adding a new tile.'),
                dweller: new SkipperPuddleBeing(),
            ),
            new CardConfig(
                new Position(2, 2),
                CardType::Puddle,
                clienttranslate('Friendly'),
                clienttranslate('If you create a diagonal using 2 puddles, it will attract a puddle dweller. Place its piece in one of the two puddle spaces. The puddle that remains empty can be used to attract another dweller if the condition is fulfilled again with the placement of a new tile in a later turn.'),
                dweller: new FriendlyPuddleBeing(),
            ),
            new CardConfig(
                new Position(2, 3),
                CardType::Puddle,
                clienttranslate('Shy'),
                clienttranslate('If you surround a puddle space with eight terrain spaces of any type (not puddles), it will attract a puddle dweller. Place the dweller piece on the puddle.'),
                dweller: new ShyPuddleBeing(),
            ),
        ];

        $this->REMOVE_TILES = [4 => 0, 3 => 12, 2 => 24];
    }
}
