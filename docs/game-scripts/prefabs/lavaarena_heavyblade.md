---
id: lavaarena_heavyblade
title: Lavaarena Heavyblade
description: A weapon prefab that implements area-of-effect targeting with an arc-shaped reticule for precision targeting in lava arena combat.
tags: [combat, weapon, boss, area_of_effect]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d7e58122
system_scope: combat
---

# Lavaarena Heavyblade

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `lavaarena_heavyblade` prefab is a weapon entity used in lava arena combat scenarios. It integrates the `aoetargeting` component to provide an arc-shaped reticule visual for targeting, with custom logic for positioning and orientation. The prefab is optimized by pre-tagging itself with `"sharp"`, `"weapon"`, `"parryweapon"`, and `"rechargeable"` for compatibility with game systems.

## Usage example
The prefab is instantiated internally by the game during lava arena events and should not be manually created in most mods. To reference its components in a mod, use:
```lua
local inst = TheWorld:FindEntities(x, y, z, 1, {"lavaarena_heavyblade"})[1]
if inst and inst.components.aoetargeting then
    -- Access reticule properties
    local ret = inst.components.aoetargeting.reticule
    print(ret.validcolour)
end
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `network`, `inventory`, `aoetargeting`  
**Tags added:** `"sharp"`, `"weapon"`, `"parryweapon"`, `"rechargeable"`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `reticule.reticuleprefab` | string | `"reticulearc"` | Prefab used for the main reticule visual. |
| `reticule.pingprefab` | string | `"reticulearcping"` | Prefab used for the reticule ping animation. |
| `reticule.targetfn` | function | `ReticuleTargetFn` | Function returning the base target position (fixed 6.5 units in front of the entity). |
| `reticule.mousetargetfn` | function | `ReticuleMouseTargetFn` | Function returning target position based on mouse position, clamped to 6.5 units radius. |
| `reticule.updatepositionfn` | function | `ReticuleUpdatePositionFn` | Function updating reticule position and rotation, with optional easing. |
| `reticule.validcolour` | table | `{1, 0.75, 0, 1}` | RGBA color for valid reticule states (yellowish). |
| `reticule.invalidcolour` | table | `{0.5, 0, 0, 1}` | RGBA color for invalid reticule states (dark red). |
| `reticule.ease` | boolean | `true` | Whether to interpolate rotation changes smoothly. |
| `reticule.mouseenabled` | boolean | `true` | Whether mouse-based targeting is enabled. |

## Main functions
### `ReticuleTargetFn()`
*   **Description:** Returns a fixed target position 6.5 units directly in front of the weapon entity, at world Y=0.
*   **Parameters:** None.
*   **Returns:** `Vector3` — target position.

### `ReticuleMouseTargetFn(inst, mousepos)`
*   **Description:** Computes a target position based on the mouse cursor, constrained to a 6.5-unit radius around the entity. Falls back to `reticule.targetpos` if no valid mouse position is provided.
*   **Parameters:** 
    *   `inst` (Entity) — the weapon entity instance.
    *   `mousepos` (Vector3 or nil) — current mouse position in world space.
*   **Returns:** `Vector3` — constrained target position.
*   **Error states:** Returns `nil` if `mousepos` is `nil` and no fallback target exists.

### `ReticuleUpdatePositionFn(inst, pos, reticule, ease, smoothing, dt)`
*   **Description:** Updates the reticule's position and rotation to match the weapon and target direction, with optional linear interpolation if `ease` and `dt` are provided.
*   **Parameters:** 
    *   `inst` (Entity) — the weapon entity instance.
    *   `pos` (Vector3) — target position to orient toward.
    *   `reticule` (Entity) — reticule entity to update.
    *   `ease` (boolean) — whether to apply smooth rotation interpolation.
    *   `smoothing` (number) — interpolation speed factor.
    *   `dt` (number) — delta time for interpolation.
*   **Returns:** Nothing.

## Events & listeners
None identified.