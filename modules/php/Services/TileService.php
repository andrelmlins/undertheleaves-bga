<?php

namespace Bga\Games\undertheleaves\Services;

use Bga\Games\undertheleaves\Entities\CardLocation;
use Bga\Games\undertheleaves\Entities\GridTile;
use Bga\Games\undertheleaves\Game;

class TileService
{
    public function __construct(public Game $game) {}

    public function setup()
    {
        $players = $this->game->loadPlayersBasicInfos();

        foreach ($this->game->TILE_CONFIGS as $tileConfig) {
            $tiles[] = [
                'type' => 'normal',
                'type_arg' => $tileConfig->position->typeArg(),
                'nbr' => 1
            ];
        }

        $this->game->tiles->createCards($tiles, CardLocation::Deck->value);
        $this->game->tiles->shuffle(CardLocation::Deck->value);
        $this->game->tiles->pickCardsForLocation($this->game->REMOVE_TILES[count($players)], CardLocation::Deck->value, CardLocation::Discard->value);
        $this->game->tiles->pickCardsForLocation(3, CardLocation::Deck->value, CardLocation::Table->value);

        $initialTiles = [];

        foreach ($this->game->INITIAL_TILE_CONFIGS as $tileConfig) {
            $initialTiles[] = [
                'type' => 'initial',
                'type_arg' => $tileConfig->position->typeArg(),
                'nbr' => 1
            ];
        }

        $this->game->tiles->createCards($initialTiles, CardLocation::InitialDeck->value);
        $this->game->tiles->shuffle(CardLocation::InitialDeck->value);

        foreach ($players as $player) {
            $card = $this->game->tiles->pickCardForLocation(CardLocation::InitialDeck->value, CardLocation::Grid->value, $player['player_id']);
            $this->insert(new GridTile(
                x: 0,
                y: 0,
                playerId: $player['player_id'],
                rotation: 0,
                side: 0,
                tile: $card
            ));
        }
    }

    public function formatGridTile(array $item)
    {
        return new GridTile(
            x: intval($item['tile_x']),
            y: intval($item['tile_y']),
            playerId: intval($item['tile_player_id']),
            rotation: intval($item['tile_rotation']),
            side: intval($item['tile_side']),
            tile: $this->game->tiles->getCard(intval($item['tile_card_id'])),
        );
    }

    public function insert(GridTile $gridTile)
    {
        $sql = "INSERT INTO grid_tile (tile_x, tile_y, tile_player_id, tile_rotation, tile_side, tile_card_id) VALUES ('%s', '%s', '%s', '%s', '%s', '%s')";

        $this->game->DbQuery(sprintf(
            $sql,
            $gridTile->x,
            $gridTile->y,
            $gridTile->playerId,
            $gridTile->rotation,
            $gridTile->side,
            $gridTile->tile['id']
        ));
    }

    public function listPlayerTiles(int $playerId)
    {
        $sql = "SELECT * FROM grid_tile WHERE tile_player_id = '%s'";
        $list = $this->game->getObjectListFromDB(sprintf($sql, $playerId));

        $result = [];

        foreach ($list as $item) {
            $result[] = $this->formatGridTile($item);
        }

        return $result;
    }

    public function listAllTiles()
    {
        $players = $this->game->loadPlayersBasicInfos();
        $result = [];

        foreach ($players as $player) {
            $result[$player['player_id']] = $this->listPlayerTiles($player['player_id']);
        }

        return $result;
    }

    public function getByPosition(int $x, int $y, int $playerId)
    {
        $sql = "SELECT * FROM grid_tile WHERE tile_player_id = '%s' AND tile_x = '%s' AND tile_y = '%s'";
        $item = $this->game->getObjectFromDB(sprintf($sql, $playerId, $x, $y));

        if (is_null($item)) return null;

        return $this->formatGridTile($item);
    }

    public function getExternalPositions(int $playerId)
    {
        $tiles = $this->listPlayerTiles($playerId);
        $dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

        $tileMap = [];
        foreach ($tiles as $t) {
            $key = $t->x . ',' . $t->y;
            $tileMap[$key] = true;
        }

        $externalsMap = [];
        foreach ($tiles as $tile) {
            foreach ($dirs as $dir) {
                $dx = $dir[0];
                $dy = $dir[1];

                $x = $tile->x + $dx;
                $y = $tile->y + $dy;

                $key = $x . ',' . $y;

                if (!isset($tileMap[$key])) {
                    $tileMap[$key] = true;
                    $externalsMap[] = ['x' => $x, 'y' => $y];
                }
            }
        }

        return $externalsMap;
    }
}
