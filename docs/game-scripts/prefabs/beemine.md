---
id: beemine
title: Beemine
description: Creates beemine trap entities that can be deployed, armed, and explode to spawn aggressive bees.
tags: [trap, entity, combat, deployment]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: root
source_hash: 7388af20
system_scope: entity
---

# Beemine

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
`beemine.lua` is a prefab factory file that creates beemine trap entities. These entities function as deployable mines that can be armed, triggered, and explode to spawn aggressive bees targeting nearby creatures or players. The prefab integrates with the `mine` component for trap logic, `inventoryitem` for pickup/drop handling, `deployable` for placement, `workable` for hammering, and `hauntable` for ghost interactions. Beemines exhibit rattling behavior when armed and transition through inactive, armed, sprung, and exploded states.

## Usage example
```lua
-- Create a standard player-aligned beemine with inventory capability
local beemine_prefab = BeeMine("beemine", "player", "bee_mine", "bee", true)

-- Spawn the beemine in the world
local inst = SpawnPrefab("beemine")

-- The mine component handles arming and explosion logic
inst.components.mine:Reset()  -- Arms the mine
inst.components.mine:Explode(target)  -- Triggers explosion manually
```

## Dependencies & tags
**Components used:** `mine`, `inventoryitem`, `deployable`, `workable`, `hauntable`, `inspectable`, `lootdropper`, `combat` (on spawned bees)
**Tags:** Adds `mine`; checks `insect`, `playerghost`, `character`, `animal`, `monster`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `rattletask` | task | `nil` | Scheduled task for rattling animation/sound cycle |
| `rattling` | boolean | `false` | Whether the mine is currently in rattling state |
| `nextrattletime` | number | `nil` | Timestamp for next rattle when entity wakes from sleep |
| `beeprefab` | string | varies | Prefab name of bees to spawn on explosion |
| `spawntask` | task | `nil` | Scheduled task for bee spawning after explosion |
| `persists` | boolean | `true` | Whether entity persists through save/load (set to `false` on explosion) |

## Main functions
### `BeeMine(name, alignment, skin, spawnprefab, isinventory)`
*   **Description:** Factory function that creates and returns a beemine prefab configuration. Called at module load to register prefabs.
*   **Parameters:** `name` (string) - prefab identifier; `alignment` (string) - mine alignment faction; `skin` (string) - animation skin name; `spawnprefab` (string) - bee prefab to spawn; `isinventory` (boolean) - whether mine can be picked up
*   **Returns:** Prefab object registered with the prefab system
*   **Error states:** Returns early on client simulation (`TheWorld.ismastersim` is false)

### `OnExplode(inst)`
*   **Description:** Callback executed when the mine explodes. Stops rattling, plays explosion animation, spawns bees, and cleans up components.
*   **Parameters:** `inst` (entity) - the beemine instance
*   **Returns:** Nothing
*   **Error states:** Returns early if `spawntask` already exists (prevent double explosion)

### `OnReset(inst)`
*   **Description:** Callback executed when the mine is reset/rearmed. Plays reset animation, restarts rattling, and enables minimap icon.
*   **Parameters:** `inst` (entity) - the beemine instance
*   **Returns:** Nothing

### `SetSprung(inst)`
*   **Description:** Callback executed when mine transitions to sprung state. Enables minimap, starts delayed rattling.
*   **Parameters:** `inst` (entity) - the beemine instance
*   **Returns:** Nothing

### `SetInactive(inst)`
*   **Description:** Callback executed when mine is deactivated. Disables minimap, plays inactive animation, stops rattling.
*   **Parameters:** `inst` (entity) - the beemine instance
*   **Returns:** Nothing

### `OnHaunt(inst, haunter)`
*   **Description:** Callback for ghost haunt interactions. Behavior varies based on mine state (inactive, sprung, or armed).
*   **Parameters:** `inst` (entity) - the beemine instance; `haunter` (entity) - the ghost performing the haunt
*   **Returns:** `true` if haunt succeeded, `false` otherwise
*   **Error states:** Returns `false` if mine is already sprung; inactive mines always succeed with small launch

### `SpawnBees(inst, target)`
*   **Description:** Spawns bees around the mine and sets their combat target. Called after explosion delay.
*   **Parameters:** `inst` (entity) - the beemine instance; `target` (entity) - optional target for bees to attack
*   **Returns:** Nothing
*   **Error states:** If no target provided, searches for valid entities within 25 units excluding insects and player ghosts

### `StartRattling(inst, delay)`
*   **Description:** Initiates the rattling behavior (animation and sound loop). Respects sleep state.
*   **Parameters:** `inst` (entity) - the beemine instance; `delay` (number) - optional delay before first rattle
*   **Returns:** Nothing

### `StopRattling(inst)`
*   **Description:** Stops all rattling behavior and clears related tasks.
*   **Parameters:** `inst` (entity) - the beemine instance
*   **Returns:** Nothing

### `OnEntitySleep(inst)`
*   **Description:** Handler called when entity goes to sleep. Preserves rattle timing for wake restoration.
*   **Parameters:** `inst` (entity) - the beemine instance
*   **Returns:** Nothing

### `OnEntityWake(inst)`
*   **Description:** Handler called when entity wakes from sleep. Restores rattling task with preserved timing.
*   **Parameters:** `inst` (entity) - the beemine instance
*   **Returns:** Nothing

## Events & listeners
- **Listens to:** `animover` - triggers entity removal after explosion animation completes
- **Pushes:** `coveredinbees` - fired on target when bees spawn and assign aggression