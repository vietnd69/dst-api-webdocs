---
id: light_rays
title: Light Rays
description: Manages dynamic lighting and ray visibility for the canopy light rays entity based on world phase (day/dusk/night) and moon state.
tags: [environment, fx, lighting]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 58de3492
system_scope: environment
---

# Light Rays

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`light_rays` is a prefab definition for a world-space visual effect that displays dynamic light rays (e.g., sunbeams) in the environment. The effect’s visibility and intensity change based on the current world phase (`day`, `dusk`, `night`) and whether a full moon is active. It uses `AnimState` to toggle ray sprites and `DistanceFade` (on non-dedicated clients) to fade out when distant. The component interacts with the networked state `lightrays_canopy._rays` and world phase changes via `WatchWorldState`.

## Usage example
This prefab is instantiated internally by the game (e.g., during world generation for the Canopy layer). Modders typically do not add it manually, but may listen to its events or override behavior.

```lua
-- Example: Listen to rays phase updates (if added to an existing entity)
inst:ListenForEvent("raysdirty", function(inst)
    print("Rays phase updated to:", inst._rays:value())
end)
```

## Dependencies & tags
**Components used:** `distancefade` (client-only)
**Tags:** Adds `lightrays`, `exposure`, `ignorewalkableplatforms`, `NOBLOCK`, `NOCLICK`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `intensity` | number | `1` | Current intensity; used to smoothly transition ray visibility. |
| `intensity_target` | number | `1` | Target intensity for transition (set by phase/moon state). |
| `rayshidden` | boolean | `nil` | Flag indicating all rays are hidden (vs. just low intensity). |
| `lastphasefullmoon` | boolean | `nil` | Tracks full moon state from previous phase update. |
| `_rays` | `net_tinybyte` | N/A | Networked value indicating current rays phase: `RAYS_ID.DAY/DUSK/NIGHT`. |

## Main functions
### `showlightrays(inst)`
* **Description:** Randomly shows 2 or 3 of the 11 possible ray sprites (`"lightray1"` through `"lightray11"`), hiding others first. Used to animate rays appearing.
* **Parameters:** `inst` (entity instance) — the light rays entity.
* **Returns:** Nothing.
* **Error states:** None.

### `hiderays(inst)`
* **Description:** Hides all ray sprites and sets `inst.rayshidden = true`. Called when intensity drops to zero.
* **Parameters:** `inst` (entity instance).
* **Returns:** Nothing.

### `fadelightrays(inst)`
* **Description:** Sets `inst.intensity_target = 0.5` (typically for dusk transition).
* **Parameters:** `inst` (entity instance).
* **Returns:** Nothing.

### `hidelightrays(inst)`
* **Description:** Sets `inst.intensity_target = 0` (e.g., for night without full moon).
* **Parameters:** `inst` (entity instance).
* **Returns:** Nothing.

### `updateintensity(inst)`
* **Description:** Called periodically (every `1*FRAMES`) to interpolate `intensity` toward `intensity_target` at a fixed rate, and toggle ray visibility based on intensity threshold.
* **Parameters:** `inst` (entity instance).
* **Returns:** Nothing.
* **Error states:** If `intensity` reaches `<= 0` and `rayshidden` is false, it calls `hiderays(inst)`. If `intensity` rises above `0` and rays are hidden, it calls `showlightrays(inst)`.

### `getintensity(inst)`
* **Description:** Returns `inst.intensity` or `1` if unset. Used as the `extrafn` for `DistanceFade` to provide per-frame intensity values for fading.
* **Parameters:** `inst` (entity instance).
* **Returns:** number — current intensity value.

## Events & listeners
- **Listens to:** `raysdirty` — triggered when the networked `_rays` value changes (e.g., via `inst._rays:set(...)`). Adjusts `intensity_target` based on phase and moon state.
- **Pushes:** None — this prefab does not fire custom events.

## Notes
- The prefab is non-persistent (`inst.persists = false`) and uses `Transform:SetEightFaced()` and `AnimState` for 2D rendering.
- The `colourtweener` is commented out in the source and not active; it is not part of runtime behavior.
- On non-dedicated clients, `distancefade` is added and configured with range `15` and fade distance `25`. It uses `getintensity` to allow dynamic opacity based on ray intensity.