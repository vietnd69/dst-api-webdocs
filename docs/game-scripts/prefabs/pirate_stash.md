---
id: pirate_stash
title: Pirate Stash
description: Acts as a buried container that holds loot (particularly blueprints), supports digging interaction, preserves items indefinitely, and manages loot distribution upon excavation.
tags: [inventory, container, workable, environment]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a295b048
system_scope: environment
---

# Pirate Stash

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`pirate_stash` is a buried, indestructible container prefab used in DST to store and preserve loot, primarily blueprints. It is designed to be dug up using the `DIG` action, which triggers a multi-stage process to fling items out one by one over time. The stash preserves all items inside indefinitely (no perish or temperature effects), and prioritizes keeping certain "important" blueprints when space is limited. It integrates with the `inventory`, `preserver`, `workable`, and `inspectable` components.

## Usage example
```lua
-- Creating a pirate stash instance (handled automatically by the game)
local stash = SpawnPrefab("pirate_stash")
stash.Transform:SetPosition(x, y, z)

-- Manually stash an item (e.g., a blueprint)
stash:StashLoot(blueprint_item)

-- Digging (automatically triggers via workable system)
-- The stash will fling all items upon full dig completion
```

## Dependencies & tags
**Components used:** `inventory`, `preserver`, `workable`, `inspectable`, `network`, `animstate`, `transform`, `minimapentity`  
**Tags added:** `irreplaceable`, `buried`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `nextslot` | number | `1` | Next inventory slot index to use when giving items. Cycles through `1..maxslots`. |
| `flinging` | boolean | `false` | `true` after excavation begins; prevents re-entry of `OnDigged`. |
| `queued` | number | `0` | Counts pending loot-fling tasks. Decremented when each item is flung. |
| `scrapbook_adddeps` | table | `{"palmcone_scale", "cave_banana", ...}` | List of prefabs this stash contributes to the scrapbook. |

## Main functions
### `StashLoot(item)`
*   **Description:** Adds the given item to the stash's inventory. If the inventory is full, it may override non-protected items to make space; active items are handled as leftovers via `HandleLeftoversFn`.
*   **Parameters:** `item` (entity or `nil`) — The item to store. Returns early if `nil` or invalid.
*   **Returns:** Nothing.

### `HasCopyOf(item)`
*   **Description:** Checks whether another item in the stash is a blueprint with the same recipe (`recipetouse`) as `item`.
*   **Parameters:** `item` (entity) — The blueprint item to check for duplicates.
*   **Returns:** `boolean` — `true` if a duplicate blueprint exists in inventory, otherwise `false`.

### `IsItemTreasure(item)`
*   **Description:** Determines if the given item is an "important" blueprint (one listed in `IMPORTANT_BLUEPRINTS`) and does *not* have a duplicate in the stash.
*   **Parameters:** `item` (entity) — The blueprint item to evaluate.
*   **Returns:** `boolean` — `true` if `item` is an important blueprint and unique in the stash.

### `QueueFlingInSlot(slot)`
*   **Description:** Schedules a delayed task to fling the item in the specified inventory slot using `FlingLootInSlot`. Increments `queued` counter.
*   **Parameters:** `slot` (number) — Inventory slot index to fling.
*   **Returns:** Nothing.

### `FlingLootInSlot(slot)`
*   **Description:** Drops the item in the given slot, launches it into the air using `Launch`, and decrements the `queued` counter. If no more items remain to be flung, drops all remaining inventory (safety cleanup) and removes the stash.
*   **Parameters:** `slot` (number) — Inventory slot index to fling.
*   **Returns:** Nothing.
*   **Error states:** If `loot` is dropped successfully but becomes invalid, or if `queued <= 1`, the stash will be removed.

### `OnInventoryFull(leftovers)`
*   **Description:** Callback triggered when inventory is full and new items arrive. It makes space by removing non-irreplaceable, non-treasure items and places `leftovers` in the first available slot. If no slot is free, it drops or removes the leftover item depending on tags and capabilities.
*   **Parameters:** `leftovers` (entity or `nil`) — The item that could not fit.
*   **Returns:** Nothing.

### `OnGotItem(inst, data)`
*   **Description:** Listener for the `itemget` event. If excavation (`flinging`) is in progress, queues the new item's slot for flinging. Updates `nextslot` for subsequent looting.
*   **Parameters:** `data` (table) — Event data containing `slot` (number) of the newly added item.
*   **Returns:** Nothing.

### `QueueFlingInSlot(slot)` and `FlingLootInSlot(slot)`
*   **Description:** Used in combination to stagger item flinging (`MAX_LOOTFLING_DELAY * math.random()` delay). Ensures items do not all launch simultaneously.
*   **Parameters:** `slot` (number) — Inventory slot index to process.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `itemget` — Triggers `OnGotItem` when a new item is added to the stash's inventory.
- **Pushes:** `nil` (no events are fired directly by this component).
- **Hooks:** `OnRemoveEntity` — Calls `TheWorld.components.piratespawner:ClearCurrentStash()` to clean up spawner state.
- **Hooks:** `OnSave` / `OnLoad` — Persists and restores `nextslot` state.

### Internal callback hooks (not events)
- `inst.OnRemoveEntity` — Cleanly clears current stash reference in `piratespawner`.
- `inst.OnSave`, `inst.OnLoad` — Custom save/load logic to preserve `nextslot`.
