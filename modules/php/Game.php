<?php

/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * undertheleaves implementation : © André Lins andrelumlins@gmail.com
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * Game.php
 *
 * This is the main file for your game logic.
 *
 * In this PHP file, you are going to defines the rules of the game.
 */

declare(strict_types=1);

namespace Bga\Games\undertheleaves;

use Bga\GameFramework\Components\Deck;
use Bga\Games\undertheleaves\Entities\CardLocation;
use Bga\Games\undertheleaves\Entities\Messages;
use Bga\Games\undertheleaves\Services\CardService;
use Bga\Games\undertheleaves\Services\TileService;
use Bga\Games\undertheleaves\Services\BeingService;
use Bga\Games\undertheleaves\States\PlaceTile;

class Game extends \Bga\GameFramework\Table
{
    use Constants;

    public TileService $tileService;
    public CardService $cardService;
    public BeingService $beingService;

    public Deck $tiles;

    public function __construct()
    {
        parent::__construct();
        $this->initGameStateLabels(['initialCards' => 100, 'visibleScore' => 101]);

        Messages::initMessages();
        $this->startConstants();

        $this->tileService = new TileService($this);
        $this->cardService = new CardService($this);
        $this->beingService = new BeingService($this);

        $this->tiles = $this->deckFactory->createDeck('tile');
    }

    public function getGameProgression()
    {
        $players = $this->loadPlayersBasicInfos();
        $playerCount = count($players);

        $current = $this->tiles->countCardsInLocation(CardLocation::Grid->value) - $playerCount;
        $total = 12 * $playerCount;

        return round((100 * $current) / $total);
    }

    /**
     * Migrate database.
     *
     * You don't have to care about this until your game has been published on BGA. Once your game is on BGA, this
     * method is called everytime the system detects a game running with your old database scheme. In this case, if you
     * change your database scheme, you just have to apply the needed changes in order to update the game database and
     * allow the game to continue to run with your new version.
     *
     * @param int $from_version
     * @return void
     */
    public function upgradeTableDb($from_version)
    {
        //       if ($from_version <= 1404301345)
        //       {
        //            // ! important ! Use `DBPREFIX_<table_name>` for all tables
        //
        //            $sql = "ALTER TABLE `DBPREFIX_xxxxxxx` ....";
        //            $this->applyDbUpgradeToAllDB( $sql );
        //       }
        //
        //       if ($from_version <= 1405061421)
        //       {
        //            // ! important ! Use `DBPREFIX_<table_name>` for all tables
        //
        //            $sql = "CREATE TABLE `DBPREFIX_xxxxxxx` ....";
        //            $this->applyDbUpgradeToAllDB( $sql );
        //       }
    }

    protected function getAllDatas(int $currentPlayerId): array
    {
        $result = [];

        $result["players"] = $this->getCollectionFromDb("SELECT `player_id` AS `id`, `player_score` AS `score` FROM `player`");
        $result["tableTiles"] = $this->tiles->getCardsInLocation(CardLocation::Table->value);
        $result["tileConfigs"] = $this->TILE_CONFIGS;
        $result["initialTileConfigs"] = $this->INITIAL_TILE_CONFIGS;
        $result["gridTiles"] = $this->tileService->listAllTiles();
        $result["countDeckTiles"] = (int)$this->tiles->countCardsInLocation(CardLocation::Deck->value);
        $result["cards"] = $this->cardService->list();
        $result["beings"] = $this->beingService->getAllBeings();

        return $result;
    }

    protected function setupNewGame($players, $options = [])
    {
        $gameinfos = $this->getGameinfos();
        $default_colors = $gameinfos['player_colors'];

        foreach ($players as $player_id => $player) {
            $query_values[] = vsprintf("(%s, '%s', '%s')", [
                $player_id,
                array_shift($default_colors),
                addslashes($player["player_name"]),
            ]);
        }

        static::DbQuery(
            sprintf(
                "INSERT INTO `player` (`player_id`, `player_color`, `player_name`) VALUES %s",
                implode(",", $query_values)
            )
        );

        $this->reattributeColorsBasedOnPreferences($players, $gameinfos["player_colors"]);
        $this->reloadPlayersBasicInfos();

        $this->tileService->setup();
        $this->cardService->setup();

        $this->activeNextPlayer();

        return PlaceTile::class;
    }

    public function debug_goToState(int $state = 3)
    {
        $this->gamestate->jumpToState($state);
    }

    public function debug_playOneMove()
    {
        $this->bga->debug->playUntil(fn(int $count) => $count == 1);
    }
}
