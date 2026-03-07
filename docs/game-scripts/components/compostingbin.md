---
id: compostingbin
title: Compostingbin
description: Manages composting progress and material storage for composting bins, calculating processing time based on green-to-brown material ratios.
tags: [crafting, inventory, timer, environment]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 890a9275
system_scope: crafting
---

# Compostingbin

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Compostingbin` manages the state and processing logic for composting bins in DST. It tracks green and brown organic materials, computes composting duration based on the ratio of materials, and handles composting cycles via a timer. It interacts with the `stackable` component to consume items and the `timer` component to manage composting progress. The component supports dynamic callbacks for custom behavior during composting lifecycle events.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("compostingbin")
inst.components.compostingbin.calcmaterialvalue = function(bin, item)
    return { greens = item:HasTag("veggie") and 1 or 0, browns = item:HasTag("deadplant") and 1 or 0 }
end
inst.components.compostingbin:Refresh()
```

## Dependencies & tags
**Components used:** `stackable`, `timer`  
**Tags:** Adds or removes `compostingbin_accepts_items` based on `accepts_items` state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `max_materials` | number | `6` | Maximum total amount of green/brown materials allowed. |
| `greens` | number | `0` | Current count of green materials (e.g., veggies). |
| `browns` | number | `0` | Current count of brown materials (e.g., dead plants). |
| `materials_per_fertilizer` | number | `2` | Not used in current implementation. |
| `greens_ratio` | number or nil | `nil` | Ratio of greens to total materials (computed on refresh). |
| `composting_time_min` | number | `6` | Minimum composting duration in seconds (when ratio is 50/50). |
| `composting_time_max` | number | `20` | Maximum composting duration in seconds (when ratio is 0/100 or 100/0). |
| `current_composting_time` | number or nil | `nil` | Current duration of the active composting cycle (seconds). |
| `accepts_items` | boolean | `true` | Controls whether the bin accepts new compostable items. |
| `calcdurationmultfn` | function or nil | `nil` | Optional custom function to scale composting time (signature: `(bin_inst) -> number`). |
| `calcmaterialvalue` | function or nil | `nil` | Required function to compute material contribution of an item (signature: `(bin_inst, item) -> {greens, browns}`). |
| `onaddcompostable` | function or nil | `nil` | Callback fired when an item is added (signature: `(bin_inst, item)`). |
| `finishcyclefn` | function or nil | `nil` | Callback fired at the end of each composting cycle (signature: `(bin_inst)`). |
| `onstartcompostingfn` | function or nil | `nil` | Callback fired when composting starts (signature: `(bin_inst)`). |
| `onstopcompostingfn` | function or nil | `nil` | Callback fired when composting stops (signature: `(bin_inst)`). |
| `onrefreshfn` | function or nil | `nil` | Callback fired when `Refresh()` is called (signature: `(bin_inst, cycle_completed)`). |

## Main functions
### `GetMaterialTotal()`
* **Description:** Returns the total count of green and brown materials stored.
* **Parameters:** None.
* **Returns:** `number` — sum of `greens` and `browns`.

### `IsFull()`
* **Description:** Returns whether the bin is at its maximum material capacity (`max_materials`).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `GetMaterialTotal() >= max_materials`, otherwise `false`.

### `Refresh(cycle_completed)`
* **Description:** Recalculates and updates the composting timer based on current material ratio and duration modifiers. Starts composting if sufficient materials are present, or stops it if below threshold.
* **Parameters:** `cycle_completed` (boolean) — whether a full composting cycle just finished.
* **Returns:** Nothing.
* **Error states:** If `calcmaterialvalue` or `calcdurationmultfn` are required by external logic (e.g., item validation), missing functions may cause runtime issues during item processing.

### `AddCompostable(item)`
* **Description:** Attempts to add a compostable item, using `calcmaterialvalue` to determine its contribution. Removes the item after processing.
* **Parameters:** `item` (Entity) — the item to compost.
* **Returns:** `boolean` — `true` if successfully composted, `false` if `calcmaterialvalue` is missing or returns `nil`/`false`.
* **Error states:** If `calcmaterialvalue` is `nil`, returns `false` without modifying state. If the item has a `stackable` component, it consumes one unit; otherwise, removes the item entirely.

### `AddMaterials(greens, browns)`
* **Description:** Increases the internal `greens` and `browns` counts and triggers a `Refresh()` to update composting time.
* **Parameters:** `greens` (number, optional) — amount of green materials to add. `browns` (number, optional) — amount of brown materials to add.
* **Returns:** Nothing.

### `IsComposting()`
* **Description:** Checks whether composting is currently active (i.e., a `composting` timer exists).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if the `composting` timer exists.

### `OnSave()`
* **Description:** Serializes state for world saving when necessary (i.e., if composting is active or materials are present).
* **Parameters:** None.
* **Returns:** `table` with keys `greens`, `browns`, and optionally `current_composting_time`, or `nil` if no state to save.

### `OnLoad(data)`
* **Description:** Restores saved state after world loading.
* **Parameters:** `data` (table) — contains `greens`, `browns`, and optionally `current_composting_time`.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `timerdone` — triggers `ontimerdone` to finalize composting cycles (contributes 1 green and 1 brown material per cycle, or reduces larger stacks proportionally).
- **Pushes:** None directly. External callbacks (`finishcyclefn`, `onstartcompostingfn`, `onstopcompostingfn`, `onrefreshfn`) may indirectly fire custom events.
