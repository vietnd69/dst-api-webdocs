---
id: childspawner
title: Childspawner
description: Manages the spawning, tracking, and regeneration of child entities for parent entities such as bosses or nest structures.
tags: [spawn, boss, entity, regen]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 8d24c6ec
system_scope: entity
---

# Childspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Childspawner` is an entity component that handles the lifecycle of child prefabs spawned by a parent entity. It manages two pools of children: standard children and emergency children (used for multiplayer scalability). The component tracks children both inside (available to spawn) and outside (active in the world), supports automatic spawning with configurable timing and variance, regenerates dead children, and provides hooks for custom logic via callback functions. It integrates with `combat`, `health`, `homeseeker`, `inventoryitem`, and `knownlocations` components on child entities during spawning and ownership transfer.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("childspawner")
inst.components.childspawner:SetMaxChildren(5)
inst.components.childspawner:SetSpawnPeriod(15, 5)
inst.components.childspawner:SetRegenPeriod(30, 5)
inst.components.childspawner:SetRareChild("rarechild_prefab", 0.1)
inst.components.childspawner:SetSpawnedFn(function(parent, child) print("Spawned:", child.prefab) end)
inst.components.childspawner:StartSpawning()
inst.components.childspawner:StartRegen()
```

## Dependencies & tags
**Components used:** `combat`, `health`, `homeseeker`, `inventoryitem`, `knownlocations`  
**Tags:** Adds `homing`, `spawner`, `child` to child entities (implicitly via prefabs); does not add tags to self.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `childname` | string | `""` | Default prefab name for standard children. |
| `rarechild` | string | `nil` | Optional rare child prefab name. |
| `rarechildchance` | number | `0.1` | Chance (0.0–1.0) to spawn `rarechild` instead of `childname`. |
| `maxchildren` | number | `0` | Maximum total standard children (inside + outside). |
| `childreninside` | number | `1` | Number of standard children currently available to spawn. |
| `numchildrenoutside` | number | `0` | Number of standard children currently active in the world. |
| `emergencychildname` | string | `nil` | Prefab name for emergency children. |
| `maxemergencychildren` | number | `0` | Maximum total emergency children. |
| `emergencychildreninside` | number | `0` | Emergency children available to spawn. |
| `numemergencychildrenoutside` | number | `0` | Emergency children active in the world. |
| `spawning` | boolean | `false` | Whether automatic spawning is enabled. |
| `queued_spawn` | boolean | `false` | Whether a spawn is queued due to being asleep/offscreen. |
| `timetonextspawn` | number | `0` | Seconds until next automatic spawn. |
| `spawnperiod` | number | `20` | Base delay (seconds) between spawns. |
| `spawnvariance` | number | `2` | Variance (seconds) added to `spawnperiod`. |
| `regening` | boolean | `true` | Whether child regeneration is enabled. |
| `timetonextregen` | number | `0` | Seconds until next regeneration. |
| `regenperiod` | number | `20` | Base delay (seconds) between regenerations. |
| `regenvariance` | number | `2` | Variance (seconds) added to `regenperiod`. |
| `spawnoffscreen` | boolean | `false` | Whether children can spawn while parent is asleep. |
| `useexternaltimer` | boolean | `false` | Whether spawning/regen timing is handled externally via callbacks. |
| `emergencydetectionradius` | number | `10` | Radius around parent used to compute emergency child commit count. |
| `maxemergencycommit` | number | `0` | Number of emergency children currently committed (active + dead). |
| `canspawnfn` | function | `nil` | Optional predicate function (`fn(inst) -> boolean`) to gate spawning. |
| `gohomevalidatefn` | function | `nil` | Optional predicate function (`fn(inst) -> boolean`) to gate child returning home. |
| `overridespawnlocation` | function | `nil` | Optional function (`fn(inst) -> Vector3?`) to override spawn position. |
| `wateronly` | boolean | `false` | Whether spawned children must spawn in water (if `overridespawnlocation` not set). |
| `allowwater` | boolean | `false` | Whether water tiles are acceptable spawn locations. |
| `allowboats` | boolean | `false` | Whether boats are acceptable spawn locations. |
| `spawn_height` | number | `0` | Y-offset applied to spawn position. |
| `onvacate` | function | `nil` | Callback when `childreninside` drops to `0`. |
| `onoccupied` | function | `nil` | Callback when `childreninside` increases from `0`. |
| `onspawned` | function | `nil` | Callback fired when a child is spawned (`fn(parent, child)`). |
| `ontakeownership` | function | `nil` | Callback when a child is claimed by parent (`fn(parent, child)`). |
| `ongohome` | function | `nil` | Callback when a child returns home (`fn(parent, child)`). |
| `onchildkilledfn` | function | `nil` | Callback when a child is killed (`fn(parent, child)`). |
| `onaddchild` | function | `nil` | Callback when children are added to `childreninside` (`fn(parent, count)`). |
| `save_max_children` | boolean | `false` | Whether `maxchildren` and `maxemergencychildren` are serialized. |

## Main functions
### `GetTimeToNextSpawn()`
* **Description:** Returns the time until the next spawn attempt, computed using `spawnperiod` and `spawnvariance`.
* **Parameters:** None.
* **Returns:** `number` — time in seconds.

### `GetTimeToNextRegen()`
* **Description:** Returns the time until the next regeneration attempt, computed using `regenperiod` and `regenvariance`.
* **Parameters:** None.
* **Returns:** `number` — time in seconds.

### `StartRegen()`
* **Description:** Enables child regeneration and schedules the first regen if not full.
* **Parameters:** None.
* **Returns:** Nothing.

### `StopRegen()`
* **Description:** Disables child regeneration and attempts to stop the update loop.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetSpawnPeriod(period, variance)`
* **Description:** Sets the base delay and variance for spawning intervals.
* **Parameters:** 
  * `period` (number) — base delay in seconds.
  * `variance` (number, optional) — optional variance; defaults to `period * 0.1`.
