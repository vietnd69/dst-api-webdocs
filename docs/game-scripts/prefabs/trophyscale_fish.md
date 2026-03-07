---
id: trophyscale_fish
title: Trophyscale Fish
description: A weighable fish stand that holds and displays caught trophy fish, supports building/removal via actions, and handles item persistence across reloads and burn states.
tags: [fishing, weighing, structure, persistence, loot]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3cd9d91b
system_scope: entity
---

# Trophyscale Fish

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `trophyscale_fish` prefab represents a deployed fish weighing station used in the game's trophy fishing system. It holds a single fish (or remains empty), visually displays its weight on numeric digits, and plays sound animations during fish placement or replacement. It integrates tightly with the `trophyscale`, `workable`, `burnable`, `hauntable`, and `lootdropper` components to manage item data, interaction, durability, and destruction behavior. The entity is persistent and stores internal state (including held fish data) in its `trophyscale.item_data` property, enabling correct restoration on reload and proper handling during burning/hammering.

## Usage example
```lua
local inst = SpawnPrefab("trophyscale_fish")
inst.Transform:SetPosition(x, y, z)

-- After placing a fish via in-game mechanics, its component's item_data is set:
-- inst.components.trophyscale.item_data = { prefab = "fish", weight = 12.34, owner_userid = "...", ... }
```

## Dependencies & tags
**Components used:** `inspectable`, `trophyscale`, `lootdropper`, `workable`, `hauntable`, `burnable`, `propagator`
**Tags:** Adds `structure`, `trophyscale_fish`, `burnt` (when burnt), checks `burnt`, `fire`
**Tags removed:** None explicitly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_anim` | string | `"nofish_idle"` | Animation used in scrapbook/minimap representation. |
| `scrapbook_specialinfo` | string | `"TROPHYSCALEFISH"` | Identifier for scrapbook special info lookup. |
| `soundtask_playspin` / `soundtask_stopspin` / `soundtask_playbell` | task (optional) | `nil` | Scheduled sound tasks for spin/bell sequences. |
| `task_setdigits` / `task_newtrophyweighed` | task (optional) | `nil` | Scheduled tasks for digit animation updates and state resets. |

## Main functions
### `SetDigits(inst, weight)`
*   **Description:** Updates the numeric digit sprites on the structure to display the given weight. Handles numeric inputs, formats them as a 6-character string with two decimal places, and maps each character to a symbol override for the `scale_o_matic` build.
*   **Parameters:** `weight` (string | number | nil) — either a 5-character formatted weight string (e.g., `"123.45"` without the decimal point) or a number to be formatted.
*   **Returns:** Nothing.

### `GetItemData(inst)`
*   **Description:** Convenience accessor that returns the currently held fish data stored in the `trophyscale` component.
*   **Parameters:** `inst` (entity) — the entity instance.
*   **Returns:** `table | nil` — the `item_data` table stored in `inst.components.trophyscale`, or `nil` if empty.

### `IsHoldingItem(inst)`
*   **Description:** Returns true if the stand currently holds a fish and is not burnt.
*   **Parameters:** `inst` (entity) — the entity instance.
*   **Returns:** `boolean` — `true` if `item_data ~= nil` and not burnt, otherwise `false`.

### `DropItem(inst, data)`
*   **Description:** Spawns the held fish item, positions it at the stand’s location, and launches it away using a 2D physics launch.
*   **Parameters:** `data` (table | nil) — the item data to spawn (typically `item_data` from `trophyscale`).
*   **Returns:** Nothing.

### `onnewtrophy(inst, data_old_and_new)`
*   **Description:** Handles the full animation and sound sequence when a fish is placed or replaced. Plays replacement/placeholder animations, schedules digit updates, and triggers spin/bell sounds with appropriate timing.
*   **Parameters:**  
    * `data_old_and_new` (table) — table with fields `old` (previous fish data, may be `nil`) and `new` (new fish data).
*   **Returns:** Nothing.

### `onhammered(inst, worker)`
*   **Description:** Callback executed when the hammer action finishes on the stand. Drops all loot (including the held fish), spawns a `collapse_small` FX, and a splash if not burnt, then removes the entity.
*   **Parameters:** `worker` (entity | nil) — the worker performing the hammer action.
*   **Returns:** Nothing.

### `ondeconstructstructure(inst)`
*   **Description:** Drops the currently held fish item when the stand is deconstructed.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `onburnt(inst)`
*   **Description:** Cleans up scheduled tasks and sounds, drops the held fish, and clears `item_data` upon burn completion.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `getdesc(inst, viewer)`
*   **Description:** Returns a localized description string based on burn state and held item. Varies between `BURNT`, `BURNING`, `OWNER` (if player owns the fish), or generic `HAS_ITEM`.
*   **Parameters:**  
    * `viewer` (entity) — the viewer inspecting the stand.
*   **Returns:** `string | nil` — the appropriate description string.

### `onsave(inst, data)`
*   **Description:** Saves whether the stand is burnt or burning for persistence.
*   **Parameters:**  
    * `data` (table) — the table to augment with state.
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Restores state on load. Reapplies animations and digit overrides if the stand held an item. Applies burnt state.
*   **Parameters:**  
    * `data` (table) — saved state loaded from disk.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onbuilt` → triggers `onbuilt()` to play spawn animation and sound.  
  - `onnewtrophy` → triggers `onnewtrophy()` to handle fish placement/replacement.  
  - `ondeconstructstructure` → triggers `ondeconstructstructure()` to drop the held fish.

- **Pushes:**  
  - None directly. The prefab does not fire custom events via `inst:PushEvent()`; it reacts to external system events.
