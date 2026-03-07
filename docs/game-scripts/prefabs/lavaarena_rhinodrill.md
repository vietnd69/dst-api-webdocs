---
id: lavaarena_rhinodrill
title: Lavaarena Rhinodrill
description: Prefab factory for the Lava Arena rhinodrill mob, managing visual state, buff levels, and camera focus tracking via networked properties and world components.
tags: [boss, mob, lavaarena, visual, network]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 781135d2
system_scope: entity
---

# Lavaarena Rhinodrill

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This file defines prefabs for the Lava Arena rhinodrill creature and associated visual effects (including broken fossilized rock FX). It primarily acts as a factory that constructs entity instances with baked-in support for buff level visualization (via a pulse FX entity) and dynamic camera focus control. The component logic is implemented directly in the prefab factory, not as a standalone component — functionality is attached to the `inst` via methods like `SetBuffLevel` and `EnableCameraFocus` on the master simulation.

## Usage example
```lua
-- Spawn a default rhinodrill instance (server-side)
local rhino = SpawnPrefab("rhinodrill")

-- Set buff level (0–7), which triggers a client-side pulse effect
if rhino.SetBuffLevel then
    rhino:SetBuffLevel(5)
end

-- Enable camera focus for the mob
if rhino.EnableCameraFocus then
    rhino:EnableCameraFocus(true)
end
```

## Dependencies & tags
**Components used:**  
- `TheWorld.components.lavaarenamobtracker` — calls `StartTracking(inst)` to register the mob.  
- `TheFocalPoint.components.focalpoint` — calls `StartFocusSource` / `StopFocusSource` for camera control.  

**Tags added:**  
- `"DECOR"` / `"NOCLICK"` — on pulse FX entity (`CreatePulse`)  
- `"FX"` — on fossilized break FX entities  
- `"LA_mob"` / `"monster"` / `"hostile"` / `"largecreature"` / `"fossilizable"` — on rhinodrill entity  

## Properties
No public instance properties are initialized in the constructor. Properties are managed via networked variables and methods:
- `inst._bufflevel` — networked tinybyte, range `[0,7]`, bound to `"buffleveldirty"` event  
- `inst._camerafocus` — networked bool, bound to `"camerafocusdirty"` event  

## Main functions
### `SetBuffLevel(inst, level)`
*   **Description:** Sets the buff level (clamped to 0–7), updating the networked value and triggering visual FX updates on clients.  
*   **Parameters:** `level` (number) — buff level to set. Values are clamped to `[0, 7]`.  
*   **Returns:** Nothing.  

### `EnableCameraFocus(inst, enable)`
*   **Description:** Enables or disables camera focus tracking for this entity. When enabled, registers with `TheFocalPoint` as a focus source; when disabled, unregisters it.  
*   **Parameters:** `enable` (boolean) — whether to activate camera focus.  
*   **Returns:** Nothing.  

### `CreatePulse()`
*   **Description:** Creates and returns a short-lived FX entity that pulses in sync with buff level. This is used client-side to visualize buff status on the rhinodrill.  
*   **Parameters:** None.  
*   **Returns:** `Entity` — a non-networked, non-persistent FX entity with `inst.level`, `inst.task`, and animation state set.  

### `OnBuffLevelDirty(inst)`
*   **Description:** Client-side callback triggered when `_bufflevel` changes. Spawns or destroys the pulse FX entity based on the new level.  
*   **Parameters:** None.  
*   **Returns:** Nothing.  

### `OnCameraFocusDirty(inst)`
*   **Description:** Client-side callback that syncs camera focus state. Calls `StartFocusSource` or `StopFocusSource` on `TheFocalPoint` based on `_camerafocus` value.  
*   **Parameters:** None.  
*   **Returns:** Nothing.  

### `DoPulse(inst)`
*   **Description:** Internal helper to trigger animation and schedule next pulse or removal.  
*   **Parameters:** None.  
*   **Returns:** Nothing.  

### `OnPulseAnimOver(inst)`
*   **Description:** Handles animation-over event: cancels pending task, plays next animation, and re-schedules or removes the FX entity.  
*   **Parameters:** None.  
*   **Returns:** Nothing.  

## Events & listeners
- **Listens to:**  
  - `"animover"` — handled by `OnPulseAnimOver` to manage FX timing.  
  - `"buffleveldirty"` — handled by `OnBuffLevelDirty` (client-side only).  
  - `"camerafocusdirty"` — handled by `OnCameraFocusDirty` (client-side only).  
  - `"onremove"` — implicitly used by `TheWorld.components.lavaarenamobtracker` and `TheFocalPoint.components.focalpoint` (not directly here).  

- **Pushes:**  
  - None — events are used internally for syncing, not fired by this prefab.
