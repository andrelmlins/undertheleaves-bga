<?php

namespace Bga\Games\undertheleaves;

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
    }
}
