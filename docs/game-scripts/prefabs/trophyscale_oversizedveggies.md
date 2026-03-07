---
id: trophyscale_oversizedveggies
title: Trophyscale Oversizedveggies
description: A weight-based trophy structure that accepts oversized vegetables and displays their weight and harvest day using animated digit symbols.
tags: [farming, trophy, structure]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4009bbb4
system_scope: world
---

# Trophyscale Oversizedveggies

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `trophyscale_oversizedveggies` prefab is a fixed structure that functions as a weight-displaying trophy scale for oversized vegetables. It integrates with the `trophyscale` component to accept and store plant data (including weight and harvest day), updates its visual digit display via animation overrides, and plays sound sequences on item placement. It supports burning, deconstruction, and hammering interactions, persists data across save/load cycles, and provides contextual descriptions to players via the `inspectable` component.

## Usage example
```lua
local trophy = SpawnPrefab("trophyscale_oversizedveggies")
trophy.Transform:SetPosition(x, y, z)
trophy.components.trophyscale:SetItemCanBeTaken(false)
-- To place a new trophy item:
trophy:PushEvent("onnewtrophy", {
    old = nil,
    new = {
        prefab = " oversized_veggie",
        weight = 250.50,
        base_name = "beefaloweekly",
        build = "farm_plant_beefaloweekly",
        day = 5,
        from_plant = true,
        is_heavy = true
    },
    doer = player
})
```

## Dependencies & tags
**Components used:** `inspectable`, `trophyscale`, `lootdropper`, `workable`, `hauntable`, `burnable`, `perishable`, `pumpkincarvable`, `sound`, `animstate`, `transform`, `minimap`, `network`  
**Tags:** `structure`, `trophyscale_oversizedveggies`, `burnt`, `fire`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `pumpkincarving_fx` | Entity or nil | `nil` | FX entity used to display pumpkin carving data (temporary, restored on load) |
| `task_setdigits` | Task or nil | `nil` | Delayed task to update digit display after animation |
| `soundtask_playspin`, `soundtask_stopspin`, `soundtask_playbell` | Task or nil | `nil` | Task handles for timed sound playback |
| `task_newtrophyweighed` | Task or nil | `nil` | Delayed task to re-enable item acceptance after animation |

## Main functions
### `SetDigits(inst, weight)`
*   **Description:** Updates the visual digit display using animation overrides. Displays "≤10.00" for zero or null weights, and a formatted 6-digit string (e.g., "002505") for numeric weights, with color variation (first three digits black, last two white).
*   **Parameters:** `inst` (Entity) — the scale instance; `weight` (number or string or nil) — weight value to display.
*   **Returns:** Nothing.

### `DropItem(inst, data)`
*   **Description:** Spawns the item represented by `data` onto the ground, offset from the scale's position in a random horizontal direction.
*   **Parameters:** `inst` (Entity) — the scale instance; `data` (table or nil) — item data from `trophyscale.item_data`.
*   **Returns:** Nothing.

### `onnewtrophy(inst, data_old_and_new)`
*   **Description:** Handles placement or replacement of a trophy item. Plays animations, triggers digit display updates, and schedules sounds (spin, bell) based on item weight. Marks the scale as temporarily non-accepting (`accepts_items = false`) during animation.
*   **Parameters:** `inst` (Entity); `data_old_and_new` (table) — contains `old` and `new` item data, and optionally `doer` (player who placed the item).
*   **Returns:** Nothing.

### `comparepostfn(inst, item_data, new_inst)`
*   **Description:** Post-comparison hook invoked by `trophyscale` when a new item is placed. Copies relevant attributes (`build`, `base_name`, `from_plant`, `perish_percent`, `day`, `pumpkincarvable_cutdata`) into `item_data`, preserving visual and gameplay state.
*   **Parameters:** `inst` (Entity); `item_data` (table) — target data container for persistence; `new_inst` (Entity) — the newly placed item instance.
*   **Returns:** Nothing.

### `ondeconstructstructure(inst)`
*   **Description:** Called when the scale is deconstructed. Drops the currently stored item (if any) onto the ground.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `onhammered(inst, worker)`
*   **Description:** Called when the scale is hammered. Drops current loot (via `lootdropper`) and stored item, spawns collapse FX, and removes the entity.
*   **Parameters:** `inst` (Entity); `worker` (Entity) — hammerer.
*   **Returns:** Nothing.

### `onburnt(inst)`
*   **Description:** Handles burning event. Cancels pending sound tasks, drops the stored item, clears internal item data, and invokes `DefaultBurntStructureFn`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `getdesc(inst, viewer)`
*   **Description:** Provides localized descriptive text for inspection. Returns descriptions for burnt, burning, or item-holding states; otherwise returns the base description.
*   **Parameters:** `inst` (Entity); `viewer` (Entity) — the inspecting player.
*   **Returns:** String or nil — description text or nil if no custom description exists.

### `onsave(inst, data)`
*   **Description:** Saves burn state into `data.burnt` if the scale is burnt or burning.
*   **Parameters:** `inst` (Entity); `data` (table) — save data table.
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Restores visual and animation state on load based on `data.burnt` and stored `trophyscale.item_data`. Re-applies digit display, build symbols, animations, and pumpkin carving FX if needed.
*   **Parameters:** `inst` (Entity); `data` (table or nil) — loaded data.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` — triggers initial animation and sound on placement.
- **Listens to:** `onnewtrophy` — handles new/replace item logic and animations.
- **Listens to:** `ondeconstructstructure` — triggers item drop on deconstruction.
- **Pushes:** `takeoversizedpicture` — fired on new trophy placement when from plant and `doer` has a beard component; sends plant, weight, beard skin, and length to the player.