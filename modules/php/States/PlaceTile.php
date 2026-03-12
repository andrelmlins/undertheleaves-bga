<?php

declare(strict_types=1);

namespace Bga\Games\undertheleaves\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\GameFramework\States\PossibleAction;
use Bga\GameFramework\SystemException;
use Bga\Games\undertheleaves\Entities\CardLocation;
use Bga\Games\undertheleaves\Entities\GridTile;
use Bga\Games\undertheleaves\Entities\Messages;
use Bga\Games\undertheleaves\Game;

class PlaceTile extends GameState
{
    function __construct(protected Game $game)
    {
        parent::__construct(
            $game,
            id: 10,
            type: StateType::ACTIVE_PLAYER,
            description: clienttranslate('${actplayer} must place a garden tile'),
            descriptionMyTurn: clienttranslate('${you} must place a garden tile'),
        );
    }

    public function getArgs(int $activePlayerId): array
    {
        return [
            'tableTiles' => $this->game->tileService->listPlayerTiles($activePlayerId)
        ];
    }

    #[PossibleAction]
    public function actPlaceTile(int $tileId, int $x, int $y, int $rotation, bool $inverse)
    {
        $activePlayerId = (int)$this->game->getActivePlayerId();
        $existentTileInPosition = $this->game->tileService->getByPosition($x, $y, $activePlayerId);
        $tile = $this->game->tiles->getCard($tileId);
        $validRotations = [0, 90, 180, 270];
        $externals = $this->game->tileService->getExternalPositions($activePlayerId);

        if (!is_null($existentTileInPosition)) {
            throw new SystemException(Messages::$InvalidPosition);
        }

        if (is_null($tile) || $tile['location'] != CardLocation::Table->value) {
            throw new SystemException(Messages::$InvalidTile);
        }

        if (!in_array($rotation, $validRotations)) {
            throw new SystemException(Messages::$InvalidPosition);
        }

        if (!in_array(['x' => $x, 'y' => $y], $externals)) {
            throw new SystemException(Messages::$InvalidPosition);
        }

        $gridTile = new GridTile($x, $y, $activePlayerId, $rotation, $inverse ? 1 : 0, $tile);

        $this->game->tileService->insert($gridTile);
        $this->game->tiles->moveCard($tileId, CardLocation::Grid->value, $activePlayerId);

        $this->game->notify->all('placeTile', Messages::$PlaceTile, [
            'player_name' => $this->game->getPlayerNameById($activePlayerId),
            'tile_image' => $tile,
            'playerId' => $activePlayerId,
            'tile' => $tile,
        ]);
        $this->game->notify->all('simplePause', '', ['time' => 1000]);

        return NextPlayer::class;
    }

    function zombie(int $playerId)
    {
        $tiles = $this->game->tiles->getCardsInLocation(CardLocation::Table->value);
        $externals = $this->game->tileService->getExternalPositions($playerId);

        return $this->actPlaceTile(array_key_first($tiles), $externals[0]['x'], $externals[0]['y'], 90, false);
    }
}
