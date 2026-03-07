---
id: dragonfly_chest
title: Dragonfly Chest
description: A deployable storage chest that can be upgraded to provide infinite stack size and special loot behavior upon destruction or upgrade.
tags: [storage, upgrade, loot, structure]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 262c302c
system_scope: inventory
---

# Dragonfly Chest

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The Dragonfly Chest is a deployable structure prefab that functions as a storage container. It supports the `container`, `lootdropper`, `workable`, `upgradeable`, and `inspectable` components. When upgraded, it gains infinite stack size capacity and custom loot behavior (e.g., dropping `alterguardianhatshard` on deconstruction). It also supports collapse mechanics if overfilled (exceeding `TUNING.COLLAPSED_CHEST_EXCESS_STACKS_THRESHOLD`), converting into a `collapsed_dragonflychest` while dropping excess items.

## Usage example
```lua
local inst = SpawnPrefab("dragonflychest")
inst.Transform:SetPosition(x, y, z)
-- Optional: upgrade the chest to enable infinite stacks
inst.components.upgradeable:Upgrade("some_upgrade_item")
-- Upon upgrade, infinite stack size is enabled, and loot changes
```

## Dependencies & tags
**Components used:** `container`, `lootdropper`, `workable`, `upgradeable`, `inspectable`  
**Tags added:** `structure`, `chest`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_chestupgrade_stacksize` | boolean | `false` | Internal flag indicating whether the chest has been upgraded to support infinite stack size. |
| `scrapbook_removedeps` | table | `{ "alterguardianhatshard" }` | Items whose prefabs should be removed from the scrapbook when this chest is involved. |

## Main functions
### `ConvertToCollapsed(inst, droploot)`
*   **Description:** Converts the chest into a `collapsed_dragonflychest` when it has too many overstacked items. Optionally spawns collapse FX and drops loot if `droploot` is true.
*   **Parameters:**  
    `inst` (Entity) — the chest instance.  
    `droploot` (boolean) — whether to drop loot and spawn FX before collapsing.
*   **Returns:** Nothing.

### `ShouldCollapse(inst)`
*   **Description:** Checks whether the chest contains enough overstacked items to trigger collapse. Counts stack sizes relative to their original max size and compares against `TUNING.COLLAPSED_CHEST_EXCESS_STACKS_THRESHOLD`.
*   **Parameters:**  
    `inst` (Entity) — the chest instance.
*   **Returns:** `true` if the chest should collapse; otherwise `false`.

### `OnUpgrade(inst, performer, upgraded_from_item)`
*   **Description:** Handles chest upgrade logic: enables infinite stack size, updates visuals, sets loot to `alterguardianhatshard`, and overrides work callbacks.
*   **Parameters:**  
    `inst` (Entity) — the chest instance.  
    `performer` (Entity) — the entity performing the upgrade.  
    `upgraded_from_item` (boolean) — whether the upgrade came from an item use (as opposed to load or deconstruct).
*   **Returns:** Nothing.

### `OnDecontructStructure(inst, caster)`
*   **Description:** Handles chest deconstruction. If upgraded and overfilled, drops excess items and may collapse into `collapsed_dragonflychest`. Drops `alterguardianhatshard` if upgraded. Sets `no_delete_on_deconstruct = true` when collapsing to prevent immediate deletion.
*   **Parameters:**  
    `inst` (Entity) — the chest instance.  
    `caster` (Entity) — the entity deconstructing the chest.
*   **Returns:** Nothing.

### `DoUpgradeVisuals(inst)`
*   **Description:** Replaces the chest's animation bank and build with the upgraded variant, preserving any custom skin.
*   **Parameters:**  
    `inst` (Entity) — the chest instance.
*   **Returns:** Nothing.

### `OnRestoredFromCollapsed(inst)`
*   **Description:** Handles animation and sound when a collapsed chest is rebuilt back into a functional Dragonfly Chest.
*   **Parameters:**  
    `inst` (Entity) — the chest instance.
*   **Returns:** Nothing.

### `getstatus(inst, viewer)`
*   **Description:** Returns `"UPGRADED_STACKSIZE"` if the chest has been upgraded; otherwise `nil`.
*   **Parameters:**  
    `inst` (Entity) — the chest instance.  
    `viewer` (Entity) — the entity inspecting the chest (not used directly).
*   **Returns:** `string` or `nil`.

## Events & listeners
- **Listens to:**  
    `onbuilt` — triggers `onbuilt` function to play placement animation and sound.  
    `ondeconstructstructure` — triggers `OnDecontructStructure` to handle loot and collapse logic.  
    `restoredfromcollapsed` — triggers `OnRestoredFromCollapsed` to play rebuild animation/sound.
- **Pushes:**  
    `onclose`, `onopen` — via container's internal events.  
    `loot_prefab_spawned`, `entity_droploot` — via lootdropper.