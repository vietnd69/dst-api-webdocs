---
id: dragonflybrain
title: Dragonflybrain
description: Controls the behavior tree and AI logic for the Dragonfly enemy, managing combat, spawners, resetting, and movement relative to its spawn point.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: ec78c15a
---

# Dragonflybrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`DragonflyBrain` is the behavior tree controller for the Dragonfly entity. It orchestrates high-level AI decisions—including combat targeting, lavae spawner coordination, resetting behavior when the Dragonfly strays too far from its spawn point, and leash-based movement—by constructing and maintaining a behavior tree during `OnStart()`. It interacts with core systems including combat, known locations, spawners, and stuck detection to ensure context-aware decision-making.

## Dependencies & Tags
- **Components used:** `combat`, `knownlocations`, `rampingspawner`, `stuckdetection`
- **Tags:** `lava` (used internally for entity filtering during spawner position selection)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity instance | — | The entity the brain belongs to (inherited from `Brain`). |
| `bt` | BehaviorTree instance | `nil` (assigned in `OnStart`) | The constructed behavior tree managing AI execution. |
| `_spawnpos` | Vector3 or `nil` | `nil` | Cached spawn position for lavae entities; computed once per spawner cycle. |
| `resetting` | boolean or `nil` | `nil` | Tracks whether a reset sequence is currently in progress. |

## Main Functions
### `OnSpawnLavae()`
* **Description:** Resets the cached spawn position and triggers the spawner to create one lavae entity. Called via the `"spawnlavae"` event.
* **Parameters:** None.
* **Returns:** `nil`.

### `OnStart()`
* **Description:** Constructs and assigns the behavior tree (`self.bt`) for the Dragonfly. The root node evaluates sub-trees in priority order: reset-fight logic, lavae spawning (with parallel leash and stuck handling), chase-and-attack, leash to home point, and (currently commented out) wander. This defines the Dragonfly’s full behavioral repertoire.
* **Parameters:** None.
* **Returns:** `nil`.

### `OnInitializationComplete()`
* **Description:** Records the Dragonfly’s initial world position as the `"spawnpoint"` using the `knownlocations` component. This point serves as the reference for home, reset distance, and spawner positioning.
* **Parameters:** None.
* **Returns:** `nil`.

### `HomePoint(inst)`
* **Description:** Helper function returning the stored `"spawnpoint"` location from the `knownlocations` component. Used as the target for the leash behavior.
* **Parameters:**
  * `inst` (Entity): The entity whose spawn point is queried (typically the Dragonfly itself).
* **Returns:** `Vector3` (via `:Get()`), or `nil` if `"spawnpoint"` has not been set.

### `ShouldResetFight(self)`
* **Description:** Determines if the Dragonfly has strayed beyond the configured reset distance (`TUNING.DRAGONFLY_RESET_DIST`) from its spawn point or entered water. If true, sets `inst.reset = true` and invokes `inst:Reset()`. Also updates the `"flyover"` state memory based on reset status.
* **Parameters:**
  * `self` (DragonflyBrain): The brain instance.
* **Returns:** `boolean` — `true` if a reset is needed, otherwise `false`.

### `ShouldRetryReset(self)`
* **Description:** Ensures the Dragonfly persists in attempting the `"GOHOME"` action during a reset attempt. Returns `false` on first call (to allow `GoHome` to buffer) and `true` only if a `"GOHOME"` action is no longer buffered and the reset is still active.
* **Parameters:**
  * `self` (DragonflyBrain).
* **Returns:** `boolean` — `true` if the buffered action should be re-evaluated, otherwise `false`.

### `GoHome(inst)`
* **Description:** Creates a buffered `"GOHOME"` action targeting the Dragonfly’s spawn point. Used to guide the entity back during reset attempts.
* **Parameters:**
  * `inst` (Entity): The Dragonfly entity.
* **Returns:** `BufferedAction` — Action request with `action = ACTIONS.GOHOME`.

### `ShouldSpawnFn(self)`
* **Description:** Determines whether to enter the lavae-spawning state. If no active waves remain, clears cached spawn position. Otherwise, computes and caches a spawn position near a lava pond near `"spawnpoint"` or defaults to the Dragonfly’s own position. Updates `"flyover"` state memory and returns the computed boolean flag.
* **Parameters:**
  * `self` (DragonflyBrain).
* **Returns:** `boolean` — `true` if spawners should execute, otherwise `false`.

## Events & Listeners
- **Listens to:** None (no `inst:ListenForEvent` calls are present).
- **Pushes:**
  * `"doattack"` — via `combat:TryAttack()` (indirect, via the `combat` component).
  * `"rampingspawner_spawn"` — via `rampingspawner:SpawnEntity()` (indirect, via the `rampingspawner` component).
  * `"spawnlavae"` — explicitly in `OnSpawnLavae()` and in the behavior tree’s `"Spawn Lavae"` branch.
  * `"reset"` — implicitly via `inst:Reset()` called within `ShouldResetFight()`.