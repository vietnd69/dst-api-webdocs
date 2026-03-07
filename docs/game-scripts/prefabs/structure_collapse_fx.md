---
id: structure_collapse_fx
title: Structure Collapse Fx
description: Creates non-persistent visual and audio effects for structure collapse events.
tags: [fx, sound, visual, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 89d29a9a
system_scope: fx
---

# Structure Collapse Fx

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`structure_collapse_fx` is a prefabs module that defines two FX-only prefabs (`collapse_big` and `collapse_small`) for visual and audio feedback when structures are destroyed. These prefabs use a proxy system to inherit transform data (position/rotation) from the collapsed structure and spawn localized effects (smoke, debris animation, and sound) on the client side. The component is not persisted and only spawns on non-dedicated servers and clients.

## Usage example
```lua
-- The prefabs are typically spawned via the game's internal structure destruction logic.
-- Example usage in a mod (rarely needed directly):
local fx = Prefab("collapse_big", makefn("collapse_large"), assets)
local inst = SpawnPrefab("collapse_big")
inst.SetMaterial("rock") -- Sets the material for sound selection (client-side only)
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `soundemitter`, `network` (`net_tinybyte`)
**Tags:** `NOCLICK`, `FX`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `material` | `net_tinybyte` | `0` | Networked value mapping to `MATERIAL_NAMES`; controls which destruction sound to play. |

## Main functions
### `SetMaterial(inst, material)`
*   **Description:** Sets the material type on the networked `material` property, which determines the sound played during collapse.
*   **Parameters:** `material` (string) – one of `"wood"`, `"metal"`, `"rock"`, `"stone"`, `"straw"`, `"pot"`, or `"none"`.
*   **Returns:** Nothing.
*   **Error states:** Defaults to `0` ( `"none"` ) if `material` is unrecognized.

### `makefn(anim)`
*   **Description:** Factory function that returns a prefabs spawn function for a specific animation (`"collapse_large"` or `"collapse_small"`). Used to generate the two exported prefabs.
*   **Parameters:** `anim` (string) – name of the animation bank to play (e.g., `"collapse_large"`).
*   **Returns:** A function that instantiates and configures the FX entity.
*   **Error states:** Does nothing on dedicated servers (non-rendering context); FX entity only spawns via deferred task.

### `playfx(proxy, anim)`
*   **Description:** Internal helper that spawns a temporary, non-persistent FX entity using the proxy's position and plays animation/sound.
*   **Parameters:** 
    - `proxy` (Entity) – the source entity whose transform data is inherited.
    - `anim` (string) – animation name to play.
*   **Returns:** Nothing.
*   **Error states:** Does not play sound if `material` maps to `"none"`; relies on `proxy.material:value()` being valid.

## Events & listeners
- **Listens to:** `animover` – automatically removes the FX entity when its animation completes (in `playfx`).
- **Pushes:** None.