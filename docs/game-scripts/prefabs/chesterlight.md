---
id: chesterlight
title: Chesterlight
description: Manages the animated light source for Chester's Eye, dynamically adjusting radius and animation state when turned on or off.
tags: [light, fx, entity]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 66305cd9
system_scope: fx
---

# Chesterlight

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`chesterlight` is a lightweight prefab component that controls the visual and networked behavior of an animated light source, typically used for Chester's Eye in the Caves. It manages animation transitions ("on"/"off"), light radius interpolation over discrete frames, and server-client synchronization via replicated network variables (`net_tinybyte` and `net_bool`). The component is self-contained and does not depend on other components beyond core entity services (`Transform`, `AnimState`, `Light`, `Network`).

## Usage example
```lua
local light = SpawnPrefab("chesterlight")
light.Transform:SetPosition(x, y, z)
light:TurnOn()  -- animate and start emitting light
-- ...
light:TurnOff() -- animate fade-out and stop emitting light
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `NOCLICK` and `FX`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_lightframe` | `net_tinybyte` | `0` | Networked frame counter (0–6), controls light radius interpolation. |
| `_islighton` | `net_bool` | `false` | Networked boolean indicating whether the light is currently active. |
| `_lighttask` | `PeriodicTask?` | `nil` | Ongoing task used to animate the light state change. |

## Main functions
### `TurnOn()`
* **Description:** Initiates the "on" animation sequence and activates the light source. Sets `_islighton` to true, plays the "on" animation, then transitions to an idle loop, and starts the light interpolation task.
* **Parameters:** None.
* **Returns:** Nothing.

### `TurnOff()`
* **Description:** Initiates the "off" animation sequence to fade out the light. Sets `_islighton` to false, plays the "off" animation, and schedules removal of the entity upon animation completion.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdateLight(inst, dframes)`
* **Description:** Internal callback used by the periodic task to increment or decrement `_lightframe`, updating the light radius accordingly. Stops the task when the animation completes (frame reaches 0 or `MAX_LIGHT_FRAME`).
* **Parameters:**  
  - `inst` (Entity) – the entity instance.  
  - `dframes` (number) – frame delta to apply (positive for on, negative for off).  
* **Returns:** Nothing.
* **Error states:** Cancels `_lighttask` and sets it to `nil` when animation completes.

### `OnLightDirty(inst)`
* **Description:** Ensures the light interpolation task is running; triggers an immediate update pass. Called on state change and when network state is updated client-side.
* **Parameters:** `inst` (Entity) – the entity instance.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `lightdirty` – triggers `OnLightDirty` to refresh light state on non-master clients.  
- **Pushes:** None identified.  
- **Anim event:** Listens to `animover` during `TurnOff` to remove the entity once the "off" animation completes.