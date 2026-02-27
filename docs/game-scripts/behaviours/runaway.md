---
id: runaway
title: Runaway
description: A behaviour node that steers an entity away from nearby hostile entities by computing and executing evasive movement paths.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: behaviour
system_scope: entity
source_hash: 4f3945ca
---

# Runaway

## Overview
The `RunAway` component is a behaviour node (inheriting from `BehaviourNode`) responsible for initiating evasive movement when a threatening entity (the "hunter") is detected within a configurable range. It determines the optimal escape angle—accounting for terrain constraints, overhangs, and water/walkable surface boundaries—and issues locomotor commands to run or walk in the resulting direction. Optionally, it can divert the entity toward its home location if fleeing is triggered and the home is safe. This component integrates closely with the `Locomotor`, `HomeSeeker`, `Burnable`, `Equippable`, `InventoryItem`, and `Follower` components to ensure intelligent and context-aware avoidance behavior.

## Dependencies & Tags
- **Components used:** `behaviours/behaviournode.lua` (base class), `components/locomotor.lua`, `components/homeseeker.lua`, `components/burnable.lua`, `components/equippable.lua`, `components/inventoryitem.lua`, `components/follower.lua`
- **Tags:** Checks tags on hunter entities: `NOCLICK`, custom `huntertags`, `hunternotags`, and `hunteroneoftags` (see constructor parameters). Does not modify tags on the owner entity.
- **External utilities:** Uses `FindEntity`, `FindWalkableOffset`, `FindSwimmableOffset`, `FindNearbyOcean`, `FindNearbyLand`, `VecUtil_Slerp`, `distSq`, `TheSim:FindEntities`, `GetTime`, `GetAngleToPoint`, `DEGREES` (constant), `Vector3`, `TheWorld.Map:IsAboveGroundAtPoint`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `safe_dist` | `number` | `nil` (required) | Distance squared threshold; if hunter moves beyond this range, the behaviour succeeds and movement stops. |
| `see_dist` | `number` | `nil` (required) | Detection radius within which hunters are searched for. |
| `huntertags` | `table` | `{ "NOCLICK" }` or `nil` | Tags a potential hunter *must* have (if `hunterparams` is a string). If `hunterparams` is a table, extracted from it. |
| `hunternotags` | `table` | `{ "NOCLICK" }` or `nil` | Tags a potential hunter *must not* have (if `hunterparams` is a string). If `hunterparams` is a table, extracted from it. |
| `hunteroneoftags` | `table` or `nil` | `nil` | If present, a hunter must have at least one of these tags. |
| `gethunterfn` | `function` or `nil` | `nil` | Optional function `(inst) → entity?` to determine the hunter explicitly (used whenhunter is not tag-based). |
| `hunterfn` | `function` or `nil` | `nil` | Optional filter function `(hunter, entity) → boolean` used to validate candidate hunters. |
| `hunterseeequipped` | `boolean` or `nil` | `nil` | If true, include equipped items owned by other players as potential hunters. |
| `runshomewhenchased` | `boolean` | `nil` (false if omitted) | Whether the entity should attempt to run to its home (`homeseeker:GoHome`) when fleeing starts. |
| `fix_overhang` | `boolean` | `nil` (false if omitted) | If true, and entity is on an ocean "overhang" (border between land and water in caves), try to recompute a safe point on land or ocean. |
| `walk_instead` | `boolean` | `nil` (false if omitted) | If true, issue `WalkInDirection` instead of `RunInDirection`. |
| `safe_point_fn` | `function` or `nil` | `nil` | Optional function `(inst) → Vector3?` that returns a safe point for steering; used to avoid returning toward a zone of danger (e.g., back into lava or ocean). |
| `hunter` | `Entity` or `nil` | `nil` | Current identified hunter (set during `Visit`). |
| `avoid_time` / `avoid_angle` | `number?`, `number?` | `nil` | Used internally to smooth path deflections across frames. |

## Main Functions

### `RunAway:Visit()`
* **Description:** Core behaviour node execution method. Determines if a hunter exists within range, calculates evasive movement (or calls `GoHome` if configured), and updates status (`READY`, `RUNNING`, `SUCCESS`, or `FAILED`). Called automatically by the parent `BehaviourTree` on a schedule (every `.25` seconds while `RUNNING`).  
* **Parameters:** None. Uses instance and stored parameters (e.g., `see_dist`, `safe_dist`).  
* **Returns:** `nil`. Status is updated internally via `self.status`.

### `RunAway:GetRunAngle(pt, hp, sp)`
* **Description:** Computes the optimal escape angle from the entity’s current position (`pt`) toward the hunter (`hp`), optionally adjusting to steer around obstacles or toward a safe point (`sp`). Handles terrain-specific pathfinding (`walkable` vs `swimmable` offsets) and deflection smoothing (via `avoid_angle`). Falls back to `angle + 180°` if no offset is found.  
* **Parameters:**  
  - `pt`: `Vector3` — Position of the fleeing entity.  
  - `hp`: `Vector3` — Position of the hunter.  
  - `sp`: `Vector3?` — Optional safe point (e.g., center of a safe zone) to bias movement away from.  
* **Returns:** `number?` — Angle in degrees (0–360), or `nil` if no valid direction could be computed.

### `RunAway:__tostring()`
* **Description:** Returns a debugging string summarizing the current state (e.g., `"RUNAWAY 6.000000 from: [some_entity]"`).  
* **Parameters:** None.  
* **Returns:** `string`.

### `ShouldGoHome(inst)`
* **Description:** Internal helper to verify whether the entity’s home should be used for fleeing (i.e., home exists, is valid, and is not burning or burnt).  
* **Parameters:**  
  - `inst`: `Entity` — The fleeing entity.  
* **Returns:** `boolean`.

## Events & Listeners
None. This component does not register or dispatch custom events. It responds to the behaviour tree’s `Visit()` scheduling, and uses `Sleep(.25)` to pace actions.