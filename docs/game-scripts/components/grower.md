---
id: grower
title: Grower
description: Manages crop growth and fertility for plot-like entities, tracking soil cycles and planted crops.
tags: [farming, fertility, growth, plot]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: f5b49a1c
system_scope: world
---

# Grower

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Grower` manages a plot of land that can be fertilized and planted with crops. It tracks the number of remaining soil cycles, maintains a list of active crops, and updates entity tags (`infertile`, `fertile`, `fullfertile`, `NOCLICK`) to reflect its state. It integrates with `plantable`, `crop`, `fertilizer`, and `cookable` components to handle planting, growth, and burnt product fallbacks.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("grower")
inst.components.grower.growrate = 0.5
inst.components.grower.max_cycles_left = 4
inst.components.grower.cycles_left = 4

-- Plant a crop using a plantable item
inst.components.grower:PlantItem(item, doer)

-- Check soil fertility
if inst.components.grower:IsFertile() then
    inst.components.grower:Fertilize(fertilizer_item, doer)
end
```

## Dependencies & tags
**Components used:** `plantable`, `crop`, `fertilizer`, `cookable`  
**Tags added/removed:** `grower`, `infertile`, `fertile`, `fullfertile`, `NOCLICK` (dynamically on plot)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `crops` | table | `{}` | Set (key-value map) of active crop entities planted on this plot. |
| `level` | number | `1` | Unused placeholder; not referenced in the current implementation. |
| `croppoints` | table | `{}` | List of offset positions (x, y, z) where crops spawn relative to the plot. |
| `growrate` | number | `1` | Multiplier applied to base grow time; lower values speed up growth. |
| `cycles_left` | number | `1` | Remaining soil fertility cycles; controls how many more crops can be planted. |
| `max_cycles_left` | number | `6` | Maximum number of soil cycles before refertilization resets. |
| `isempty` | boolean | `true` | Whether any crops are currently planted on the plot. |

## Main functions
### `OnRemoveFromEntity()`
*   **Description:** Cleans up tags when the component is removed from an entity. Removes `infertile`, `fertile`, and `fullfertile` tags.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `IsEmpty()`
*   **Description:** Returns whether any crops are currently planted on the plot.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if no crops exist, `false` otherwise.

### `IsFullFertile()`
*   **Description:** Checks if the plot is at maximum fertility (i.e., `cycles_left >= max_cycles_left`).
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if fully fertile.

### `GetFertilePercent()`
*   **Description:** Computes the ratio of remaining cycles to maximum cycles.
*   **Parameters:** None.
*   **Returns:** `number` — a value between `0` and `1`.

### `IsFertile()`
*   **Description:** Checks if any soil fertility remains (`cycles_left > 0`).
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if soil can still support planting.

### `OnSave()`
*   **Description:** Serializes crop data and soil cycles for world saving.
*   **Parameters:** None.
*   **Returns:** `table` — `{ crops = {...}, cycles_left = <number> }`.

### `Fertilize(obj, doer)`
*   **Description:** Adds fertility cycles to the plot from a fertilizer item. Plays a sound if available.
*   **Parameters:**  
    `obj` (Entity) — the fertilizer item; must have a `fertilizer` component.  
    `doer` (Entity or `nil`) — the entity applying the fertilizer; used for sound playback.  
*   **Returns:** `true` — always succeeds if called (no failure path).
*   **Error states:** If `obj.components.fertilizer` is missing, no cycles are added.

### `OnLoad(data, newents)`
*   **Description:** Restores crop state from saved data. Spawns crops, sets positions, and resumes growth tasks.
*   **Parameters:**  
    `data` (table) — deserialized data from `OnSave`.  
    `newents` (table) — mapping of saved IDs to newly spawned entities.  
*   **Returns:** Nothing.

### `PlantItem(item, doer)`
*   **Description:** Plants one or more crops on the plot, using offsets from `croppoints`. Resets plot state first and spawns `plant_normal` prefabs.
*   **Parameters:**  
    `item` (Entity) — must have a `plantable` component.  
    `doer` (Entity or `nil`) — the planter; used for event context.  
*   **Returns:** `true` on success, `false` if `item.components.plantable` is missing.
*   **Error states:** Returns `false` if `plantable` component is missing.

### `RemoveCrop(crop)`
*   **Description:** Removes a single crop entity. Decrements soil cycles if it was the last crop. Updates plot emptiness and tags.
*   **Parameters:**  
    `crop` (Entity) — the crop entity to remove.  
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a debug string for UI/debug views.
*   **Parameters:** None.
*   **Returns:** `string` — formatted like `"Cycles left5 / 6"`.

### `Reset(reason)`
*   **Description:** Clears all crops. Optionally handles fire-burnt crops: if `reason == "fire"`, produces burnt products (via `cookable.product`) or fallbacks (`ash`, `seeds_cooked`).
*   **Parameters:**  
    `reason` (string or `nil`) — pass `"fire"` for special handling of burnt plots.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `itemplanted` — pushed after planting (via `TheWorld:PushEvent("itemplanted", ...)`).  
- **Pushes:** None directly; but `itemplanted` is dispatched externally (see `PlantItem`).
- **Event listeners attached for burnt items:** When `reason == "fire"`, listens to `onpickup` and `onremove` events on the burnt product entity to remove the `NOCLICK` tag.
