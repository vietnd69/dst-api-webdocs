---
id: chestfunctions
title: Chestfunctions
description: Provides utility functions for spawning loot in containers and managing chest trap behaviors with randomization and event handling.
tags: [loot, trap, container, random]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: a5a5ad75
system_scope: inventory
---

# Chestfunctions

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`chestfunctions` is a scenario-scoped utility module that offers helpers for initializing container loot and handling chest trap logic. It manages random loot selection, chance-based item spawning, and trap activation (e.g., Statue Traps), integrating with the `container`, `talker`, and scenario runner systems. Functions are exported for use in scenario worldgen and entity initialization logic.

## Usage example
```lua
-- Initialize a chest with loot and set up trap behavior
local chest = SpawnPrefab("chest")
chest:AddComponent("container")
chest:AddComponent("talker")

chestfunctions.AddChestItems(chest, {
    { item = "log", count = 3 },
    { item = "twigs", count = 5, chance = 0.8 },
    { item = { "seeds", "berries" }, count = 1 },
})

chestfunctions.InitializeChestTrap(chest, scenariorunner, trapfn, 0.75)
```

## Dependencies & tags
**Components used:** `container`, `talker`  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `PickLootItems(number, loot)`
*   **Description:** Randomly selects up to `number` items from the `loot` table without replacement and returns a new table with the selected items.
*   **Parameters:**  
    `number` (number) - Maximum number of items to pick.  
    `loot` (table) - List of item definitions or prefabs to select from.
*   **Returns:** (table) A new table containing up to `number` randomly selected items.
*   **Error states:** If `number` exceeds `#loot`, it selects all available items.

### `AddChestItems(chest, loot, num)`
*   **Description:** Spawns loot items into a chest's container based on chance and count rules. It ensures the chest is non-empty by recursively retrying if initially empty.
*   **Parameters:**  
    `chest` (Entity) - The entity with a `container` component.  
    `loot` (table) - Array of loot definitions; each entry may be a string (prefab name) or a table with keys `item`, `count`, `chance`, and/or `initfn`.  
    `num` (number?, optional) - Maximum slots to fill; defaults to `chest.components.container.numslots`.
*   **Returns:** Nothing.
*   **Error states:** If `SpawnPrefab` fails for an item, prints a `"Cant spawn"` message to console and skips that item. Recalls itself if the chest ends up empty after processing.

### `OnOpenChestTrap(inst, openfn, scenariorunner, data, chance)`
*   **Description:** Evaluates whether a chest trap triggers on open/activation using luck-based rolling. If triggered, spawns FX, plays sound, calls `openfn`, and prompts the player to announce the trap event.
*   **Parameters:**  
    `inst` (Entity) - The chest entity, may or may not have a `talker` component.  
    `openfn` (function) - Callback function invoked when trap triggers. Signature: `openfn(inst, scenariorunner, data)`.  
    `scenariorunner` (Entity/ScenarioRunner) - Scenario runner instance passed to `openfn`.  
    `data` (table) - Event data containing at least `player`, `doer`, or `worker`.  
    `chance` (number?, optional) - Base trap activation chance; defaults to `0.66`.
*   **Returns:** Nothing.
*   **Error states:** Early exit if `TryLuckRoll` returns `false`. Skips talker calls if `inst.components.talker` is missing (e.g., Deerclops). FX and sound may be skipped if `SpawnPrefab` returns `nil`.

### `InitializeChestTrap(inst, scenariorunner, openfn, chance)`
*   **Description:** Attaches event listeners to a chest entity to trigger trap logic on `onopen` or `worked` events.
*   **Parameters:**  
    `inst` (Entity) - The chest entity.  
    `scenariorunner` (Entity/ScenarioRunner) - Scenario runner reference.  
    `openfn` (function) - Trap response function (passed to `OnOpenChestTrap`).  
    `chance` (number?, optional) - Base trap chance.
*   **Returns:** Nothing.
*   **Error states:** Creates a closure `inst.scene_triggerfn`; this is cleaned up in `OnDestroy`.

### `OnDestroy(inst)`
*   **Description:** Cleans up event listeners registered by `InitializeChestTrap` to prevent memory leaks.
*   **Parameters:**  
    `inst` (Entity) - The chest entity being destroyed.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onopen`, `worked` — handled via `InitializeChestTrap`; later removed by `OnDestroy`.
- **Pushes:** No events directly; relies on scenario infrastructure and external event systems.