---
id: penguin_ice
title: Penguin Ice
description: Manages the visual fading and slippery terrain properties of penguin-generated ice patches based on local snow levels.
tags: [ice, environment, slippery, fx, worldstate]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 31396f87
system_scope: environment
---

# Penguin Ice

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `penguin_ice` prefab defines the visual and physical properties of ice patches created by penguins in the game world. It dynamically fades in or out based on ambient snow levels and exposes itself as a slippery terrain patch via the `slipperyfeettarget` component. It is non-persistent and exists only to provide gameplay-critical environmental interactions (slippery movement) and visual fidelity.

## Usage example
```lua
-- The component is instantiated automatically by the game when a penguin places ice
-- No direct usage is required by modders. However, to interact with its behavior:
local ice = TheSim:FindEntity(function(e) return e:HasTag("penguin_ice") end)
if ice and ice.QueueRemove then
    ice.QueueRemove()
end
```

## Dependencies & tags
**Components used:** `slipperyfeettarget`, `MiniMapEntity`, `Transform`, `AnimState`
**Tags:** Adds `NOCLICK`, `FX`, `slipperyfeettarget`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fadeval` | `net_byte` | `FADE_FRAMES` (≈ `math.floor(5 / FRAMES + 0.5)`) | Controls fade state progress (0 = fully visible, `FADE_FRAMES` = fully faded). Networked. |
| `isfaded` | `net_bool` | `true` | Boolean flag indicating whether the ice is currently faded (invisible). Networked. |
| `fadetask` | task or `nil` | `nil` | Periodic task reference used to animate fading; `nil` when inactive. |
| `queueremove` | boolean | `false` | Flag indicating whether removal is queued (used to avoid removal mid-fade). |
| `_ice` | entity or `nil` | Created via `CreateIceFX()` | The visual effect entity associated with the ice. |

## Main functions
### `UpdateFade(inst, dframes)`
*   **Description:** Animates the fade-in or fade-out of the ice effect by adjusting `fadeval`, and updates the erosion shader parameters on the `_ice` FX entity accordingly.
*   **Parameters:**  
    `inst` (entity) — the instance owning this behavior.  
    `dframes` (number, optional) — delta frames to add/remove from `fadeval`. Defaults to `0`.
*   **Returns:** Nothing.
*   **Error states:** No explicit errors; silently exits if `fadetask` is not running or `inst._ice` is invalid.

### `OnIsFadedDirty(inst)`
*   **Description:** Ensures the periodic fade update task (`fadetask`) is running and triggers an immediate fade update.
*   **Parameters:**  
    `inst` (entity) — the instance owning this behavior.
*   **Returns:** Nothing.

### `OnSnowLevel(inst, snowlevel)`
*   **Description:** Reacts to changes in world snow level. If `snowlevel > SNOW_THRESH` (`0.10`), ice fades out (`isfaded = false`); otherwise, it fades in (`isfaded = true`).
*   **Parameters:**  
    `inst` (entity) — the instance.  
    `snowlevel` (number) — current global snow level.
*   **Returns:** Nothing.

### `CreateIceFX()`
*   **Description:** Creates and configures the visual FX entity for the ice (bank, build, animation, layer, orientation).
*   **Parameters:** None.
*   **Returns:** `inst` (entity) — a non-networked, non-persistent entity with `NOCLICK` and `FX` tags.
*   **Error states:** None.

### `QueueRemove(inst)`
*   **Description:** Removes the ice entity immediately if fully faded, otherwise sets a `queueremove` flag to allow safe removal at the next fade tick.
*   **Parameters:**  
    `inst` (entity) — the instance.
*   **Returns:** Nothing.

### `IsSlipperyAtPosition(inst, x, y, z)`
*   **Description:** Determines whether a given world position is within the elliptical area of the ice patch.
*   **Parameters:**  
    `inst` (entity) — the ice instance.  
    `x`, `y`, `z` (number) — world coordinates of the test point (`y` is unused; `z` = depth axis).
*   **Returns:** `true` if inside the ellipse and not faded, `false` otherwise.
*   **Error states:** Returns `false` if ice is faded or FX (`_ice`) is missing and fallback bounding box is used.

### `SlipperyRate(inst, target)`
*   **Description:** Returns the fixed slippery rate for the ice patch.
*   **Parameters:**  
    `inst` (entity) — the ice instance (unused).  
    `target` (entity) — the target entity (unused).
*   **Returns:** `2.75` (number) — the rate applied when moving across the ice.

## Events & listeners
- **Listens to:**  
  `"fadevaldirty"` — triggers `UpdateFade` when `fadeval` changes (client-side).  
  `"isfadeddirty"` — triggers `OnIsFadedDirty` when `isfaded` changes (client-side).  
- **Pushes:**  
  None (all events are internal to `net_*` sync and lifecycle hooks).