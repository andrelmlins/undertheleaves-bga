<?php

declare(strict_types=1);

namespace Bga\Games\undertheleaves\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\GameFramework\States\PossibleAction;
use Bga\GameFramework\SystemException;
use Bga\Games\undertheleaves\Entities\Messages;
use Bga\Games\undertheleaves\Game;
use Bga\Games\undertheleaves\States\NextPlayer;

class ChooseBeing extends GameState
{
    function __construct(protected Game $game)
    {
        parent::__construct(
            $game,
            id: 12,
            type: StateType::ACTIVE_PLAYER,
            description: clienttranslate('${actplayer} must choose a dweller'),
            descriptionMyTurn: clienttranslate('${you} must choose a dweller'),
        );
    }

    public function getArgs(): array
    {
        $beings = $this->game->globals->get('pending:beings', []);

        return ['beings' => $beings];
    }

    #[PossibleAction]
    public function actChooseBeing(string $beingType, int $x, int $y): string
    {
        $playerId = (int)$this->game->getActivePlayerId();
        $pending = $this->game->globals->get('pending:beings', []);

        if (!isset($pending[$beingType])) {
            throw new SystemException(Messages::$InvalidPosition);
        }

        $selectedGroupIndex = null;
        foreach ($pending[$beingType] as $i => $group) {
            foreach ($group as $cell) {
                if ($cell[0] === $x && $cell[1] === $y) {
                    $selectedGroupIndex = $i;
                    break 2;
                }
            }
        }

        if ($selectedGroupIndex === null) {
            throw new SystemException(Messages::$InvalidPosition);
        }

        array_splice($pending[$beingType], $selectedGroupIndex, 1);
        if (empty($pending[$beingType])) {
            unset($pending[$beingType]);
        }

        $this->game->globals->set('pending:beings', $pending);

        $this->game->cardService->list()[$beingType]->dweller?->setGame($this->game)->endProcess($playerId, [[$x, $y]]);

        $hasPending = !empty(array_filter($pending, fn($v) => !empty($v)));

        if ($hasPending) {
            return ChooseBeing::class;
        }

        return NextPlayer::class;
    }

    #[PossibleAction]
    function actChooseBeingRestart()
    {
        $this->game->undoRestorePoint();
    }

    function zombie()
    {
        //
    }
}
