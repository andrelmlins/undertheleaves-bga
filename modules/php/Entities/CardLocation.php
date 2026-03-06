<?php

namespace Bga\Games\undertheleaves\Entities;

enum CardLocation: string
{
    case Deck = 'deck';
    case Table = 'table';
    case Grid = 'Grid';
    case InitialDeck = 'initialDeck';
}
