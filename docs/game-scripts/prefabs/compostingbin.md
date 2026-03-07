---
id: compostingbin
title: Compostingbin
description: Manages the composting process, animation states, and harvest mechanics for the Composting Bin structure, including material tracking, cycle timing, and conversion of input items into compost.
tags: [crafting, resource, structure]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 552b268a
system_scope: crafting
---

# Compostingbin

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `compostingbin` prefab represents the in-game Composting Bin structure. Its primary responsibility is to manage the entire composting lifecycle — from accepting green and brown materials, tracking composting progress, animating the spinning process, and finally producing compost when a cycle completes. It integrates with several components: `compostingbin` (custom logic), `pickable` (for harvesting compost), `workable` (for hammering), `burnable` (fire resistance/burning), `timer` (cycle duration), and `hauntable`. It is a structure that contributes to player-driven resource recycling and farming workflows.

## Usage example
```lua
local bin = SpawnPrefab("compostingbin")
bin.Transform:SetPosition(world_x, world_y, world_z)
bin.components.compostingbin:AddMaterial(green_item)
bin.components.compostingbin:AddMaterial(brown_item)
-- Cycle starts automatically when sufficient materials are added
```

## Dependencies & tags
**Components used:** `burnable`, `edible`, `forcecompostable`, `hauntable`, `inspectable`, `lootdropper`, `pickable`, `timer`, `workable`, `compostingbin` (custom component attached internally)  
**Tags:** Adds `structure`; checks `burnt` and animation state tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `greens` | number | `0` | Total green materials added to the bin (for composting balance and duration). |
| `browns` | number | `0` | Total brown materials added to the bin. |
| `greens_ratio` | number | `0` | Calculated ratio of green materials (greens / (greens + browns)). Used for wet/dry balance. |
| `max_materials` | number | `TUNING.COMPOSTINGBIN_MAX_MATERIALS` | Maximum number of compostable items the bin can hold before full. |
| `accepts_items` | boolean | `true` | Whether the bin is currently accepting new materials. |
| `composting_time_min` | number | `TUNING.COMPOSTINGBIN_COMPOSTING_TIME_MIN` | Minimum composting duration (seconds). |
| `composting_time_max` | number | `TUNING.COMPOSTINGBIN_COMPOSTING_TIME_MAX` | Maximum composting duration (seconds). |
| `onstartcompostingfn` | function | `nil` | Callback when composting begins. |
| `onstopcompostingfn` | function | `nil` | Callback when composting stops. |
| `onrefreshfn` | function | `nil` | Callback to refresh visual layers (e.g., animation updates). |
| `finishcyclefn` | function | `nil` | Callback executed when a composting cycle finishes. |
| `calcdurationmultfn` | function | `nil` | Callback returning a multiplier for composting time (based on material count). |
| `calcmaterialvalue` | function | `nil` | Callback to compute green/brown contribution of an item. |
| `onaddcompostable` | function | `nil` | Callback executed when an item is added to the bin. |

*Note:* These properties belong to the `compostingbin` component attached in the constructor. They are initialized or set via configuration callbacks and tunings.

## Main functions
The `compostingbin` component’s logic is driven primarily by callbacks and internal functions. The following functions are called during operation, though they are not all exposed as public component methods.

### `AddMaterial(item)`
*   **Description:** Adds a compostable item to the bin, updating green/brown totals and starting the composting cycle if materials are sufficient. Returns a boolean indicating success.
*   **Parameters:** `item` (TheItemInstance) — the item to compost.
*   **Returns:** `true` if the item was accepted; `false` otherwise (e.g., bin full, invalid material).
*   **Error states:** Returns `false` if `accepts_items` is `false`, or if `calcmaterialvalue(item)` returns `nil`.

### `GetMaterialTotal()`
*   **Description:** Returns the total amount of compostable material currently in the bin.
*   **Parameters:** None.
*   **Returns:** `number` — sum of `greens` and `browns`.
*   **Error states:** Returns `0` if `greens` or `browns` are `nil`.

### `IsComposting()`
*   **Description:** Checks if the bin is currently in an active composting cycle.
*   **Parameters:** None.
*   **Returns:** `true` if the `"composting"` timer exists; `false` otherwise.

### `ClearMaterials()`
*   **Description:** Resets `greens` and `browns` to `0`, effectively emptying the bin. Does not stop timers; should be used with caution.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `onburnt` — triggers `onburnt` handler to extinguish fire, stop composting timer, and lock the bin.
  - `onbuilt` — plays placement animation and sound.
  - `timerdone` — handles cycle completion (`ontimerdone`).
  - `animqueueover` — resumes spinning animation after a queue (e.g., door opening).
  - `death` — indirectly handled by `burnable` to stop burning.
- **Pushes:** Events are mostly internal and handled by callbacks; no custom events are pushed by this prefab itself.
