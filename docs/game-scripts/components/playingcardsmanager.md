---
id: playingcardsmanager
title: Playingcardsmanager
description: Manages the pool of available playing card IDs and handles the creation and lifecycle of playing card prefabs and decks.
tags: [inventory, networking, savegame]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: fef37740
system_scope: entity
---
# Playingcardsmanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PlayingCardsManager` maintains a global inventory of available card IDs (unique identifiers encoding suit and pip values) and ensures proper card ID allocation and recycling for decks and individual playing cards. It operates exclusively on the master simulation server and supports save/load state management for persistent card tracking across sessions. The component coordinates with `DeckContainer` (for decks) and `PlayingCard` (for individual cards) via their respective public methods.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("playingcardsmanager")

-- Create a 5-card deck
local deck = inst.components.playingcardsmanager:MakeDeck(5)

-- Create a single faceup playing card with auto-assigned ID
local card = inst.components.playingcardsmanager:MakePlayingCard(nil, false)

-- Register an existing playing card prefab with an assigned ID
local existing_card = SpawnPrefab("playing_card")
inst.components.playingcardsmanager:RegisterPlayingCard(existing_card)
```

## Dependencies & tags
**Components used:** `deckcontainer`, `playingcard`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity instance | `nil` | The entity instance this component is attached to (asserted to be on master). |

## Main functions
### `MakeDeck(size)`
*   **Description:** Spawns a new `deck_of_cards` prefab, assigns it `size` randomly selected available card IDs, and registers it for lifecycle management. If card IDs are exhausted, generates IDs using fallback randomization.
*   **Parameters:** `size` (number) - number of cards to place in the deck; defaults to `1` if `nil` or non-positive.
*   **Returns:** `deck` (entity instance) — the spawned deck entity.
*   **Error states:** None — failsafe fallback to pseudo-random ID generation if available IDs are exhausted.

### `MakePlayingCard(id, facedown)`
*   **Description:** Spawns a `playing_card` prefab, sets its ID (either provided or randomly selected from available pool), optionally sets initial face state, and registers it for lifecycle management.
*   **Parameters:**  
    - `id` (number?, optional) — specific card ID to assign; if `nil`, pulls from available pool or generates fallback ID.  
    - `facedown` (boolean?, optional) — if `true`, initializes card as face-down.
*   **Returns:** `card` (entity instance) — the spawned playing card entity.
*   **Error states:** None — safe fallback ID generation if ID not provided and available pool is empty.

### `RegisterPlayingCard(card)`
*   **Description:** Assigns a unique card ID to an *already-spawned* playing card entity and registers it for lifecycle management (i.e., ID return on removal).
*   **Parameters:** `card` (entity instance) — a `playing_card` entity with a `playingcard` component.
*   **Returns:** `card` (entity instance) — the same card entity, now assigned an ID and registered.
*   **Error states:** Fails if `card.components.playingcard` is missing.

### `GetDebugString()`
*   **Description:** Returns a human-readable string listing all currently available card IDs for debugging.
*   **Parameters:** None.
*   **Returns:** `s` (string) — debug string in format `"Available Cards: id1; id2; ...;"`.
*   **Error states:** Returns empty string if no available IDs.

### `Debug_ResetAvailableIDs()`
*   **Description:** Resets the internal available ID pool to full stock, using `NUM_SUITS` and `NUM_PIPS` globals. Intended for debugging/test scenarios.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None — global variables `NUM_SUITS`/`NUM_PIPS` must be defined (typically via `TUNING.PLAYINGCARDS_NUM_*` in production).

## Events & listeners
- **Listens to:**  
  - `onremove` on decks and playing cards — triggers ID回收 and unregisters from internal `decks` registry.  
- **Pushes:** None.  
- **Save/Load events handled internally:**  
  - `OnSave`, `OnLoad`, `LoadPostPass` manage persistence of available IDs and live decks across server restarts.

