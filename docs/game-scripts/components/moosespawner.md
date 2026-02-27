---
id: moosespawner
title: Moosespawner
description: Manages spawning logic for moose entities in response to seasonal and temporal conditions by monitoring nest availability and world state.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 78980f66
---

# Moosespawner

## Overview
The `MooseSpawner` component is responsible for coordinating seasonal moose spawning behavior in the game world. It monitors the `isspring` world state and initializes moose spawning logic by selecting a density-based subset of `moose_nesting_ground` entities and scheduling their activation. When a selected nest is triggered, it either soft-spawns or hard-spawns a moose, depending on context.

## Dependencies & Tags
- Relies on the **master simulation** context (asserts `TheWorld.ismastersim`).
- Uses global entities (`Ents`) to locate `moose_nesting_ground` prefabs.
- Uses the `easing` module (loaded but not used in this file).
- Uses `TUNING` constants for timing and density (`MOOSE_DENSITY`, `SEG_TIME`).
- Uses `SpawnPrefab`, `FindWalkableOffset`, `PickSome`, `Vector3`, and other core engine utilities.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (set via constructor) | Reference to the component's owner entity (typically the world root or a dedicated spawner instance). |
| `_moosedensity` | `number` | `TUNING.MOOSE_DENSITY` | Fraction (0–1) of total nesting grounds that will be selected for moose spawning each season. |
| `_seasonalnests` | `table` or `nil` | `nil` | List of `moose_nesting_ground` entities selected for spawning in the current season. |

## Main Functions

### `OverrideAttackDensity(density)`
* **Description:** A deprecated method no longer in use; left for backward compatibility.
* **Parameters:** `density` — Expected to be a numeric density value, though unused.

### `DoSoftSpawn(nest)`
* **Description:** Initiates a "soft" moose spawn: places the moose above the nest, starts its glide state, and schedules a timer to trigger egg-laying behavior after a random delay.
* **Parameters:**  
  `nest` (`Entity`) — The `moose_nesting_ground` instance to spawn the moose near.

### `DoHardSpawn(nest)`
* **Description:** Initiates a "hard" moose spawn: creates an egg first, then spawns the moose at a nearby walkable position, establishes bidirectional entity tracking between moose and egg, and initializes the egg.
* **Parameters:**  
  `nest` (`Entity`) — The `moose_nesting_ground` instance used for positioning; not directly involved beyond providing base coordinates.

### `InitializeNest(nest)`
* **Description:** Schedules a timer on the given nest to trigger `CallMoose` (implicitly handled elsewhere, e.g., by the nest's own logic) after a random delay, and marks the nest as awaiting moose arrival.
* **Parameters:**  
  `nest` (`Entity`) — The `moose_nesting_ground` instance to initialize.

### `InitializeNests()`
* **Description:** Counts all `moose_nesting_ground` entities in the world, selects a subset based on `_moosedensity`, and initializes each selected nest.
* **Parameters:** None.

### `OnSpringChange(inst, isSpring)`
* **Description:** Event callback (installed via `WatchWorldState`) that triggers initialization of nests only when the world enters spring *and* the world cycle count exceeds `TUNING.NO_BOSS_TIME`.
* **Parameters:**  
  `inst` (`Entity`) — The watched world state object (unused; `self` is used instead).  
  `isSpring` (`boolean`) — Whether the world is currently in spring season.

## Events & Listeners
- **Listens to:**  
  - `isspring` world state change (via `inst:WatchWorldState("isspring", OnSpringChange)`).  
- **Triggers (via other components):**  
  - `CallMoose` timer callback (on nests) — implied but not defined here.  
  - `WantsToLayEgg` timer (set on moose in `DoSoftSpawn`).  
- *Note:* This component itself does *not* push events; it orchestrates behavior in other prefabs (moose, moose_nesting_ground, mooseegg).