---
id: rabbithouse
title: Rabbithouse
description: Manages a structured spawning point for Bunnymen with lighting, burnable physics, and world-state-aware door mechanics in DST.
tags: [spawner, environment, lighting, obstacle]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 569799b9
system_scope: environment
---

# Rabbithouse

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`rabbithouse` is a prefab definition for a decorative and functional structure that spawns Bunnymen over time. It integrates with multiple core systems: lighting, obstacle physics, spawner logic, workable interactions (e.g., hammering), burnable state management, and world-state observables (cave day/night cycles, acid rain). It also handles proper child release and health restoration upon vacating, as well as load/save persistence across game sessions.

## Usage example
While this is a prefab definition (not a reusable component class), a modder would typically reference its component interactions like this:
```lua
local house = SpawnPrefab("rabbithouse")
house.Transform:SetPosition(x, y, z)

-- Verify spawner state
if house.components.spawner ~= nil then
    local is_occupied = house.components.spawner:IsOccupied()
    house.components.spawner:ReleaseChild() -- forces early release
end

-- Extinguish if burning
if house.components.burnable ~= nil and house.components.burnable:IsBurning() then
    house.components.burnable:Extinguish()
end
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `spawner`, `inspectable`, `burnable`, `propagator`, `health`, `drownable`, `fueled`, `light`
**Tags added:** `cavedweller`, `structure`  
**Tags checked:** `burnt`, `structure` (in loot logic), `burnt` in burn-related callbacks.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inittask` | `Task` (or `nil`) | `nil` | Delayed initialization task; used to defer cave-day watch registration. |
| `doortask` | `Task` (or `nil`) | `nil` | Task used to delay door release after cave day ends. |
| `glow_fx` | `Entity` (or `nil`) | `nil` | Optional visual effect attached to the house (used in special states). |
| `lightson` | boolean | `false` (not explicitly defined here, but referenced in `getstatus`) | Logical flag indicating if the house is lit (set externally, e.g., by spawner state). |
| `getstatus` | function | `getstatus` | Callback for `inspectable` to report state (`FULL`, `BURNT`, or `nil`). |

## Main functions
### `SpawnCheckCaveDay(inst)`
*   **Description:** Registers world-state listeners for `stopcaveday` and `isacidraining`, and immediately releases any occupied spawner child if cave day is not active or the house is burning.
*   **Parameters:** `inst` (`Entity`) — the rabbithouse entity instance.
*   **Returns:** Nothing.

### `OnStopCaveDay(inst)`
*   **Description:** If the house is not burnt and occupied, schedules a delayed door release (`onstopcavedaydoortask`) to allow Bunnymen to exit after cave day ends.
*   **Parameters:** `inst` (`Entity`).
*   **Returns:** Nothing.

### `OnAcidRainingChanged(inst, isacidraining)`
*   **Description:** When acid rain stops, triggers `OnStopCaveDay` if cave day is also not active, ensuring proper exit timing during concurrent events.
*   **Parameters:**  
    `inst` (`Entity`) — house instance.  
    `isacidraining` (`boolean`) — new world acid rain state.
*   **Returns:** Nothing.

### `oninit(inst)`
*   **Description:** The initialization callback. Schedules `SpawnCheckCaveDay` with a small random delay, and pre-spawns a Bunnyman if the spawner is unoccupied and not pending spawn.
*   **Parameters:** `inst` (`Entity`).
*   **Returns:** Nothing.

### `onhammered(inst, worker)`
*   **Description:** Handles hammering: extinguishes fire (if burning), cancels any pending door task, releases the occupied spawner child, drops loot, spawns a collapse effect, and removes the house.
*   **Parameters:**  
    `inst` (`Entity`) — house instance.  
    `worker` (`Entity`) — entity performing the hammer action.
*   **Returns:** Nothing.

### `onhit(inst, worker)`
*   **Description:** Visual feedback on hit: plays `hit` animation on both main and optional glow FX, then returns to `idle`.
*   **Parameters:**  
    `inst` (`Entity`) — house instance.  
    `worker` (`Entity`) — entity delivering the hit.
*   **Returns:** Nothing.

### `onvacate(inst, child)`
*   **Description:** Clean-up when a spawned Bunnyman returns home: restores health to full, emits `onvacatehome`, and re-evaluates drownable state if present. Does not run if burnt.
*   **Parameters:**  
    `inst` (`Entity`) — house instance.  
    `child` (`Entity?`) — the returning Bunnyman entity.
*   **Returns:** Nothing.

### `onburntup(inst)`
*   **Description:** Cleanup upon burn completion: cancels door and init tasks, removes glow FX, and leaves the house in a burnt state.
*   **Parameters:** `inst` (`Entity`).
*   **Returns:** Nothing.

### `onignite(inst)`
*   **Description:** Immediately releases any occupied spawner child when fire ignites.
*   **Parameters:** `inst` (`Entity`).
*   **Returns:** Nothing.

### `onsave(inst, data)`
*   **Description:** Serializes burnt state into the save data.
*   **Parameters:**  
    `inst` (`Entity`) — house instance.  
    `data` (`table`) — save data table.
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Restores burnt state from save data by invoking `burntup` handler.
*   **Parameters:**  
    `inst` (`Entity`) — house instance.  
    `data` (`table?`) — loaded save data (may be `nil`).
*   **Returns:** Nothing.

### `onbuilt(inst)`
*   **Description:** Plays placement animation and sound when built by a player.
*   **Parameters:** `inst` (`Entity`).
*   **Returns:** Nothing.

### `getstatus(inst)`
*   **Description:** Inspectable status callback: returns `"BURNT"`, `"FULL"` (if lit, spawner occupied), or `nil`.
*   **Parameters:** `inst` (`Entity`).
*   **Returns:** `string?` — status string or `nil`.

### `OnPreLoad(inst, data)`
*   **Description:** Loads spawner delay configuration before full load via `WorldSettings_Spawner_PreLoad`.
*   **Parameters:**  
    `inst` (`Entity`) — house instance.  
    `data` (`table`) — raw save data.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `burntup` — triggers `onburntup`.  
  `onignite` — triggers `onignite`.  
  `onbuilt` — triggers `onbuilt`.  
  `stopcaveday` — triggers `OnStopCaveDay`.  
  `isacidraining` — triggers `OnAcidRainingChanged`.  
- **Pushes:**  
  `onvacatehome` — via `onvacate` when child returns.  
  `entity_droploot` — via `lootdropper:DropLoot()` internally.  
  (No direct `PushEvent` calls in this file beyond those implied by components.)
