---
id: mushroom_light
title: Mushroom Light
description: Manages the lighting, state transitions, and decay behavior of mushroom-based lanterns in DST, including battery-powered operation, spore-based colour tinting, and structural collapse when damaged.
tags: [lighting, inventory, decay, structure]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1d16eed2
system_scope: environment
---

# Mushroom Light

> Based on game build **7140014** | Last updated: 2026-03-06

## Overview
`mushroom_light` is a high-level prefab constructor that defines the behaviour of mushroom lanterns (`mushroom_light` and `mushroom_light2`). It handles dynamic light properties (radius, intensity, colour) based on contained batteries and spores, decay via the `preserver` component, structural destruction upon hammering via `workable`, and loot generation via `lootdropper`. It integrates closely with `burnable`, `container`, `inspectable`, and `preserver` components to reflect real-time state changes in both visual and gameplay systems.

## Usage example
```lua
-- Example of creating and using a mushroom light (e.g. in a mod)
local light = SpawnPrefab("mushroom_light")
light.Transform:SetPosition(world_x, world_y, world_z)

-- Insert batteries and spores to activate and tint
local battery = SpawnPrefab("lightbattery")
local spore = SpawnPrefab("mushroom_spore_red")
light.components.container:PushItem(battery)
light.components.container:PushItem(spore)

-- Light updates automatically on item changes via `itemget`/`itemlose` events
```

## Dependencies & tags
**Components used:** `burnable`, `container`, `inspectable`, `lootdropper`, `preserver`, `workable`, `propagator`, `hauntable`, `obstacle`, `physics`, `animstate`, `light`, `soundemitter`, `transform`, `network`  
**Tags:** Adds `structure`, `lamp`; checks `burnt`, `lightbattery`, `spore`, `lightcontainer`, `fulllighter`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onlywhite` | boolean | `true` (for `mushroom_light`) or `false` (for `mushroom_light2`) | Controls whether colour-tinting from spores is enabled (`false` allows disco-style tinting). |
| `_soundtask` | Task (optional) | `nil` | Reference to a delayed sound task; cancels existing tasks on new actions. |

## Main functions
### `UpdateLightState(inst)`
*   **Description:** Recalculates and applies light radius, intensity, and colour based on the number of batteries and spores in the container. Adjusts the `preserver` perish rate depending on whether full-lighters are present.
*   **Parameters:** `inst` (Entity) – The mushroom light entity.
*   **Returns:** Nothing.
*   **Error states:** Returns early without change if `inst` is `burnt`.

### `IsLightOn(inst)`
*   **Description:** Helper function to determine if the light is currently enabled.
*   **Parameters:** `inst` (Entity).
*   **Returns:** `true` if `inst.Light:IsEnabled()` returns `true`, otherwise `false`.

### `onworkfinished(inst)`
*   **Description:** Handles destruction of the lantern after hammering completes: drops container contents, spawns a collapse FX prefab, drops loot, and removes the entity.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `onworked(inst, worker, workleft)`
*   **Description:** Handles interactions during hammering (pre-finish). Drops container contents, closes the container, and plays appropriate hit animations/sounds based on light state.
*   **Parameters:** `inst` (Entity), `worker` (Entity), `workleft` (number).
*   **Returns:** Nothing.
*   **Error states:** If `workleft > 0` and the lantern is not `burnt`, it processes the hit and returns.

### `getstatus(inst)`
*   **Description:** Returns a human-readable status string for the lantern for UI or scrapbook display.
*   **Parameters:** `inst` (Entity).
*   **Returns:** `"BURNT"`, `"ON"`, or `"OFF"` depending on `burnt` tag and light state.

### `QueueSound(inst, delay, soundname)`
*   **Description:** Schedules a sound to be played after a delay (e.g., delayed colour-change chime), cancelling any previously queued sound.
*   **Parameters:** `inst` (Entity), `delay` (number, in seconds), `soundname` (string).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"onbuilt"` – Plays place animation and sound after construction.  
  - `"itemget"` – Triggers `UpdateLightState` when an item is added to container.  
  - `"itemlose"` – Triggers `UpdateLightState` when an item is removed from container.  
  - `"burntup"` – Cancels any pending sound via `ClearSoundQueue`.
- **Pushes:** None (relies on component events such as `burntup`, handled internally via callbacks).