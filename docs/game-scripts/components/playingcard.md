---
id: playingcard
title: Playingcard
description: Manages the identity (suit and pips) and persistence of a playing card entity in the game world.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 2a74fe65
---

# Playingcard

## Overview
This component encapsulates the state and behavior of a playing card entity within the Entity Component System. It stores a compact `card_id` integer that encodes both suit and pip information, provides getter methods to extract those values, supports dynamic pip count changes (affecting the encoding scheme), and handles save/load persistence. It also manages the `"playingcard"` tag on its owner entity.

## Dependencies & Tags
- **Tags added on construction:** `"playingcard"`
- **Tags removed on entity removal:** `"playingcard"` (via `OnRemoveEntity`)
- **Dependencies:** Relies on `TUNING.PLAYINGCARDS_NUM_PIPS` for default pip count initialization.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity this component is attached to (stored during construction). |
| `_card_id` | `number` | `-1` | Internal encoded ID representing the card (suit and pips). `-1` indicates an uninitialized or invalid card. |
| `pip_count` | `number` | `TUNING.PLAYINGCARDS_NUM_PIPS` | Total number of pips per suit (e.g., 13 for standard cards). Used to determine pip magnitude in ID encoding. |
| `pip_digit_barrier` | `number` | `100` | Divisor/mask used to split `card_id` into suit (high-order) and pips (low-order) components. Initialized based on `pip_count` digits. |

## Main Functions
### `SetID(id)`
* **Description:** Sets the card's internal `card_id` and, if registered, triggers the `on_new_id` callback with the new ID.
* **Parameters:**  
  `id` (`number`) — The new encoded card ID to assign.

### `GetID()`
* **Description:** Returns the current `card_id`.
* **Parameters:** None.

### `GetSuit()`
* **Description:** Extracts and returns the suit value from `card_id` using the current `pip_digit_barrier`. Returns `0` for invalid/uninitialized cards (`card_id <= 0`).
* **Parameters:** None.

### `GetPips()`
* **Description:** Extracts and returns the pip value (remainder) from `card_id` using the current `pip_digit_barrier`. Returns `0` for invalid/uninitialized cards.
* **Parameters:** None.

### `GetSuitAndPip()`
* **Description:** Convenience method that returns both `GetSuit()` and `GetPips()` values as a pair.
* **Parameters:** None.

### `OnSave()`
* **Description:** Returns a table containing the `card_id` for serialization (e.g., saving to disk).
* **Parameters:** None.  
* **Returns:** `table` — `{ card_id = self._card_id }`.

### `OnLoad(data, newents)`
* **Description:** Restores the `card_id` from saved data.
* **Parameters:**  
  `data` (`table`) — The saved data table, expected to contain `data.card_id`.  
  `newents` (`table`) — Unused parameter (included for API compatibility).

### `OnRemoveEntity()`
* **Description:** Removes the `"playingcard"` tag from the entity when the component is removed.
* **Parameters:** None.  
* **Note:** Also aliased as `OnRemoveFromEntity`.

### `onpipcount(self, pipcount)` *(internal callback)*
* **Description:** Recalculates and updates `pip_digit_barrier` based on the numeric digit count of `pipcount`, then recomputes `card_id` to preserve suit/pip semantics under the new barrier.
* **Parameters:**  
  `pipcount` (`number`) — The new pip count value (typically from `pip_count` assignment).  

## Events & Listeners
None. This component does not listen for or push events.