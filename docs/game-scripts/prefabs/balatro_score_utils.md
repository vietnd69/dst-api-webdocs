---
id: balatro_score_utils
title: Balatro Score Utils
description: Provides base classes and Joker-specific logic for evaluating poker hands and calculating scores in Balatro minigame rounds.
tags: [minigame, poker, scoring, card]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 803da135
system_scope: ui
---

# Balatro Score Utils

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`balatro_score_utils.lua` contains the core logic for Balatro poker hand evaluation and scoring. It defines `BaseJoker`, a foundational class for Joker card behavior, and implements 18 specific Joker subclasses (e.g., `WalterJoker`, `WandaJoker`, etc.) that modify scoring based on game events and card data. This file works in tandem with `balatro_util.lua` to process hands, count suit/number distributions, and determine final scores. It is used by the Balatro minigame UI and backend state management to compute chips and multipliers.

## Usage example
```lua
local BALATRO_SCORE_UTILS = require("prefabs/balatro_score_utils")
local BALATRO_UTIL = require("prefabs/balatro_util")

local cards = {101, 110, 111, 112, 113} -- Example hand (e.g., Spades 1–5)
local joker = BALATRO_SCORE_UTILS.JOKERS.walter(cards)

-- Trigger evaluation after final hand selection
local rank = joker:GetFinalScoreRank()
print("Joker rank:", rank)
```

## Dependencies & tags
**Components used:** None (pure utility module)  
**Tags:** None identified  
**External dependency:** `prefabs/balatro_util.lua` (`BALATRO_UTIL.NUM_SELECTED_CARDS`, `BALATRO_UTIL.SCORE_RANKS`, `BALATRO_UTIL.ServerDebugPrint`)

## Properties
No public properties are exposed. All state is held in private fields (`_chips`, `_mult`) or instance-specific data (`RED_SUITS`, `BLACK_SUITS`, `_lasthandscore`, `_lastdiscardeddata`).

## Main functions
### `BaseJoker:EvaluateHand()`
* **Description:** Analyzes the current hand to determine its poker rank (e.g., Straight Flush, Pair), returning a numeric score (1–10).  
* **Parameters:** None (uses `self.cards` internally).  
* **Returns:** `number` — Score from 1 (High Card) to 10 (Royal Flush), per standard Balatro hand rankings.  
* **Error states:** Returns `1` if no hand pattern matches (default High Card).

### `BaseJoker:CalculateRank(score)`
* **Description:** Maps the numeric hand score (chips × multiplier) to a final rank index (e.g., `1` = "Garbage", higher indices = better ranks).  
* **Parameters:** `score` (number) — The computed `chips * mult` value.  
* **Returns:** `number` — Index into `BALATRO_UTIL.SCORE_RANKS` corresponding to the rank.  
* **Error states:** Returns `1` if `score` is below all rank thresholds.

### `BaseJoker:GetFinalScoreRank()`
* **Description:** Computes the final chips, multiplier, and rank for the hand. Adds base chips (face value), applies hand-based multiplier via `EvaluateHand()`, and triggers Joker-specific `OnGameFinished()` hooks.  
* **Parameters:** None.  
* **Returns:** `number` — Rank index computed by `CalculateRank(chips * mult)`.  
* **Error states:** None documented; assumes valid `self.cards` array.

### `BaseJoker:GetCardSuitByIndex(index, handoverride)`
* **Description:** Extracts the suit (1–4) from a card ID (assumes `card_id = suit * 100 + number`).  
* **Parameters:**  
  - `index` (number) — 1-based index into the cards table.  
  - `handoverride` (table) — Optional override array of card IDs; defaults to `self.cards`.  
* **Returns:** `number` — Suit value (1=Spades, 2=Hearts, 3=Clubs, 4=Diamonds).

### `BaseJoker:GetCardNumberByIndex(index, handoverride)`
* **Description:** Extracts the number (1–13) from a card ID.  
* **Parameters:**  
  - `index` (number) — 1-based index.  
  - `handoverride` (table) — Optional override array.  
* **Returns:** `number` — Card number (1=Ace, 11=Jack, 12=Queen, 13=King).

### `BaseJoker:CountUniqueSuits()`
* **Description:** Counts distinct suits in the current hand.  
* **Parameters:** None.  
* **Returns:** `number` — Number of unique suits present.

### `BaseJoker:CountUniqueDiscardedSuits(discardeddata)`
* **Description:** Counts distinct suits among *discarded* cards in the current hand.  
* **Parameters:**  
  - `discardeddata` (table) — Array of booleans where `discardeddata[i]` is `true` if card `i` was discarded.  
* **Returns:** `number` — Number of unique suits among discarded cards.

## Events & listeners
None — This module provides utility classes and does not register or fire events directly. Joker event hooks (`OnGameStarted`, `OnCardsDiscarded`, `OnNewCards`, `OnGameFinished`) are called by external Balatro logic (e.g., UI or round state) when game events occur.