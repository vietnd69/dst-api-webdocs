---
id: groundpounder
title: Groundpounder
description: Simulates a radial ground pound attack that triggers delayed damage, destruction, platform pushing, and inventory item launch effects across concentric rings.
tags: [combat, destruction, physics,AoE, boss]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d600c018
system_scope: combat
---

# Groundpounder

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `groundpounder` component orchestrates a radial area-of-effect (AoE) attack centered on a point, processing damage, destruction, platform displacement, and inventory item launching across multiple concentric rings with optional delays between rings. It supports two distinct modes: the legacy `PointMode` (point-based search) and `RingMode` (concentric-ring search), with `RingMode` offering improved targeting control. It interacts with the `combat`, `workable`, `burnable`, `boatphysics`, `health`, `fueled`, and `inventoryitem` components.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("groundpounder")
inst.components.groundpounder.numRings = 5
inst.components.groundpouncer.damageRings = 3
inst.components.groundpouncer.destructionRings = 4
inst.components.groundpounder:UseRingMode() -- switch to RingMode
inst.components.groundpounder:GroundPound()
```

## Dependencies & tags
**Components used:** `combat`, `workable`, `burnable`, `boatphysics`, `health`, `fueled`, `inventoryitem`, `transform`, `groundpound_immune` (exclusion tag)  
**Tags checked:** `"FX"`, `"NOCLICK"`, `"DECOR"`, `"INLIMBO"`, `"groundpound_immune"` (exclusion list), `"burnt"`, `"walkableplatform"` (inclusion)  
**Tags added:** None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `numRings` | number | `4` | Total number of concentric rings in the attack. |
| `ringDelay` | number | `0.2` | Seconds between ring effect execution. |
| `initialRadius` | number | `1` | Starting radius of the first ring. |
| `radiusStepDistance` | number | `4` | Incremental distance added to the radius per ring. |
| `ringWidth` | number | `3` | Radial thickness (search radius) of each ring. |
| `pointDensity` | number | `0.25` | Target entities per unit arc length in `PointMode` (deprecated). |
| `damageRings` | number | `2` | Number of inner rings that perform damage. |
| `destructionRings` | number | `3` | Number of inner rings that destroy workable entities. |
| `platformPushingRings` | number | `2` | Number of inner rings that push walkable platforms. |
| `inventoryPushingRings` | number | `0` | Number of inner rings that launch inventory items. |
| `noTags` | table | `{"FX", "NOCLICK", "DECOR", "INLIMBO", "groundpound_immune"}` | List of entity tags that exclude entities from being targeted. |
| `workefficiency` | number or nil | `nil` | If set, specifies how much work is done per affected workable (use `WorkedBy` instead of `Destroy`). |
| `destroyer` | boolean | `false` | If `true`, allows destruction even without `workefficiency`. |
| `burner` | boolean | `false` | If `true`, ignites non-fueled, non-burning, non-burnt entities in destruction rings. |
| `groundpoundfx` | string | `"groundpound_fx"` | Prefab name used for effect spawning at point locations. |
| `groundpoundringfx` | string | `"groundpoundring_fx"` | Prefab name used for ring visual effect. |
| `groundpounddamagemult` | number | `1` | Multiplier applied to damage in `DoAttack`. |
| `groundpoundFn` | function or nil | `nil` | Optional callback invoked after all rings have executed. |
| `usePointMode` | boolean | `true` | Legacy mode; if `nil` (set via `UseRingMode`), `RingMode` is used instead. |

## Main functions
### `UseRingMode()`
*   **Description:** Switches the component to `RingMode`, changing how entity search and hit management are performed.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetPoints(pt)`
*   **Description:** Generates a list of ring centers and sample points for a given center point `pt`, based on the current mode (`PointMode` vs `RingMode`) and configured properties.
*   **Parameters:** `pt` (Vector3 or table) — center point for the attack.
*   **Returns:** `table of table of Vector3` — a table where each entry `points[i]` is a list of `Vector3` points for ring `i`. In `RingMode`, each ring contains only one point (the ring center).
*   **Error states:** If `numPoints <= 4` for the first ring in `PointMode`, it defaults to one point.

### `DestroyPoints(points, breakobjects, dodamage, pushplatforms, pushinventoryitems, spawnfx)`
*   **Description:** Processes a list of points (legacy mode) to perform destruction, damage, platform pushing, inventory launching, and FX spawning. Marked as deprecated by the source.
*   **Parameters:**
    *   `points` (table of Vector3) — points to process.
    *   `breakobjects` (boolean) — whether to destroy workable entities.
    *   `dodamage` (boolean) — whether to apply area damage.
    *   `pushplatforms` (boolean) — whether to push walkable platforms.
    *   `pushinventoryitems` (boolean) — whether to launch inventory items.
    *   `spawnfx` (boolean) — whether to spawn groundpound FX at each point.
*   **Returns:** Nothing.
*   **Error states:** Temporarily disables area damage restrictions via `combat:EnableAreaDamage(false)` to bypass range checks.

### `DestroyRing(pt, radius, points, breakobjects, dodamage, pushplatforms, pushinventoryitems, spawnfx, ents_hit, platforms_hit)`
*   **Description:** Processes a single ring concentrically using `radius`, applying targeted effects only to entities within an annulus around `pt`. Used in `RingMode`.
*   **Parameters:**
    *   `pt` (Vector3 or table) — center point of the attack.
    *   `radius` (number) — nominal radius of the current ring.
    *   `points` (table of Vector3) — points used for FX spawning.
    *   `breakobjects` (boolean) — whether to destroy workable entities.
    *   `dodamage` (boolean) — whether to apply area damage.
    *   `pushplatforms` (boolean) — whether to push walkable platforms.
    *   `pushinventoryitems` (boolean) — whether to launch inventory items.
    *   `spawnfx` (boolean) — whether to spawn FX.
    *   `ents_hit` (table) — table used to track already-hit entities (prevents duplicates).
    *   `platforms_hit` (table) — table used to track already-hit platforms (prevents duplicates).
*   **Returns:** Nothing.

### `GroundPound(pt, ents_hit)`
*   **Description:** Executes the full ground pound sequence: spawns the ring FX, generates points for each ring, and schedules `DestroyPoints` or `DestroyRing` for each ring based on delay.
*   **Parameters:**
    *   `pt` (Vector3 or table, optional) — center of the ground pound; defaults to the component's entity position.
    *   `ents_hit` (table, optional) — pass-through table for tracking already-hit entities (RingMode only).
*   **Returns:** Nothing.

### `GroundPound_Offscreen(position)`
*   **Description:** Performs a simplified, offscreen ground pound for entities not currently in the simulation (non-replicated or minimap culling). Source comments indicate this is deprecated and likely non-functional.
*   **Parameters:** `position` (Vector3 or table) — target position.
*   **Returns:** Nothing.
*   **Error states:** Only affects entities within single-pass distances, no ring delays or visual effects; may miss edge cases due to simplified logic.

### `GetDebugString()`
*   **Description:** Returns a human-readable summary of the current ground pound configuration for debugging purposes.
*   **Parameters:** None.
*   **Returns:** `string` — formatted string with key property values.

## Events & listeners
- **Listens to:** None directly.
- **Pushes:** None directly; uses `inst:DoTaskInTime` to schedule delayed callbacks (`OnDestroyPoints`, `OnDestroyRing`), which in turn may trigger component-side events (`onignite`, etc.) in other components.
