<?php

declare(strict_types=1);

namespace Bga\Games\undertheleaves\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\GameFramework\States\PossibleAction;
use Bga\GameFramework\SystemException;
use Bga\Games\undertheleaves\Entities\Messages;
use Bga\Games\undertheleaves\Game;
use Bga\Games\undertheleaves\Services\SectorService;
use Bga\Games\undertheleaves\States\EndScore;
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

        // Flirty ('leaf') pending groups are whole 2x2 squares and can overlap each other
        // on shared spaces, so they must be identified by their unique anchor cell (the
        // square's top-left corner, always index 0) instead of "any cell matches" — a
        // shared space would otherwise make the match ambiguous. Puddle/mushroom pairs
        // have no such overlap issue: the clicked cell IS the space being chosen.
        $selectedGroupIndex = null;
        if ($beingType === 'leaf') {
            foreach ($pending[$beingType] as $i => $group) {
                if ($group[0][0] === $x && $group[0][1] === $y) {
                    $selectedGroupIndex = $i;
                    break;
                }
            }
        } else {
            foreach ($pending[$beingType] as $i => $group) {
                foreach ($group as $cell) {
                    if ($cell[0] === $x && $cell[1] === $y) {
                        $selectedGroupIndex = $i;
                        break 2;
                    }
                }
            }
        }

        if ($selectedGroupIndex === null) {
            throw new SystemException(Messages::$InvalidPosition);
        }

        $selectedGroup = $pending[$beingType][$selectedGroupIndex];
        array_splice($pending[$beingType], $selectedGroupIndex, 1);

        // A Flirty square consumes all 4 of its spaces, so any other pending square sharing
        // one of them can no longer attract a leaf dweller. Squares left with no conflict are
        // no longer a choice and get placed right away.
        $unambiguousSquares = [];

        if ($beingType === 'leaf') {
            $consumedKeys = $this->squareKeys($selectedGroup);

            $remaining = array_values(array_filter(
                $pending[$beingType],
                fn($group) => !array_intersect($consumedKeys, $this->squareKeys($group)),
            ));

            $pending[$beingType] = [];
            foreach ($remaining as $i => $square) {
                if ($this->conflictsWithOthers($square, $remaining, $i)) {
                    $pending[$beingType][] = $square;
                } else {
                    $unambiguousSquares[] = $square;
                }
            }
        }

        if (empty($pending[$beingType])) {
            unset($pending[$beingType]);
        }

        $this->game->globals->set('pending:beings', $pending);

        $dweller = $this->game->cardService->list()[$beingType]->dweller->setGame($this->game);
        $dweller->endProcess($playerId, [[$x, $y]], $selectedGroup);

        foreach ($unambiguousSquares as $square) {
            $dweller->endProcess($playerId, [$square[0]], $square);
        }

        $hasPending = !empty(array_filter($pending, fn($v) => !empty($v)));

        if ($hasPending) {
            return ChooseBeing::class;
        }

        if ($this->game->getGameStateValue('visibleScore') == 2) {
            (new EndScore($this->game))->computeAndUpdateScores();
        }

        return NextPlayer::class;
    }

    #[PossibleAction]
    function actChooseBeingRestart()
    {
        $this->game->undoRestorePoint();
    }

    function zombie(int $playerId): string
    {
        $pending = array_filter($this->game->globals->get('pending:beings', []), fn($v) => !empty($v));

        if (empty($pending)) {
            return NextPlayer::class;
        }

        $beingType = array_key_first($pending);
        [$x, $y] = $pending[$beingType][0][0];

        return $this->actChooseBeing($beingType, $x, $y);
    }

    private function squareKeys(array $square): array
    {
        return array_map(fn($c) => SectorService::coordinatesToCellKey($c), $square);
    }

    private function conflictsWithOthers(array $square, array $squares, int $index): bool
    {
        foreach ($squares as $i => $other) {
            if ($i !== $index && array_intersect($this->squareKeys($square), $this->squareKeys($other))) {
                return true;
            }
        }

        return false;
    }
}
