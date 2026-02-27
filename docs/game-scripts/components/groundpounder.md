---
id: groundpounder
title: Groundpounder
description: Handles ground pound attacks that damage, destroy, or push entities in concentric rings around a point.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: combat
source_hash: d600c018
---

# Groundpounder

## Overview
The `GroundPounder` component implements a ground pound mechanic that triggers area effects (damage, destruction, platform movement, item launch) in concentric rings around a point. It supports two operational modes: the legacy point-based mode (default for backward compatibility) and a ring-based mode for more precise, physics-aware targeting.

## Dependencies & Tags
- **Component Requirements:** Requires `self.inst.components.combat` to be present for attack execution and area damage control.
- **Tag Filtering:** Uses `self.noTags = { "FX", "NOCLICK", "DECOR", "INLIMBO", "groundpound_immune" }` to exclude entities from interaction.
- **Target Tags:** Relies on `"walkableplatform"` tag for platform-pushing logic.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `numRings` | `number` | `4` | Total number of concentric rings used in the attack pattern. |
| `ringDelay` | `number` | `0.2` | Time (in seconds) between ring activations. |
| `initialRadius` | `number` | `1` | Starting radius (in world units) of the first ring. |
| `radiusStepDistance` | `number` | `4` | Incremental distance added to the radius per ring. |
| `ringWidth` | `number` | `3` | Width (in world units) of each ring's hitbox. |
| `pointDensity` | `number` | `0.25` | Controls number of sample points per ring in point mode (`numPoints ≈ TWOPI * radius * pointDensity`). |
| `damageRings` | `number` | `2` | Number of innermost rings that apply damage. |
| `destructionRings` | `number` | `3` | Number of innermost rings that destroy workable objects. |
| `platformPushingRings` | `number` | `2` | Number of rings that push walkable platforms (e.g., boats). |
| `inventoryPushingRings` | `number` | `0` | Number of rings that launch inventory items. |
| `fxRings` | `number?` | `nil` | Number of rings to spawn FX for; defaults to `numRings` if `nil`. |
| `workefficiency` | `number?` | `nil` | If set, `WorkedBy()` is called instead of `Destroy()` on workable objects. |
| `destroyer` | `boolean` | `false` | When `true`, destruction logic is enabled. |
| `burner` | `boolean` | `false` | When `true`, ignites non-fueled, burnable objects after destruction. |
| `groundpoundfx` | `string` | `"groundpound_fx"` | FX prefab name for ground impact visuals. |
| `groundpoundringfx` | `string` | `"groundpoundring_fx"` | FX prefab name for ring visuals. |
| `groundpounddamagemult` | `number` | `1` | Damage multiplier applied to all hits. |
| `groundpoundFn` | `function?` | `nil` | Optional callback function invoked after ring sequence completes. |
| `usePointMode` | `boolean` | `true` | Legacy mode flag; `true` = point-sampling, `false` = true ring-based mode. |

## Main Functions

### `GetPoints(pt)`
* **Description:** Generates a list of points (in world space) forming concentric rings for attack application. In ring mode (`usePointMode = false`), returns single points per ring; in legacy point mode, returns multiple points per ring based on `pointDensity`.
* **Parameters:**
  * `pt` (`Vector3`): Center point (x,y,z) of the attack.

### `DestroyPoints(points, breakobjects, dodamage, pushplatforms, pushinventoryitems, spawnfx)`
* **Description:** Applies attack effects (destroy, damage, platform push, item launch, FX) to entities found at the given points. Deprecated; retained for mod compatibility.
* **Parameters:**
  * `points` (`table<Vector3>`): List of points to check.
  * `breakobjects` (`boolean`): Whether to destroy workable objects.
  * `dodamage` (`boolean`): Whether to deal damage to living targets.
  * `pushplatforms` (`boolean`): Whether to push walkable platforms.
  * `pushinventoryitems` (`boolean`): Whether to launch inventory items.
  * `spawnfx` (`boolean`): Whether to spawn impact FX.

### `DestroyRing(pt, radius, points, breakobjects, dodamage, pushplatforms, pushinventoryitems, spawnfx, ents_hit, platforms_hit)`
* **Description:** Applies attack effects within a single ring region (not just at points). Prevents multiple hits on the same target. Used when `usePointMode = false`.
* **Parameters:**
  * `pt` (`Vector3`): Center point of the attack.
  * `radius` (`number`): Radius of the ring.
  * `points` (`table<Vector3>`): Points within the ring (used for FX placement).
  * `breakobjects`, `dodamage`, `pushplatforms`, `pushinventoryitems`, `spawnfx` (`boolean`): As above.
  * `ents_hit`, `platforms_hit` (`table?`): Tables tracking already-hit entities/platforms (for deduplication across rings).

### `GroundPound(pt, ents_hit)`
* **Description:** Triggers the full ground pound sequence: spawns visual FX, generates ring points, and schedules `DestroyPoints` or `DestroyRing` calls per ring with delays.
* **Parameters:**
  * `pt` (`Vector3?`): Target position; defaults to inst's position.
  * `ents_hit` (`table?`): Table to track already-hit entities (for use in ring mode).

### `GroundPound_Offscreen(position)`
* **Description:** Handles ground pound logic for offscreen positions. **Deprecated and likely non-functional.**
* **Parameters:**
  * `position` (`Vector3`): World position of the offscreen impact.

### `GetDebugString()`
* **Description:** Returns a human-readable summary of the component’s ring configuration for debugging.
* **Parameters:** None.

## Events & Listeners
None.