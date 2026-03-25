<?php

declare(strict_types=1);

namespace Bga\Games\undertheleaves\Services;

use Bga\Games\undertheleaves\Entities\Being;
use Bga\Games\undertheleaves\Game;

class BeingService
{
    public function __construct(public Game $game) {}

    public function addBeing(Being $being): void
    {
        $cells = $being->cells;
        usort($cells, fn($a, $b) => $a[1] !== $b[1] ? $b[1] - $a[1] : $a[0] - $b[0]);
        $cellsJson = json_encode($cells);

        $sql = "INSERT INTO beings (being_player_id, being_type, being_color, being_cells, being_count)
                VALUES ('%s', '%s', %s, '%s', '%s')
                ON DUPLICATE KEY UPDATE being_count = being_count + '%s'";

        $this->game->DbQuery(sprintf(
            $sql,
            $being->playerId,
            $being->type,
            $being->color ? "'{$being->color}'" : "NULL",
            addslashes($cellsJson),
            $being->count,
            $being->count
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

    public function updateBeingCells(Being $being): void
    {
        $cells = $being->cells;
        usort($cells, fn($a, $b) => $a[1] !== $b[1] ? $b[1] - $a[1] : $a[0] - $b[0]);
        $cellsJson = json_encode($cells);
        $sql = "UPDATE beings
                SET being_cells = '%s'
                WHERE being_id = '%s'";

        $this->game->DbQuery(sprintf($sql, addslashes($cellsJson), $being->id));
    }

    public function getBeingsForPlayer(int $playerId): array
    {
        $sql = "SELECT * FROM beings WHERE being_player_id = '%s'";
        $rows = $this->game->getObjectListFromDB(sprintf($sql, $playerId));

        return array_map(fn($row) => $this->formatBeing($row), $rows);
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

    public function getBeingsBySector(int $playerId, string $type): array
    {
        $sql = "SELECT * FROM beings 
                WHERE being_player_id = '%s' 
                AND being_type = '%s'";

        $rows = $this->game->getObjectListFromDB(sprintf($sql, $playerId, $type));

        return array_map(fn($row) => $this->formatBeing($row), $rows);
    }

    public function mergeBeing(Being $primary, array $secondaries): Being
    {
        $totalCount = $primary->count + array_sum(array_map(fn($b) => $b->count, $secondaries));

        $cells = $primary->cells;
        usort($cells, fn($a, $b) => $a[1] !== $b[1] ? $b[1] - $a[1] : $a[0] - $b[0]);
        $cellsJson = json_encode($cells);

        $sql = "UPDATE beings SET being_cells = '%s', being_count = '%s' WHERE being_id = '%s'";
        $this->game->DbQuery(sprintf($sql, addslashes($cellsJson), $totalCount, $primary->id));

        foreach ($secondaries as $secondary) {
            $this->deleteBeing($secondary->id);
        }

        return $primary->copyWith(cells: $cells, count: $totalCount);
    }

    public function deleteBeing(int $id): void
    {
        $this->game->DbQuery(sprintf("DELETE FROM beings WHERE being_id = '%s'", $id));
    }

    public function incrementBeesByColor(int $playerId, string $color, int $increment = 1): void
    {
        $sql = "UPDATE beings 
                SET being_count = being_count + '%s' 
                WHERE being_player_id = '%s' 
                AND being_type = 'bee' 
                AND being_color = '%s'";

        $this->game->DbQuery(sprintf($sql, $increment, $playerId, $color));
    }

    public function formatBeing(array $row): Being
    {
        return new Being(
            playerId: (int)$row['being_player_id'],
            type: $row['being_type'],
            cells: json_decode($row['being_cells'], true),
            count: (int)$row['being_count'],
            color: $row['being_color'] ?? null,
            x: isset($row['being_x']) ? (int)$row['being_x'] : null,
            y: isset($row['being_y']) ? (int)$row['being_y'] : null,
            id: (int)$row['being_id'],
        );
    }

    public function getBeingsByType(int $playerId, string $type): array
    {
        $sql = "SELECT * FROM beings WHERE being_player_id = '%s' AND being_type = '%s'";
        $rows = $this->game->getObjectListFromDB(sprintf($sql, $playerId, $type));
        return array_map(fn($row) => $this->formatBeing($row), $rows);
    }

    public function upsertHummingbird(int $playerId, int $tileX, int $tileY, int $delta): void
    {
        $existing = $this->game->getObjectFromDB(sprintf(
            "SELECT * FROM beings WHERE being_player_id = '%s' AND being_type = 'hummingbird' AND being_x = '%s' AND being_y = '%s'",
            $playerId,
            $tileX,
            $tileY
        ));

        $cellsJson = json_encode([[$tileX, $tileY]]);

        if ($existing) {
            $this->game->DbQuery(sprintf(
                "UPDATE beings SET being_count = being_count + '%s' WHERE being_id = '%s'",
                $delta,
                $existing['being_id']
            ));
        } else {
            $this->game->DbQuery(sprintf(
                "INSERT INTO beings (being_player_id, being_type, being_cells, being_count, being_x, being_y) VALUES ('%s', 'hummingbird', '%s', '%s', '%s', '%s')",
                $playerId,
                addslashes($cellsJson),
                $delta,
                $tileX,
                $tileY
            ));
        }
    }

    public function getTotalsByPlayer(): array
    {
        $sql = "SELECT being_player_id, being_type, SUM(being_count) as total FROM beings GROUP BY being_player_id, being_type";
        $rows = $this->game->getObjectListFromDB($sql);
        $result = [];

        foreach ($rows as $row) {
            $result[$row['being_player_id']][$row['being_type']] = (int)$row['total'];
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
