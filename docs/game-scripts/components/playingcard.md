---
id: playingcard
title: Playingcard
description: Manages the identity (suit and pips) of a playing card entity in the game.
tags: [inventory, entity, save_load]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 2a74fe65
system_scope: inventory
---
# Playingcard

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PlayingCard` is a component that encapsulates the identity of a playing card entity, storing its unique `card_id` as a composite of suit and pip values. It supports saving and loading, and automatically maintains a `playingcard` tag on its owning entity. The component is designed to work with DST's entity-component system and integrates with prefabs representing physical playing cards (e.g., in the "Fortitude" minigame).

## Usage example
```lua
local inst = Prefab("playingcard")
inst:AddComponent("playingcard")
inst.components.playingcard:SetID(203)  -- e.g., Hearts suit (2), 3 pips
local suit, pips = inst.components.playingcard:GetSuitAndPip()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `playingcard` on initialization; removes `playingcard` on entity removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_card_id` | number | `-1` | Unique identifier encoding suit (high digits) and pips (low digits). |
| `pip_count` | number | `TUNING.PLAYINGCARDS_NUM_PIPS` | Maximum number of pips per suit; used to compute digit barrier for suit/pip separation. |
| `pip_digit_barrier` | number | `100` | Divider used to extract suit from `card_id` (based on `pip_count`). |

## Main functions
### `SetID(id)`
*   **Description:** Sets the card’s unique identifier. Triggers the optional `on_new_id` callback if defined.
*   **Parameters:** `id` (number) — The composite card ID to assign.
*   **Returns:** Nothing.

### `GetID()`
*   **Description:** Returns the current card ID.
*   **Parameters:** None.
*   **Returns:** `number` — The stored `_card_id`, or `-1` if unset.

### `GetSuit()`
*   **Description:** Extracts and returns the suit component from `_card_id`.
*   **Parameters:** None.
*   **Returns:** `number` — Suit value (e.g., `0` to `3`), or `0` if `_card_id <= 0`.

### `GetPips()`
*   **Description:** Extracts and returns the pip count component from `_card_id`.
*   **Parameters:** None.
*   **Returns:** `number` — Pip count (e.g., `1` to `13`), or `0` if `_card_id <= 0`.

### `GetSuitAndPip()`
*   **Description:** Returns both suit and pips as a tuple.
*   **Parameters:** None.
*   **Returns:** `number, number` — Suit and pip values, respectively.

### `OnRemoveEntity()`
*   **Description:** Cleanup callback fired when the entity is removed. Removes the `playingcard` tag.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Prepare data for persistence.
*   **Parameters:** None.
*   **Returns:** `table` — A table with key `card_id` and value `_card_id`.

### `OnLoad(data, newents)`
*   **Description:** Restore state from saved data.
*   **Parameters:**  
    - `data` (table) — Saved data with `card_id` field.  
    - `newents` (table) — Reserved for future use; not used.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified  
