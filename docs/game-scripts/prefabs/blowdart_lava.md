---
id: blowdart_lava
title: Blowdart Lava
description: A specialized blowdart item that launches explosive lava projectiles, using AOE targeting with custom reticule behavior and visual trails.
tags: [combat, weapon, lavaarena, aoe, reticule]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 00c12ea8
system_scope: combat
---

# Blowdart Lava

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`blowdart_lava` is a Prefab definition for a lava-themed blowdart weapon used in the Lava Arena event. It functions as a ranged combat item that places a weapon component with AOE targeting, using a custom long-range reticule with mouse and automatic position tracking. When fired, it spawns one of two projectile prefabs (`blowdart_lava_projectile` or `blowdart_lava_projectile_alt`), each optionally creating a visual fading trail during flight. This item is tightly integrated with the Lava Arena event system via server-side post-initialization hooks.

## Usage example
```lua
local inst = SpawnPrefab("blowdart_lava")
if inst ~= nil then
    inst.components.aoetargeting.reticule.mouseenabled = true
    inst.components.aoetargeting:SetAlwaysValid(true)
    inst.components.aoetargeting:SetAllowRiding(false)
    -- Usage in player inventory: the item is equipped, aimed, and fired via standard weapon actions
end
```

## Dependencies & tags
**Components used:** `Transform`, `AnimState`, `Network`, `AOETargeting`, `InventoryItem`, `CombatItem` (via `weapon` tag optimization), `Rechargeable` (via `rechargeable` tag optimization)  
**Tags:** Adds `blowdart`, `aoeblowdart_long`, `sharp`, `weapon`, `rechargeable`, `projectile`, `FX`, `NOCLICK` (on projectiles), `NOCLICK` (on FX tails)  
**Prefabs used:** `blowdart_lava_projectile`, `blowdart_lava_projectile_alt`, `reticulelongmulti`, `reticulelongmultiping`, `weaponsparks_piercing`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `projectiledelay` | number | `4 * FRAMES` | Delay (in frames) between projectile launches, used by the weapon component for fire rate enforcement. |
| `components.aoetargeting.reticule.*` | Reticule instance | — | Custom reticule configuration: `reticuleprefab`, `pingprefab`, `targetfn`, `mousetargetfn`, `updatepositionfn`, `validcolour`, `invalidcolour`, `ease`, `mouseenabled`. |

## Main functions
### `ReticuleTargetFn()`
*   **Description:** Computes the default aim point (6.5 units forward) relative to the player's local space.
*   **Parameters:** None.
*   **Returns:** `Vector3` — world-space target position aligned with the player's forward direction.

### `ReticuleMouseTargetFn(inst, mousepos)`
*   **Description:** Calculates a target point at fixed distance (6.5 units) along the direction from the weapon to the mouse cursor, clamping to the weapon's position if mouse is directly on it.
*   **Parameters:**  
    `inst` (Entity) — the blowdart instance.  
    `mousepos` (Vector3 or nil) — world-space mouse position.  
*   **Returns:** `Vector3` — world-space target position, or falls back to current reticule position if `mousepos` is `nil` or collinear.

### `ReticuleUpdatePositionFn(inst, pos, reticule, ease, smoothing, dt)`
*   **Description:** Positions and rotates the reticule at the weapon's location, smoothly interpolating rotation if `ease` and `dt` are provided.
*   **Parameters:**  
    `inst` (Entity) — the blowdart instance.  
    `pos` (Vector3) — target position (unused in current implementation).  
    `reticule` (Entity) — the reticule entity to update.  
    `ease` (boolean) — whether to interpolate rotation.  
    `smoothing` (number) — interpolation factor multiplier.  
    `dt` (number) — delta time for smoothing.  
*   **Returns:** Nothing.

### `CreateTail()`
*   **Description:** Creates a non-networked FX entity for the projectile tail trail.
*   **Parameters:** None.
*   **Returns:** `Entity` — the tail FX entity with animation playing `"tail_1"`.

### `OnUpdateProjectileTail(inst)`
*   **Description:** Spawns a tail FX entity at the projectile's current location, fading its animation time based on visibility and fade progress.
*   **Parameters:**  
    `inst` (Entity) — the projectile instance.  
*   **Returns:** Nothing.

### `commonprojectilefn(alt)`
*   **Description:** Shared constructor for both projectile variants. Handles physics, animation, visual effects, and server-side initialization.
*   **Parameters:**  
    `alt` (boolean) — if true, enables fade tracking on the projectile (`_fade` netprop).
*   **Returns:** `Entity` — the projectile entity.

### `projectilefn()`
*   **Description:** Wrapper that calls `commonprojectilefn(false)` to spawn the standard projectile.
*   **Parameters:** None.
*   **Returns:** `Entity` — standard `blowdart_lava_projectile`.

### `projectilealtfn()`
*   **Description:** Wrapper that calls `commonprojectilefn(true)` to spawn the alternate projectile with fade support.
*   **Parameters:** None.
*   **Returns:** `Entity` — alternate `blowdart_lava_projectile_alt`.

## Events & listeners
- **Listens to:** `animover` — on projectile tail FX entities, to auto-remove the entity once animation completes.
- **Pushes:** None directly (server-side event hooks via `event_server_data("lavaarena", ...).blowdart_postinit` and `projectile_postinit` are called, but these are event-driven hooks, not direct pushes).