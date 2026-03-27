<?php

declare(strict_types=1);

namespace Bga\Games\undertheleaves\States;

use Bga\GameFramework\NotificationMessage;
use Bga\GameFramework\StateType;
use Bga\Games\undertheleaves\Entities\Being;
use Bga\Games\undertheleaves\Game;

const ST_END_GAME = 99;

class EndScore extends \Bga\GameFramework\States\GameState
{
    function __construct(protected Game $game)
    {
        parent::__construct(
            $game,
            id: 98,
            type: StateType::GAME,
        );
    }

    public function onEnteringState()
    {
        $this->computeAndUpdateScores(withMajority: true);

        if ($this->game->getGameStateValue('visibleScore') == 1) {
            $players = $this->game->loadPlayersBasicInfos();
            foreach ($players as $player) {
                $this->game->notify->all('score', '', [
                    'player_id' => (int)$player['player_id'],
                    'player_score' => (int)$player['player_score'],
                ]);
            }
        }

        return ST_END_GAME;
    }

    public function computeAndUpdateScores(bool $withMajority = false): void
    {
        $players = $this->game->loadPlayersBasicInfos();
        $totals = $this->game->beingService->getTotalsByPlayer();

        $dwellerTypes = ['leaf', 'mushroom', 'puddle'];

        if ($withMajority) {
            foreach ($dwellerTypes as $type) {
                $counts = [];

                foreach ($players as $player) {
                    $playerId = (int)$player['player_id'];
                    $counts[$playerId] = $totals[$playerId][$type] ?? 0;
                }

                $max = max($counts);

                if ($max > 0) {
                    foreach ($counts as $playerId => $count) {
                        if ($count === $max) {
                            $existingGroups = $this->game->beingService->getBeingsByType($playerId, $type);
                            usort($existingGroups, fn($a, $b) => $a->count - $b->count);
                            $targetGroup = $existingGroups[0];

                            $bonus = new Being(
                                playerId: $playerId,
                                type: $type,
                                cells: $targetGroup->cells,
                                count: 2,
                                x: $targetGroup->x,
                                y: $targetGroup->y,
                            );
                            $this->game->beingService->addBeing($bonus);
                            $this->game->notify->all('majorityBonus', '${player_name} receives 2 ${being_icon} for majority', [
                                'player_name' => $this->game->getPlayerNameById($playerId),
                                'playerId' => $playerId,
                                'type' => $type,
                                'count' => 2,
                                'being_icon' => str_replace('_dweller', '', $type),
                                'cells' => $targetGroup->cells,
                            ]);
                        }
                    }
                }
            }
            $this->game->notify->all('simplePause', '', ['time' => 1000]);

            $totals = $this->game->beingService->getTotalsByPlayer();
        }

        foreach ($players as $player) {
            $playerId = (int)$player['player_id'];
            $playerTotals = $totals[$playerId] ?? [];

            $bees = $playerTotals['bee'] ?? 0;
            $hummingbirds = $playerTotals['hummingbird'] ?? 0;
            $leaf = $playerTotals['leaf'] ?? 0;
            $mushroom = $playerTotals['mushroom'] ?? 0;
            $puddle = $playerTotals['puddle'] ?? 0;

            $score = $bees + $hummingbirds + $leaf + $mushroom + $puddle;
            $scoreAux = $hummingbirds * 10000 + $bees;

            $message = $this->game->getGameStateValue('visibleScore') == 2 ? new NotificationMessage() : null;

            $this->game->bga->playerScore->set($playerId, $score, $message);
            $this->game->bga->playerScoreAux->set($playerId, $scoreAux);
        }
    }
}
