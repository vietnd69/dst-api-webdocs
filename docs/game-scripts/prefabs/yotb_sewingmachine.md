---
id: yotb_sewingmachine
title: Yotb Sewingmachine
description: Provides a structure-based crafting interface for beefalo sewing recipes, managing sewing state, animations, sound, and interaction callbacks.
tags: [crafting, entity, interaction, structure]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 069e5980
system_scope: crafting
---

# Yotb Sewingmachine

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `yotb_sewingmachine` prefab is a structure-based crafting station used for sewing beefalo clothing and accessories. It integrates with the `container` component for item storage, the `yotb_sewer` component for managing sewing progress and callbacks, and the `workable` component to handle hammering interactions. It supports being burnt (transitioning to a burnt state) and stores its burnt status in save data. Animations and sounds are synchronized with its sewing and UI states via custom callbacks.

## Usage example
```lua
-- Place a sewing machine in the world
local machine = SpawnPrefab("yotb_sewingmachine")
machine.Transform:SetPosition(world_x, world_y, world_z)

-- Interact with its container to insert items
if machine.components.container then
    machine.components.container:GetSlot(1):PushItem(some_item)
end

-- Start sewing via the yotb_sewer component (typically initiated by player action)
if machine.components.yotb_sewer then
    machine.components.yotb_sewer:StartSewing(recipe_index)
end
```

## Dependencies & tags
**Components used:** `container`, `yotb_sewer`, `workable`, `hauntable`, `burnable`, `lootdropper`, `inspectable`, `fueled`, `propagator`, `freezeable`, `lunar_hail_buildup`, `snow_covered`, `deployable`, `physics`, `obstacle`, `transform`, `animstate`, `soundemitter`, `minimapentity`, `network`.

**Tags:** Adds `"structure"` and `"sewingmachine"` to the entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onopenfn` | function | `onopen` | Called when the container is opened; triggers animation and sound. |
| `onclosefn` | function | `onclose` | Called when the container is closed; triggers animation and sound. |
| `skipclosesnd` | boolean | `true` | Suppresses default close sound if set. |
| `skipopensnd` | boolean | `true` | Suppresses default open sound if set. |

## Main functions
### `onhammered(inst, worker)`
*   **Description:** Handles hammering the sewing machine. Extinguishes fire if burning, empties the container, drops loot, spawns debris FX, and removes the entity.
*   **Parameters:** `inst` (entity) - the sewing machine instance; `worker` (entity) - the entity performing the action.
*   **Returns:** Nothing.

### `onhit(inst, worker)`
*   **Description:** Triggered during work progress. Closes the container if open and plays a brief hit animation.
*   **Parameters:** `inst` (entity) - the sewing machine instance; `worker` (entity) - the entity performing work.
*   **Returns:** Nothing.

### `OnStartSewing(inst)`
*   **Description:** Triggered at the start of a sewing operation. Plays active animation and loop sound.
*   **Parameters:** `inst` (entity) - the sewing machine instance.
*   **Returns:** Nothing.

### `OnContinueSewing(inst)`
*   **Description:** Triggered when sewing resumes after a pause. Reinitializes active animation and loop sound.
*   **Parameters:** `inst` (entity) - the sewing machine instance.
*   **Returns:** Nothing.

### `OnContinueDone(inst)`
*   **Description:** Triggered after resuming sewing completes a small step. Resets animation to idle frame.
*   **Parameters:** `inst` (entity) - the sewing machine instance.
*   **Returns:** Nothing.

### `OnDoneSewing(inst)`
*   **Description:** Triggered when a full sewing task completes. Plays spit animation, stops sound, and emits completion sounds.
*   **Parameters:** `inst` (entity) - the sewing machine instance.
*   **Returns:** Nothing.

### `onsave(inst, data)`
*   **Description:** Saves the burnt state to persistent storage.
*   **Parameters:** `inst` (entity) - the sewing machine instance; `data` (table) - save data table.
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Loads burnt state from save data and transitions the entity if burnt.
*   **Parameters:** `inst` (entity) - the sewing machine instance; `data` (table) - loaded save data.
*   **Returns:** Nothing.

### `getstatus(inst)`
*   **Description:** Returns a string status indicator for UI or debugging.
*   **Parameters:** `inst` (entity) - the sewing machine instance.
*   **Returns:** `"BURNT"` if the entity is burnt, otherwise `"EMPTY"`.

## Events & listeners
- **Listens to:** `onbuilt` - triggers `onbuilt` callback to play placement animation and sound.

- **Pushes:** `onopen`, `onclose`, `onextinguish`, `onhit` (via `workable`), `onhammered` (via `workable`), `entity_droploot` (via `lootdropper`).
