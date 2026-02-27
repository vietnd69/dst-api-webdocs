---
id: compostingbin
title: Compostingbin
description: This component manages the state and logic for a composting bin, handling material input, processing, and triggering the production of compost.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: environment
source_hash: 890a9275
---

# Compostingbin

## Overview
The `Compostingbin` component is responsible for managing the lifecycle and mechanics of a composting structure in Don't Starve Together. It tracks the quantities of "greens" and "browns" materials, calculates optimal composting times based on their ratio, processes materials over time, and triggers the completion of composting cycles. It also handles adding compostable items and saving/loading its state.

## Dependencies & Tags
*   **Dependencies:** This component implicitly relies on the `timer` component being present on the entity (`inst.components.timer`).
*   **Tags:**
    *   Adds/Removes `"compostingbin_accepts_items"`: This tag is added to the entity when `self.accepts_items` is `true` and removed when it is `false`, indicating whether the bin is currently accepting new compostable items.

## Properties
| Property                  | Type           | Default Value | Description                                                                                             |
| :------------------------ | :------------- | :------------ | :------------------------------------------------------------------------------------------------------ |
| `inst`                    | `Entity`       | -             | A reference to the entity this component is attached to.                                                |
| `max_materials`           | `number`       | `6`           | The maximum combined total of greens and browns materials the bin can hold.                             |
| `greens`                  | `number`       | `0`           | The current quantity of "greens" materials in the bin.                                                  |
| `browns`                  | `number`       | `0`           | The current quantity of "browns" materials in the bin.                                                  |
| `materials_per_fertilizer`| `number`       | `2`           | The number of materials (combined greens/browns) consumed per composting cycle to produce fertilizer.   |
| `greens_ratio`            | `number`       | `nil`         | The ratio of greens to total materials, calculated during `Refresh`.                                    |
| `composting_time_min`     | `number`       | `6`           | The minimum time in seconds for a composting cycle.                                                     |
| `composting_time_max`     | `number`       | `20`          | The maximum time in seconds for a composting cycle.                                                     |
| `current_composting_time` | `number`       | `nil`         | The dynamically calculated duration for the current composting cycle.                                   |
| `accepts_items`           | `boolean`      | `true`        | Determines if the composting bin is currently able to receive new items. (Automatically adds/removes tag). |
| `calcdurationmultfn`      | `function`     | `nil`         | Optional callback function `(inst)` to calculate a multiplier for composting duration.                  |
| `calcmaterialvalue`       | `function`     | `nil`         | Optional callback function `(inst, item)` to determine the greens/browns value of an `item`.           |
| `onaddcompostable`        | `function`     | `nil`         | Optional callback function `(inst, item)` triggered when an item is successfully added.                 |
| `finishcyclefn`           | `function`     | `nil`         | Optional callback function `(inst)` triggered when a composting cycle is completed.                     |
| `onstartcompostingfn`     | `function`     | `nil`         | Optional callback function `(inst)` triggered when composting officially starts.                        |
| `onstopcompostingfn`      | `function`     | `nil`         | Optional callback function `(inst)` triggered when composting officially stops.                         |
| `onrefreshfn`             | `function`     | `nil`         | Optional callback function `(inst, cycle_completed)` triggered when the bin's state is refreshed.       |

## Main Functions
### `CompostingBin:OnRemoveFromEntity()`
*   **Description:** Cleans up the event listener when the component is removed from its entity.
*   **Parameters:** None.

### `CompostingBin:GetMaterialTotal()`
*   **Description:** Returns the combined total quantity of greens and browns currently in the bin.
*   **Parameters:** None.

### `CompostingBin:IsFull()`
*   **Description:** Checks if the total materials in the bin have reached or exceeded `max_materials`.
*   **Parameters:** None.

### `CompostingBin:Refresh(cycle_completed)`
*   **Description:** Updates the composting state of the bin. It calculates the `greens_ratio`, determines the `current_composting_time` based on this ratio and an optional duration multiplier, and either starts/restarts the "composting" timer or stops it if materials are insufficient. It also triggers the `onrefreshfn` callback.
*   **Parameters:**
    *   `cycle_completed`: `boolean`, indicates if the refresh is being called after a composting cycle has just finished.

### `CompostingBin:AddCompostable(item)`
*   **Description:** Attempts to add a compostable `item` to the bin. It uses the `calcmaterialvalue` callback to determine the item's greens and browns value. If successful, the item is consumed, and the materials are added to the bin, triggering `onaddcompostable` and `Refresh`.
*   **Parameters:**
    *   `item`: The `Entity` representing the compostable item to add.
*   **Returns:** `true` if the item was successfully added, `false` otherwise.

### `CompostingBin:AddMaterials(greens, browns)`
*   **Description:** Increases the `greens` and `browns` counts in the bin by the specified amounts, then calls `Refresh` to update the composting process.
*   **Parameters:**
    *   `greens`: `number`, the amount of greens to add (defaults to 0 if `nil`).
    *   `browns`: `number`, the amount of browns to add (defaults to 0 if `nil`).

### `CompostingBin:IsComposting()`
*   **Description:** Checks if the "composting" timer is currently active, indicating that the bin is in the process of composting.
*   **Parameters:** None.

### `CompostingBin:OnSave()`
*   **Description:** Returns a table containing the current `greens`, `browns`, and `current_composting_time` for saving the component's state, but only if there are materials or composting is in progress.
*   **Parameters:** None.
*   **Returns:** `table` or `nil`.

### `CompostingBin:OnLoad(data)`
*   **Description:** Loads the component's state from saved `data`, restoring the `greens`, `browns`, and `current_composting_time`. It also recalculates `greens_ratio` if materials are present.
*   **Parameters:**
    *   `data`: `table`, the saved data for the component.

## Events & Listeners
*   **Listens For:**
    *   `"timerdone"`: Triggered by the `timer` component when a named timer expires. The `ontimerdone` local function handles the "composting" timer, consuming materials and potentially triggering `finishcyclefn`.