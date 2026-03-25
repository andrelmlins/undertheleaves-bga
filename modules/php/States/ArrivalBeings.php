<?php

declare(strict_types=1);

namespace Bga\Games\undertheleaves\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\Games\undertheleaves\Being\BeeBeing;
use Bga\Games\undertheleaves\Being\HummingbirdBeing;
use Bga\Games\undertheleaves\Entities\GridTile;
use Bga\Games\undertheleaves\Game;

class ArrivalBeings extends GameState
{
    function __construct(protected Game $game)
    {
        parent::__construct(
            $game,
            id: 11,
            type: StateType::GAME,
            description: clienttranslate('Processing arrival of beings'),
        );
    }

    public function onEnteringState()
    {
        $playerId = (int)$this->game->getActivePlayerId();

        (new BeeBeing($this->game))->process($playerId);
        (new HummingbirdBeing($this->game))->process($playerId);

        $puddleCard = $this->game->cardService->list()['puddle'];
        $puddleCard->dweller?->setGame($this->game)->process($playerId);

        if ($this->game->getGameStateValue('visibleScore') == 2) {
            (new EndScore($this->game))->computeAndUpdateScores();
        }

        return NextPlayer::class;
    }
}
