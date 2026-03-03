---
id: aoetargeting
title: Aoetargeting
description: Manages AOE (area-of-effect) targeting state and visual feedback for deployable items, including reticule management, range validation, and FX spawning.
tags: [combat, targeting, aoe, inventory]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: acb57aeb
system_scope: inventory
---

# Aoetargeting

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `aoetargeting` component controls the targeting lifecycle for deployable AOE items (e.g., placeable lamps, turrets, or traps). It handles activation/deactivation of the visual reticule, validates placement constraints (e.g., water or riding), and manages FX spawn points. It integrates with `playercontroller` and `reticule` to update reticule visuals when the item is equipped or when enabled state changes.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("inventoryitem")
inst:AddComponent("aoetargeting")
inst:AddComponent("reticule") -- typically added automatically via StartTargeting

inst.components.aoetargeting:SetRange(10)
inst.components.aoetargeting:SetTargetFX("aoe_marker")
inst.components.aoetargeting:StartTargeting()
inst.components.aoetargeting:SetEnabled(false)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `reticule`, `playercontroller`  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `reticule` | table | (see constructor) | Configuration table for the reticule visual (colours, smoothing, etc.) |
| `targetprefab` | string or nil | `nil` | Prefab name to spawn at target position |
| `alwaysvalid` | boolean | `false` | If true, bypasses placement validation (e.g., terrain checks) |
| `allowwater` | boolean | `false` | Whether target can be placed on water |
| `allowriding` | boolean | `true` | Whether target can be placed while riding (e.g., beefalo) |
| `deployradius` | number | `0` | Radius around target point for placement alignment |
| `range` | number | `8` | Max distance from owner to valid target point |
| `shouldrepeatcastfn` | function or nil | `nil` | Optional function returning bool to allow repeated casts |
| `enabled` | net_bool | `true` | Networked boolean for targeting activation state |

## Main functions
### `IsEnabled()`
* **Description:** Returns whether targeting is currently enabled.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if targeting is active, `false` otherwise.

### `SetEnabled(enabled)`
* **Description:** Sets the targeting enabled state (server-side only).
* **Parameters:** `enabled` (boolean) — desired state.
* **Returns:** Nothing.
* **Error states:** No effect if called on the client; state change triggers `enableddirty` and may stop targeting.

### `SetTargetFX(prefab)`
* **Description:** Configures the FX prefab to spawn when a target is placed.
* **Parameters:** `prefab` (string) — name of the FX prefab to instantiate.
* **Returns:** Nothing.

### `SetAlwaysValid(val)`
* **Description:** Overrides normal placement validation (e.g., ground checks).
* **Parameters:** `val` (boolean) — if non-`false`, targets are always considered valid.
* **Returns:** Nothing.

### `SetAllowWater(val)`
* **Description:** Allows or disallows targeting on water surfaces.
* **Parameters:** `val` (boolean) — if non-`false`, water placement is permitted.
* **Returns:** Nothing.

### `SetAllowRiding(val)`
* **Description:** Allows or disallows targeting while riding a mount.
* **Parameters:** `val` (boolean) — if non-`false`, targeting while riding is permitted.
* **Returns:** Nothing.

### `SetRange(range)`
* **Description:** Sets the maximum distance from the owner to a valid target point.
* **Parameters:** `range` (number) — maximum range in world units.
* **Returns:** Nothing.

### `GetRange()`
* **Description:** Returns the currently configured targeting range.
* **Parameters:** None.
* **Returns:** `number` — the max targeting range.

### `SetDeployRadius(radius)`
* **Description:** Sets the radius used for aligning placement to tiles or platforms.
* **Parameters:** `radius` (number) — alignment radius in world units.
* **Returns:** Nothing.

### `SetShouldRepeatCastFn(fn)`
* **Description:** Assigns a callback function to determine if repeated casting is allowed (e.g., for toggled AOE effects).
* **Parameters:** `fn` (function) — function with signature `(self.inst, doer) → boolean`.
* **Returns:** Nothing.

### `CanRepeatCast()`
* **Description:** Checks whether a repeat-cast callback is configured.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `shouldrepeatcastfn` is not `nil`.

### `ShouldRepeatCast(doer)`
* **Description:** Invokes the repeat-cast callback, if present, to decide if another cast should proceed.
* **Parameters:** `doer` (Entity) — the entity triggering the cast (typically the player).
* **Returns:** `boolean` — result of `shouldrepeatcastfn(inst, doer)` or `false`.

### `StartTargeting()`
* **Description:** Initializes the reticule component for this item if the item is owned by `ThePlayer`, and refreshes the player's reticule.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** silently does nothing if the item is not owned by the current player or if `playercontroller` is unavailable.

### `StopTargeting()`
* **Description:** Removes the reticule component and refreshes the player's reticule to update visual state.
* **Parameters:** None.
* **Returns:** Nothing.

### `SpawnTargetFXAt(pos)`
* **Description:** Spawns and positions the configured `targetprefab` at the specified world position, handling parented platforms (e.g., moving vehicles).
* **Parameters:** `pos` (Vector or DynamicPosition) — target location in world space.
* **Returns:** `Entity` (the spawned FX) or `nil` if `targetprefab` is `nil`, `pos` is `nil`, or platform is invalid.
* **Error states:** Returns `nil` if `targetprefab` is unset, position is invalid, or the FX fails to spawn.

## Events & listeners
- **Listens to:** `enableddirty` — triggers `OnEnabledDirty` (stops targeting when disabled and refreshes reticule).
- **Pushes:** `enableddirty` — fired by the `net_bool` when enabled state changes (on client); triggers local reticule cleanup.
