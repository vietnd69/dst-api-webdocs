---
id: leif_idol
title: Leif Idol
description: A combustible fuel item that, when ignited or consumed as fuel, wakes nearby sleeping Leif entities and spawns new Leif entities from eligible nearby trees.
tags: [fuel, combat, environment, entity, world]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 61fcfa4a
system_scope: world
---

# Leif Idol

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `leif_idol` prefab functions as a specialized fuel item that triggers environmental responses upon ignition or fuel consumption. It interacts with the `burnable`, `fuel`, `sleeper`, `combat`, and `stackable` components to wake sleeping `leif` entities within range and convert eligible nearby trees into new `leif` entities. It is non-functional on the client and only active on the master simulation.

## Usage example
```lua
local inst = SpawnPrefab("leif_idol")
inst.components.stackable:Push(5)
-- When lit or placed in a furnace:
inst.components.fuel:OnTaken(some_doer)  -- triggers wake/spawn behavior
-- When burned:
inst.components.burnable:Burn()         -- triggers wake/spawn behavior
```

## Dependencies & tags
**Components used:** `burnable`, `combat`, `fuel`, `growable`, `inspectable`, `inventoryitem`, `sleeper`, `stackable`  
**Tags added on creation:** None.  
**Tags checked (via `HasTag`):** `leif`, `tree`, `evergreens`, `birchnut`, `fire`, `stump`, `burnt`, `monster`, `FX`, `NOCLICK`, `DECOR`, `INLIMBO`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_igniter` | `Entity` or `nil` | `nil` | Stores the valid doer (combat-capable entity) that ignited the idol. Used as the `doer` argument during wake/spawn events. |
| `WakeUpNearbyLeifs` | function | `WakeUpNearbyLeifs` (see below) | Public function to manually trigger waking nearby sleeping Leif entities and suggesting combat targets. |
| `SpawnNewLeifs` | function | `SpawnNewLeifs` (see below) | Public function to convert eligible nearby trees into new Leif entities. |
| `CanTransformIntoLeifTest` | function | `CanTransformIntoLeifTest` (see below) | Public function returning `true` if a given entity can be transformed into a Leif. |

## Main functions
### `WakeUpNearbyLeifs(x, y, z, doer)`
*   **Description:** Finds all `leif` entities within `TUNING.LEIF_REAWAKEN_RADIUS`, wakes up those that are asleep, and suggests the `doer` as a combat target for all nearby leifs.
*   **Parameters:**  
    - `x`, `y`, `z` (number) – Coordinates for radius search.  
    - `doer` (Entity or `nil`) – The entity to suggest as a target to nearby leifs (must have a `combat` component to be valid).
*   **Returns:** `table` – List of entities found (may be empty).
*   **Error states:** No-op if no matching entities found; silently skips entities missing `sleeper` or `combat` components.

### `SpawnNewLeifs(x, y, z, doer, multiplier)`
*   **Description:** Finds eligible tree entities within `TUNING.LEIF_IDOL_SPAWN_RADIUS` and transforms them into Leif entities, up to a calculated count based on `TUNING.LEIF_IDOL_NUM_SPAWNS` and `multiplier`. Uses `CanTransformIntoLeifTest` for validation.
*   **Parameters:**  
    - `x`, `y`, `z` (number) – Coordinates for radius search.  
    - `doer` (Entity or `nil`) – The entity performing the transformation (passed to `TransformIntoLeif` or `StartMonster`).  
    - `multiplier` (number or `nil`) – Scaling factor for number of spawns.
*   **Returns:**  
    - `table` – List of entities transformed or attempted.  
    - `number` – Remaining spawn count (can be negative if over-allocated).
*   **Error states:** Silently skips entities missing required methods (`TransformIntoLeif`, `StartMonster`) or failing `CanTransformIntoLeifTest`.

### `CanTransformIntoLeifTest(inst, target)`
*   **Description:** Validates whether `target` can be transformed into a Leif. Handles two cases: `evergreens` (stage ≤ 3) or `birchnut` (non-barren, non-monster).
*   **Parameters:**  
    - `inst` (Entity) – Unused (present for signature compatibility).  
    - `target` (Entity) – The entity to test.
*   **Returns:** `boolean` – `true` if `target` is eligible, otherwise `false`.

## Events & listeners
- **Listens to:** None directly via `inst:ListenForEvent`. Event-based logic is implemented through component hooks (`SetOnBurntFn`, `SetOnIgniteFn`, `SetOnTakenFn`).
- **Pushes:** `onwakeup` – Indirectly via `Sleeper:WakeUp()` for each awakened Leif entity.
- **Component hooks:**  
  - `burnable.onburnt` → `OnBurnt`  
  - `burnable.onignite` → `OnIgnite`  
  - `fuel.ontaken` → `OnFuelTaken`