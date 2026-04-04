---
id: beehive
title: Beehive
description: Defines the Beehive prefab entity that spawns bees, handles combat interactions, and drops loot when destroyed.
tags: [prefab, entity, spawning, combat, structure]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: root
source_hash: f367067e
system_scope: entity
---

# Beehive

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
`beehive.lua` defines the Beehive prefab entity in Don't Starve Together. This structure spawns bees periodically, reacts to player attacks by releasing killer bees, and drops honey and honeycomb loot when destroyed. It integrates multiple components including `childspawner` for bee management, `combat` for defensive behavior, `burnable` and `freezable` for environmental interactions, and `hauntable` for ghost interactions. The beehive adjusts its spawning rates based on season and day/night cycles.

## Usage example
```lua
-- Spawn a beehive in the world
local beehive = SpawnPrefab("beehive")
beehive.Transform:SetPosition(10, 0, 10)

-- Access components to modify behavior
beehive.components.health:SetMaxHealth(300)
beehive.components.childspawner:SetMaxChildren(10)
beehive.components.lootdropper:SetLoot({ "honey", "honeycomb" })

-- Manually trigger bee release
beehive.components.childspawner:ReleaseAllChildren(player, "killerbee")
```

## Dependencies & tags
**Components used:** `health`, `childspawner`, `lootdropper`, `burnable`, `freezable`, `combat`, `hauntable`, `inspectable`, `transform`, `animstate`, `soundemitter`, `minimapentity`, `network`

**Tags:** Adds `structure`, `lifedrainable`, `beaverchewable`, `hive`, `beehive`

## Properties
No public properties

## Main functions
### `fn()`
*   **Description:** Constructor function that creates and configures the Beehive entity instance. Called internally by the prefab system when spawning.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) - The configured beehive entity instance.
*   **Error states:** Returns early on clientside (`not TheWorld.ismastersim`) with minimal components.

### `OnHit(inst, attacker, damage)`
*   **Description:** Called when the beehive receives damage. Releases all children as killer bees toward the attacker and plays hit animation/sound.
*   **Parameters:** `inst` (Entity) - The beehive instance. `attacker` (Entity) - The entity that dealt damage. `damage` (number) - Damage amount.
*   **Returns:** Nothing.
*   **Error states:** Only releases children if `childspawner` component exists.

### `OnKilled(inst)`
*   **Description:** Called when the beehive dies. Removes childspawner, plays death animation, drops loot, and destroys physics colliders.
*   **Parameters:** `inst` (Entity) - The beehive instance.
*   **Returns:** Nothing.

### `OnIgnite(inst)`
*   **Description:** Called when the beehive is set on fire. Releases all children and stops spawning loop sound.
*   **Parameters:** `inst` (Entity) - The beehive instance.
*   **Returns:** Nothing.

### `OnFreeze(inst)`
*   **Description:** Called when the beehive is frozen. Plays freeze sound/animation and stops bee spawning.
*   **Parameters:** `inst` (Entity) - The beehive instance.
*   **Returns:** Nothing.

### `OnThaw(inst)`
*   **Description:** Called when the beehive begins thawing. Plays thawing sound and animation.
*   **Parameters:** `inst` (Entity) - The beehive instance.
*   **Returns:** Nothing.

### `OnUnFreeze(inst)`
*   **Description:** Called when the beehive fully thaws. Clears freeze overrides and resumes bee spawning.
*   **Parameters:** `inst` (Entity) - The beehive instance.
*   **Returns:** Nothing.

### `OnHaunt(inst)`
*   **Description:** Called when a ghost haunts the beehive. Has 50% chance to succeed, finds a valid combat target within 25 units, and triggers OnHit behavior.
*   **Parameters:** `inst` (Entity) - The beehive instance.
*   **Returns:** `boolean` - `true` if haunt succeeded and attacked a target, `false` otherwise.
*   **Error states:** Returns `false` if childspawner is missing, cannot spawn, or random check fails.

### `StartSpawning(inst)`
*   **Description:** Begins bee spawning if not winter and not frozen.
*   **Parameters:** `inst` (Entity) - The beehive instance.
*   **Returns:** Nothing.

### `StopSpawning(inst)`
*   **Description:** Stops bee spawning immediately.
*   **Parameters:** `inst` (Entity) - The beehive instance.
*   **Returns:** Nothing.

### `SeasonalSpawnChanges(inst, season)`
*   **Description:** Adjusts childspawner periods and max children based on current season. Spring increases spawn rates and bee capacity.
*   **Parameters:** `inst` (Entity) - The beehive instance. `season` (string) - Current season identifier.
*   **Returns:** Nothing.

### `OnIsDay(inst, isday)`
*   **Description:** Toggles spawning based on day/night cycle. Starts spawning during day, stops at night.
*   **Parameters:** `inst` (Entity) - The beehive instance. `isday` (boolean) - Whether it is currently daytime.
*   **Returns:** Nothing.

### `OnInit(inst)`
*   **Description:** Initializes world state watchers for day/night cycle. Called after entity creation.
*   **Parameters:** `inst` (Entity) - The beehive instance.
*   **Returns:** Nothing.

### `OnPreLoad(inst, data)`
*   **Description:** Handles save/load data restoration for childspawner timing.
*   **Parameters:** `inst` (Entity) - The beehive instance. `data` (table) - Save data containing spawn timing information.
*   **Returns:** Nothing.

### `OnEntityWake(inst)`
*   **Description:** Called when entity becomes active. Plays looping hive sound.
*   **Parameters:** `inst` (Entity) - The beehive instance.
*   **Returns:** Nothing.

### `OnEntitySleep(inst)`
*   **Description:** Called when entity goes to sleep. Stops looping hive sound.
*   **Parameters:** `inst` (Entity) - The beehive instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `isday` - Toggles spawning on day/night transition.
- **Listens to:** `season` - Adjusts spawn rates and capacity when season changes.
- **Listens to:** `freeze` - Triggers freeze behavior and stops spawning.
- **Listens to:** `onthaw` - Plays thawing animation and sound.
- **Listens to:** `unfreeze` - Resumes spawning and clears freeze state.
- **Listens to:** `death` - Triggers loot drop and cleanup on death.
- **Pushes:** `entity_droploot` - Fired via lootdropper component when beehive is destroyed.