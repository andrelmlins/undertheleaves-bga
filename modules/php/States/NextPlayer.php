<?php

declare(strict_types=1);

namespace Bga\Games\undertheleaves\States;

use Bga\GameFramework\States\GameState;
use Bga\GameFramework\StateType;
use Bga\Games\undertheleaves\Entities\CardLocation;
use Bga\Games\undertheleaves\Entities\Messages;
use Bga\Games\undertheleaves\Game;

class NextPlayer extends GameState
{
    function __construct(protected Game $game)
    {
        parent::__construct(
            $game,
            id: 90,
            type: StateType::GAME,
            updateGameProgression: true,
        );
    }

    function onEnteringState(int $activePlayerId)
    {
        $this->game->giveExtraTime($activePlayerId);

        $tile = $this->game->tiles->pickCardForLocation(CardLocation::Deck->value, CardLocation::Table->value);

        $this->game->notify->all('revealTile', Messages::$RevealTile, [
            'player_name' => $this->game->getPlayerNameById($activePlayerId),
            'tile_image' => $tile,
            'playerId' => $activePlayerId,
            'tile' => $tile,
        ]);
        $this->game->notify->all('simplePause', '', ['time' => 1000]);

        $this->game->activeNextPlayer();

        $gameEnd = false;
        if ($gameEnd) {
            return EndScore::class;
        } else {
            return PlaceTile::class;
        }
    }
}
