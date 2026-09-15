<?php

namespace Bga\Games\undertheleaves\Services;

use Bga\Games\undertheleaves\Entities\CardType;
use Bga\Games\undertheleaves\Entities\Position;
use Bga\Games\undertheleaves\Game;

class CardService
{
    public function __construct(public Game $game) {}

    public function setup()
    {
        $leafCards = array_values(array_filter($this->game->CARD_CONFIGS, fn($config) => $config->type == CardType::Leaf));
        $mushroomCards = array_values(array_filter($this->game->CARD_CONFIGS, fn($config) => $config->type == CardType::Mushroom));
        $puddleCards = array_values(array_filter($this->game->CARD_CONFIGS, fn($config) => $config->type == CardType::Puddle));

        if ($this->game->getGameStateValue('initialCards') == 2) {
            $leafCard = array_find($leafCards, fn($config) => $config->firstGame);
            $mushroomCard = array_find($mushroomCards, fn($config) => $config->firstGame);
            $puddleCard = array_find($puddleCards, fn($config) => $config->firstGame);

            $this->game->globals->set('card:leaf', $leafCard->position);
            $this->game->globals->set('card:mushroom', $mushroomCard->position);
            $this->game->globals->set('card:puddle', $puddleCard->position);
        } else {
            $leafCard = $leafCards[bga_rand(0, 3)];
            $mushroomCard = $mushroomCards[bga_rand(0, 3)];
            $puddleCard = $puddleCards[bga_rand(0, 3)];

            $this->game->globals->set('card:leaf', $leafCard->position);
            $this->game->globals->set('card:mushroom', $mushroomCard->position);
            $this->game->globals->set('card:puddle', $puddleCard->position);
        }

        if ($this->game->getGameStateValue('treeDwellerExpansion') == 2) {
            $treeCard = array_find($this->game->CARD_CONFIGS, fn($config) => $config->type == CardType::Tree);

            if ($treeCard !== null) {
                $this->game->globals->set('card:tree', $treeCard->position);
            }
        }
    }

    public function list()
    {
        $leafPosition = $this->game->globals->get('card:leaf', null, Position::class);
        $mushroomPosition = $this->game->globals->get('card:mushroom', null, Position::class);
        $puddlePosition = $this->game->globals->get('card:puddle', null, Position::class);
        $treePosition = $this->game->globals->get('card:tree', null, Position::class);

        $cards = [
            'leaf' => array_find($this->game->CARD_CONFIGS, fn($config) => $config->position->row == $leafPosition->row && $config->position->column == $leafPosition->column),
            'mushroom' => array_find($this->game->CARD_CONFIGS, fn($config) => $config->position->row == $mushroomPosition->row && $config->position->column == $mushroomPosition->column),
            'puddle' => array_find($this->game->CARD_CONFIGS, fn($config) => $config->position->row == $puddlePosition->row && $config->position->column == $puddlePosition->column),
        ];

        if ($treePosition !== null) {
            $cards['tree'] = array_find($this->game->CARD_CONFIGS, fn($config) => $config->position->row == $treePosition->row && $config->position->column == $treePosition->column);
        }

        return $cards;
    }
}
