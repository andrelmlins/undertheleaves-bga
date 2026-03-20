<?php

declare(strict_types=1);

namespace Bga\Games\undertheleaves\Services;

use Bga\Games\undertheleaves\Entities\Being;
use Bga\Games\undertheleaves\Game;

class BeingService
{
    public function __construct(public Game $game) {}

    public function addBeing(int $playerId, string $type, array $cellKeys, ?string $color = null, int $count = 1): void
    {
        $cellsJson = json_encode(array_map(fn($key) => SectorService::cellKeyToCoordinates($key), $cellKeys));

        $sql = "INSERT INTO beings (being_player_id, being_type, being_color, being_cells, being_count)
                VALUES ('%s', '%s', %s, '%s', '%s')
                ON DUPLICATE KEY UPDATE being_count = being_count + '%s'";

        $this->game->DbQuery(sprintf(
            $sql,
            $playerId,
            $type,
            $color ? "'{$color}'" : "NULL",
            addslashes($cellsJson),
            $count,
            $count
        ));
    }

    public function beingExists(int $playerId, string $type, array $cellKeys, ?string $color = null): bool
    {
        $cellsJson = json_encode(array_map(fn($key) => SectorService::cellKeyToCoordinates($key), $cellKeys));

        $sql = "SELECT COUNT(*) as cnt FROM beings
                WHERE being_player_id = '%s'
                AND being_type = '%s'
                AND being_cells = '%s'";

        $params = [$playerId, $type, addslashes($cellsJson)];

        if ($color) {
            $sql .= " AND being_color = '%s'";
            $params[] = $color;
        }

        $result = $this->game->getObjectListFromDB(sprintf($sql, ...$params));

        return !empty($result) && $result[0]['cnt'] > 0;
    }

    public function updateBeingCells(int $playerId, string $type, array $oldCells, array $newCells, ?string $color = null): void
    {
        $oldCellsJson = json_encode(array_map(fn($key) => SectorService::cellKeyToCoordinates($key), $oldCells));
        $newCellsJson = json_encode(array_map(fn($key) => SectorService::cellKeyToCoordinates($key), $newCells));

        $sql = "UPDATE beings SET being_cells = '%s'
                WHERE being_player_id = '%s'
                AND being_type = '%s'
                AND being_cells = '%s'";

        $params = [
            addslashes($newCellsJson),
            $playerId,
            $type,
            addslashes($oldCellsJson),
        ];

        if ($color) {
            $sql .= " AND being_color = '%s'";
            $params[] = $color;
        }

        $this->game->DbQuery(sprintf($sql, ...$params));
    }

    public function getBeingsForPlayer(int $playerId): array
    {
        $sql = "SELECT * FROM beings WHERE being_player_id = '%s'";
        $rows = $this->game->getObjectListFromDB(sprintf($sql, $playerId));

        return array_map(
            fn($row) => new Being(
                playerId: (int)$row['being_player_id'],
                type: $row['being_type'],
                cells: json_decode($row['being_cells']),
                count: (int)$row['being_count'],
                color: $row['being_color'] ?? null,
                x: isset($row['being_x']) ? (int)$row['being_x'] : null,
                y: isset($row['being_y']) ? (int)$row['being_y'] : null,
            ),
            $rows
        );
    }

    public function getAllBeings(): array
    {
        $players = $this->game->loadPlayersBasicInfos();
        $result = [];

        foreach ($players as $player) {
            $result[$player["player_id"]] = $this->getBeingsForPlayer((int)$player["player_id"]);
        }

        return $result;
    }

    public function areSectorsSame(array $sector1, array $sector2): bool
    {
        if (count($sector1) !== count($sector2)) {
            return false;
        }

        $sorted1 = $sector1;
        $sorted2 = $sector2;
        sort($sorted1);
        sort($sorted2);

        return $sorted1 === $sorted2;
    }
}
