---
id: lavaarena_lucy
title: Lavaarena Lucy
description: Provides the weapon entity for Lucy's spinning axe attack in the Lava Arena, handling reticule targeting and visual feedback.
tags: [combat, weapon, boss]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e897717a
system_scope: combat
---

# Lavaarena Lucy

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lavaarena_lucy` is a weapon prefab used exclusively during Lucy's boss fight in the Lava Arena. It implements the spinning axe mechanic, including client-side reticule targeting and a dedicated spin-effect entity (`lavaarena_lucy_spin`) for visual feedback. It leverages the `aoetargeting` component for area targeting, custom reticule behavior, and particle effects synchronized with the parent entity's position.

The prefab has two parts:
- `lavaarena_lucy`: The actual weapon entity with inventory/physics and reticule configuration.
- `lavaarena_lucy_spin`: A non-persistent FX entity that trails and visualizes the spinning motion relative to its parent.

## Usage example
```lua
local lucy = SpawnPrefab("lavaarena_lucy")
lucy.Transform:SetPosition(x, y, z)
-- The weapon is automatically configured with an `aoetargeting` component
-- and visual reticule. It is typically spawned and used as part of the boss fight logic.
```

## Dependencies & tags
**Components used:** `Transform`, `AnimState`, `Network`, `aoetargeting`, `reticule` (via `aoetargeting.reticule`), `Inventoryitem`, `Physics` (via `MakeInventoryPhysics`)
**Tags:** Adds `sharp`, `throw_line`, `chop_attack`, `tool`, `weapon`, `rechargeable`, and `FX` (for spin entity).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `Components.aoetargeting.reticule.targetfn` | function | `ReticuleTargetFn` | Returns fixed 6.5-tile offset relative to player for reticule placement. |
| `Components.aoetargeting.reticule.mousetargetfn` | function | `ReticuleMouseTargetFn` | Computes reticule position based on mouse position relative to parent. |
| `Components.aoetargeting.reticule.updatepositionfn` | function | `ReticuleUpdatePositionFn` | Syncs reticule position/rotation with parent entity, with easing. |
| `Components.aoetargeting.reticule.validcolour` | table | `{1, .75, 0, 1}` | RGBA color when target is valid (yellow-orange). |
| `Components.aoetargeting.reticule.invalidcolour` | table | `{.5, 0, 0, 1}` | RGBA color when target is invalid (dark red). |
| `Components.aoetargeting.reticule.ease` | boolean | `true` | Enables smoothing/interpolation of reticule rotation. |
| `Components.aoetargeting.reticule.mouseenabled` | boolean | `true` | Enables mouse-driven reticule positioning. |
| `Components.aoetargeting.reticule.reticuleprefab` | string | `"reticulelong"` | Prefab used for the primary reticule. |
| `Components.aoetargeting.reticule.pingprefab` | string | `"reticulelongping"` | Prefab used for the ping effect. |

## Main functions
### `ReticuleTargetFn()`
* **Description:** Computes a fixed-point target location 6.5 units ahead of the local player (used for default reticule placement). This provides a stable aim reference when not using mouse input.
* **Parameters:** None.
* **Returns:** `Vector3` — The target position in world space.

### `ReticuleMouseTargetFn(inst, mousepos)`
* **Description:** Computes the target position on a circle of radius 6.5 units centered on the weapon, based on mouse cursor location. Used to orient the reticule to the player's aim.
* **Parameters:** `mousepos` (Vector3 or nil) — The mouse cursor's world position (z = 0 assumed).
* **Returns:** `Vector3` — The projected position on the 6.5-unit radius circle. If `mousepos` is `nil`, returns the current reticule target position.
* **Error states:** If mouse position coincides exactly with the weapon's position (`l ≈ 0`), returns the existing reticule target position to avoid division by zero.

### `ReticuleUpdatePositionFn(inst, pos, reticule, ease, smoothing, dt)`
* **Description:** Updates the reticule's position and rotation to align with the weapon and target point, applying interpolation when `ease` is `true`.
* **Parameters:** 
  * `inst` (Entity) — The weapon entity (`lavaarena_lucy`).
  * `pos` (Vector3) — Target position to face.
  * `reticule` (Entity) — The reticule entity.
  * `ease` (boolean) — Whether to interpolate rotation.
  * `smoothing` (number) — Interpolation speed factor.
  * `dt` (number) — Time delta for interpolation.
* **Returns:** Nothing.
* **Error states:** None. Rotation interpolation handles wraparound (±180 degrees) to prevent oscillation.

### `SetOrigin(inst, x, y, z)`
* **Description:** Records the origin coordinates for the spin FX entity. Updates `inst._originx` and `inst._originz` and triggers client-side FX if not dedicated.
* **Parameters:** `x`, `y`, `z` (numbers) — World coordinates of the origin point.
* **Returns:** Nothing.
* **Error states:** `y` is ignored (only x and z are used); no-op on dedicated servers.

### `CreateSpinFX()`
* **Description:** Creates a non-networked FX entity for visualizing the spinning motion.
* **Parameters:** None.
* **Returns:** `Entity` — The FX entity, configured to fade out and remove itself after ~13 frames.
* **Error states:** None.

### `OnOriginDirty(inst)`
* **Description:** Client-side callback that spawns and attaches spin FX when the origin changes. Only executes on clients (non-master simulation).
* **Parameters:** `inst` (Entity) — The spin FX entity (`lavaarena_lucy_spin`).
* **Returns:** Nothing.

### `OnUpdateSpin(fx, inst)`
* **Description:** Periodic task that updates the position and alpha of the spin FX entity, keeping it aligned with its parent weapon entity's rotation and motion.
* **Parameters:** 
  * `fx` (Entity) — The spin FX entity.
  * `inst` (Entity) — The parent weapon entity (`lavaarena_lucy`).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `origindirty` (on spin FX entity) — Triggers `OnOriginDirty` to update FX visuals.
- **Pushes:** `origindirty` — Networked event triggered when `SetOrigin` is called on the master, prompting clients to refresh FX.
