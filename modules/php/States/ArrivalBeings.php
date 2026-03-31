<?php

declare(strict_types=1);

namespace Bga\Games\undertheleaves\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\Games\undertheleaves\Being\BeeBeing;
use Bga\Games\undertheleaves\Being\HummingbirdBeing;
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

    public function onEnteringState(int $activePlayerId)
    {
        $this->game->globals->set('pending:beings', []);

        (new BeeBeing($this->game))->process($activePlayerId);
        (new HummingbirdBeing($this->game))->process($activePlayerId);

        $puddleCard = $this->game->cardService->list()['puddle'];
        $puddleCard->dweller->setGame($this->game)->process($activePlayerId);

        $mushroomCard = $this->game->cardService->list()['mushroom'];
        $mushroomCard->dweller->setGame($this->game)->process($activePlayerId);

        $leafCard = $this->game->cardService->list()['leaf'];
        if ($leafCard?->dweller !== null) {
            $leafCard->dweller->setGame($this->game)->process($activePlayerId);
        }

        if ($this->game->getGameStateValue('visibleScore') == 2) {
            (new EndScore($this->game))->computeAndUpdateScores();
        }

        $pending = $this->game->globals->get('pending:beings', []);
        $hasPending = !empty(array_filter($pending, fn($v) => !empty($v)));

        if ($hasPending) {
            $player = $this->game->loadPlayersBasicInfos()[$activePlayerId];
            $isZombie = ($player['player_zombie'] == 1);

            if (!$isZombie) {
                $this->game->undoSavepoint();
            }

            return ChooseBeing::class;
        }

        return NextPlayer::class;
    }
}