* **Returns:** Nothing.

### `SetRegenPeriod(period, variance)`
* **Description:** Sets the base delay and variance for regen intervals.
* **Parameters:** 
  * `period` (number) — base delay in seconds.
  * `variance` (number, optional) — optional variance; defaults to `period * 0.1`.
* **Returns:** Nothing.

### `IsFull()`
* **Description:** Returns whether the maximum number of standard children has been reached.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `NumChildren() >= maxchildren`.

### `NumChildren()`
* **Description:** Returns the total number of standard children (inside + outside).
* **Parameters:** None.
* **Returns:** `number`.

### `IsEmergencyFull()`
* **Description:** Returns whether the maximum number of emergency children has been reached.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `NumEmergencyChildren() >= maxemergencychildren`.

### `NumEmergencyChildren()`
* **Description:** Returns the total number of emergency children (inside + outside).
* **Parameters:** None.
* **Returns:** `number`.

### `DoRegen()`
* **Description:** Increments internal child counts for both standard and emergency pools if regening is active and not full.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Periodic update function that handles spawning and regen timing. Handles external timer callbacks if `useexternaltimer` is enabled.
* **Parameters:** `dt` (number) — time delta in seconds.
* **Returns:** Nothing.

### `StartSpawning()`
* **Description:** Enables automatic spawning, resets spawn timer, and starts the update loop.
* **Parameters:** None.
* **Returns:** Nothing.

