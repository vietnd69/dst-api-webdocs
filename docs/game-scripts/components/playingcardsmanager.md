---
id: playingcardsmanager
title: Playingcardsmanager
description: Manages the global pool of available playing card IDs and coordinates the creation, registration, and lifecycle of deck and card entities.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: fef37740
---

# Playingcardsmanager

## Overview
This component serves as the central manager for playing card resources in the game. It maintains a global pool of unique card IDs (representing combinations of suits and pips), assigns them to newly created cards or decks, and handles their reuse when entities are removed. It operates exclusively on the master simulation server and persists ID state across saves.

## Dependencies & Tags
- Requires the entity to be the **master** (`TheWorld.ismastersim`); throws an assertion if instantiated on a client.
- Adds `"playingcardsmanager"` component to the entity (implicitly via `inst:AddComponent("playingcardsmanager")`).
- Listens to `"onremove"` events on cards and decks it manages.
- Does not explicitly add or remove tags.

## Properties
No public properties are exposed as `self.property`. All internal state is held in local closures (`available_card_ids`, `decks`). The only public attribute is `self.inst`, inherited from the component constructor.

## Main Functions

### `MakeDeck(size)`
* **Description:** Spawns a new `deck_of_cards` entity and populates it with `size` uniquely assigned card IDs. Uses IDs from the available pool if possible; otherwise generates random IDs as fallback (typically only during world-gen or emergency reuse).
* **Parameters:**
  * `size` (number): Number of cards to include in the deck. Defaults to `1` if omitted or non-positive.

### `MakePlayingCard(id, facedown)`
* **Description:** Spawns a new `playing_card` entity, assigns it an ID (either explicitly provided or drawn from the pool), and optionally sets it face-down. Registers it for automatic ID return on removal.
* **Parameters:**
  * `id` (number, optional): Specific card ID to assign. If omitted, draws from the available pool.
  * `facedown` (boolean, optional): If `true`, sets the card as face-down.

### `RegisterPlayingCard(card)`
* **Description:** Assigns a unique card ID to an *already existing* playing card entity (e.g., loaded from save or spawned externally) and registers it for lifecycle management.
* **Parameters:**
  * `card` (Entity): A valid playing card entity with a `playingcard` component.

### `OnSave()`
* **Description:** Serializes the current state of available card IDs. Optionally includes GUIDs of active decks if any exist, for post-load restoration.
* **Returns:** `data` (table) — containing `available_ids`, and optionally `living_decks` (array of GUIDs). May also return `data, ents` if decks are present.

### `OnLoad(data)`
* **Description:** Restores the `available_card_ids` pool from saved data during load.
* **Parameters:**
  * `data` (table): Saved state from `OnSave`.

### `LoadPostPass(newents, data)`
* **Description:** Re-registers deck entities after they are instantiated from save data, re-attaching their `"onremove"` listeners.
* **Parameters:**
  * `newents` (table): Map of GUID → entity reference for newly loaded entities.
  * `data` (table): Contains `living_decks` array of GUIDs.

### `GetDebugString()`
* **Description:** Returns a string listing all currently available card IDs for debugging.
* **Returns:** `s` (string) — Human-readable list of IDs.

### `Debug_ResetAvailableIDs()`
* **Description:** Reinitializes the `available_card_ids` pool using current `TUNING.PLAYINGCARDS_NUM_SUITS` and `TUNING.PLAYINGCARDS_NUM_PIPS` constants. Useful for development/testing without world restart.
* **Note:** Uses `NUM_SUITS` and `NUM_PIPS`, likely defined constants in scope (possibly aliases for `TUNING.PLAYINGCARDS_NUM_*`).

## Events & Listeners

- **Listens for `"onremove"` on decks** — to return all contained card IDs to the available pool via `deck_onremove`.
- **Listens for `"onremove"` on individual cards** — to return the card’s ID to the available pool via `card_onremove`.
- **Listens for `"onremove"` on decks during `LoadPostPass`** — to ensure post-load cleanup is handled.
- Does **not** push or emit any events itself.