### `StopSpawning()`
* **Description:** Disables automatic spawning and attempts to stop the update loop.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetMaxChildren(max)`
* **Description:** Sets the maximum number of standard children and adjusts `childreninside` accordingly.
* **Parameters:** `max` (number) — new maximum.
* **Returns:** Nothing.

### `SetMaxEmergencyChildren(max)`
* **Description:** Sets the maximum number of emergency children and adjusts `emergencychildreninside` accordingly.
* **Parameters:** `max` (number) — new maximum.
* **Returns:** Nothing.

### `DoTakeOwnership(child)`
* **Description:** Configures child properties for ownership by this spawner: sets home, adds `homeseeker` if missing, sets `home` location via `knownlocations`, and adds listeners.
* **Parameters:** `child` (Entity) — the child entity to claim.
* **Returns:** Nothing.

### `TakeOwnership(child)`
* **Description:** Claims a child as standard (non-emergency) and tracks it outside.
* **Parameters:** `child` (Entity).
* **Returns:** Nothing.

### `TakeEmergencyOwnership(child)`
* **Description:** Claims a child as emergency and tracks it in the emergency pool.
* **Parameters:** `child` (Entity).
* **Returns:** Nothing.

### `SpawnChild(target, prefab, radius)`
* **Description:** Spawns a standard child. If `prefab` is provided, uses it; otherwise uses `childname` or `rarechild` (if triggered). Registers child and decrements `childreninside`.
* **Parameters:** 
  * `target` (Entity, optional) — target for child’s `combat` component.
  * `prefab` (string, optional) — override prefab name.
  * `radius` (number, optional) — spawn radius.
* **Returns:** `Entity?` — spawned child or `nil` if spawn failed.

### `SpawnEmergencyChild(target, prefab, radius)`
* **Description:** Spawns an emergency child. Only spawns if `CanEmergencySpawn()` passes.
* **Parameters:** Same as `SpawnChild`.
* **Returns:** `Entity?` — spawned child or `nil`.

### `QueueSpawnChild()`
* **Description:** Queues a spawn to occur when the parent wakes up (e.g., if asleep or offscreen).
* **Parameters:** None.
* **Returns:** Nothing.

### `DoQueuedSpawn()`
* **Description:** Executes a queued spawn if spawning is enabled and conditions allow.
* **Parameters:** None.
* **Returns:** Nothing.

### `CanSpawn()`
* **Description:** Checks whether conditions allow spawning a standard child.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if valid, spawning enabled, and health not dead.

### `CanEmergencySpawn()`
* **Description:** Checks whether conditions allow spawning an emergency child.
* **Parameters:** None.
* **Returns:** `boolean`.

### `OnChildKilled(child)`
* **Description:** Called when a tracked child dies or is removed. Removes listener and updates counters.
* **Parameters:** `child` (Entity).
* **Returns:** Nothing.

### `GoHome(child)`
* **Description:** Attempts to return a child to the spawner (e.g., if captured or completed task). Fires events and resets counters.
* **Parameters:** `child` (Entity).
* **Returns:** `boolean` — `true` if child was successfully returned.

### `ReleaseAllChildren(target, prefab, radius)`
* **Description:** Spawns all available children (standard and emergency) until pools are empty or spawn fails repeatedly.
* **Parameters:** Same as `SpawnChild`.
* **Returns:** `table<Entity>` — list of spawned children.

### `AddChildrenInside(count)`
* **Description:** Increases the `childreninside` pool, fires `onoccupied` if first child added, and restarts update loop.
* **Parameters:** `count` (number).
* **Returns:** Nothing.

### `AddEmergencyChildrenInside(count)`
* **Description:** Increases the `emergencychildreninside` pool.
* **Parameters:** `count` (number).
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes child state and timers for save/load.
* **Parameters:** None.
* **Returns:** `data` (table), `references` (table of GUIDs).

### `OnLoad(data)`
* **Description:** Restores child state and timers from save data.
* **Parameters:** `data` (table) — data from `OnSave`.
* **Returns:** Nothing.

### `LoadPostPass(newents, savedata)`
* **Description:** Recovers child entities after world load using saved GUIDs.
* **Parameters:** 
  * `newents` (table) — mapping of GUIDs to entities.
  * `savedata` (table) — part of `OnLoad` data.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable summary for debug display.
* **Parameters:** None.
* **Returns:** `string`.

## Events & listeners
- **Listens to:**  
  * `ontrapped`, `death`, `onremove`, `detachchild` — on each child (added via `AddChildListeners`/`RemoveChildListeners`) to detect child loss.
- **Pushes:**  
  * `childgoinghome` — fired when a child begins returning home.  
  * `goinghome` — fired on the child entity itself when returning home.  
