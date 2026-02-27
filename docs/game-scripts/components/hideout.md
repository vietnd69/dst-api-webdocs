---
id: hideout
title: Hideout
description: Manages a collection of stored creatures, allowing them to be safely housed, spawned, and released over time with configurable intervals.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 49ed7949
---

# Hideout

## Overview
The `Hideout` component acts as a storage mechanism for creatures within the Entity Component System. It maintains an internal list of creatures (`storedcreatures`) that are temporarily removed from the world (hibernated and moved off-screen) and provides controlled logic for releasing them back into the game world at randomized intervals. It also supports callbacks for key lifecycle events such as occupancy, spawning, vacating, and return-to-home.

## Dependencies & Tags
- **Dependencies:** Relies on the `BrainManager` module (for `Wake` and `Hibernate` calls), the `FindWalkableOffset` utility function, and global helpers like `GetRandomItem`, `GetTableSize`, and constants `TWOPI`.
- **Component usage pattern:** Intended to be added to an entity via `inst:AddComponent("hideout")`. It does not automatically add or remove tags.
- **No explicit component dependencies** are declared in the constructor, but it assumes existence of components like `Transform`, `health`, and optionally `brain` and `SoundEmitter` on the entities it manages.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed in) | Reference to the owner entity of this hideout. |
| `storedcreatures` | `table` | `{}` | Map (entity key → entity value) of creatures currently housed in this hideout. |
| `numstoredcreatures` | `number` | `0` | Count of currently stored creatures. |
| `onvacate` | `function?` | `nil` | Callback triggered when the last creature is released (hideout becomes empty). |
| `onoccupied` | `function?` | `nil` | Callback triggered when the first creature is stored (hideout transitions from empty to occupied). |
| `onspawned` | `function?` | `nil` | Callback triggered after a creature is successfully spawned back into the world. |
| `ongohome` | `function?` | `nil` | Callback triggered when a creature is stored in the hideout. |
| `timetonextspawn` | `number` | `0` | Time remaining until the next creature spawn attempt. |
| `spawnperiod` | `number` | `20` | Base interval (in seconds) between spawn attempts. |
| `spawnvariance` | `number` | `4` (default: 10% of period) | Random variance (±half this value) added to the spawn interval. |
| `spawnoffscreen` | `boolean` | `false` | If `true`, creatures may be released even if the hideout is asleep. |
| `task` | `Task?` | `nil` | Periodic task used for spawning logic; `nil` when spawning is stopped. |
| `canrealeasefn` | `function?` | `nil` | *(Note: appears only in `CanRelease()` but is not initialized; likely intended but unused.)* |

## Main Functions
### `Hideout:SetSpawnPeriod(period, variance)`
* **Description:** Configures the base spawn interval and its variance. Used to adjust how frequently creatures are released.
* **Parameters:**  
  - `period` (`number`): Base time (seconds) between spawns.  
  - `variance` (`number?`): Optional variance value; if omitted, defaults to 10% of `period`.

### `Hideout:OnUpdate(dt)`
* **Description:** Main update loop; decrements the spawn timer and attempts to release a child if the timer is up and `CanRelease()` returns true.
* **Parameters:**  
  - `dt` (`number`): Delta time (seconds) since the last frame.

### `Hideout:StartUpdate()`
* **Description:** Initializes the periodic task used for `OnUpdate`, with an initial delay computed from spawn parameters. Prevents duplicate tasks.
* **Parameters:** None.

### `Hideout:StartSpawning()`
* **Description:** Begins the spawning cycle by resetting the spawn timer and starting the update task.
* **Parameters:** None.

### `Hideout:StopSpawning()`
* **Description:** Cancels and clears the periodic task, effectively halting creature release attempts.
* **Parameters:** None.

### `Hideout:SetOccupiedFn(fn)`
* **Description:** Registers a callback to invoke when the hideout becomes occupied (i.e., first creature is stored).
* **Parameters:**  
  - `fn` (`function?`): Callback `(owner, child) → nil`. Signature expected: `(hideout_owner_entity, stored_child_entity)`.

### `Hideout:SetSpawnedFn(fn)`
* **Description:** Registers a callback to invoke after a creature is released into the world.
* **Parameters:**  
  - `fn` (`function?`): Callback `(hideout_owner, spawned_child) → nil`.

### `Hideout:SetGoHomeFn(fn)`
* **Description:** Registers a callback to invoke when a creature is stored in the hideout.
* **Parameters:**  
  - `fn` (`function?`): Callback `(hideout_owner, count?) → nil`. *(Note: source code passes `count` but `count` is undefined—likely a bug; should be `self.numstoredcreatures`.)*

### `Hideout:SetVacateFn(fn)`
* **Description:** Registers a callback to invoke when the hideout becomes empty after releasing a creature.
* **Parameters:**  
  - `fn` (`function?`): Callback `(hideout_owner) → nil`.

### `Hideout:DoReleaseChild(target, child, radius)`
* **Description:** Internal helper that physically places a stored creature in the world at a walkable location near the hideout. Wakes its brain (if present) and optionally assigns a combat target.
* **Parameters:**  
  - `target` (`Entity?`): Optional combat target to set for the child.  
  - `child` (`Entity`): The creature to release.  
  - `radius` (`number?`): Minimum radius (meters) around hideout to search for a spawn point; defaults to `0.5 + hideout_radius`.

### `Hideout:ReleaseChild(target, prefab, radius)`
* **Description:** Releases a random stored creature (if possible) and removes it from the internal list. Triggers `onvacate` if this leaves the hideout empty.
* **Parameters:**  
  - `target` (`Entity?`): Combat target to assign to the spawned creature.  
  - `prefab` (`string?`): *(Unused in implementation; present in signature but ignored.)*  
  - `radius` (`number?`): Spawn radius offset.

### `Hideout:GoHome(child)`
* **Description:** Stores a creature in the hideout, removing it from the scene, hibernating its brain, and stopping its sounds. Triggers `ongohome` and `onoccupied` callbacks.
* **Parameters:**  
  - `child` (`Entity`): The creature to store.

### `Hideout:CanRelease()`
* **Description:** Evaluates whether the hideout is allowed to release a creature. Considers count, sleep state, validity, health status, and (tentatively) a custom function.
* **Parameters:** None.

### `Hideout:ReleaseAllChildren(target, prefab)`
* **Description:** Releases all stored creatures consecutively until none remain.
* **Parameters:**  
  - `target` (`Entity?`): Combat target for spawned creatures.  
  - `prefab` (`string?`): *(Unused.)*

### `Hideout:LongUpdate(dt)`
* **Description:** Mirrors `OnUpdate` for environments that prefer long-update calls over periodic tasks (e.g., server world updates).
* **Parameters:**  
  - `dt` (`number`): Delta time.

### `Hideout:GetDebugString()`
* **Description:** Returns a human-readable debug string summarizing spawning status and stored creatures.
* **Parameters:** None.

## Events & Listeners
- **No events are listened to or pushed.**  
  The component uses callback properties (`onoccupied`, `onspawned`, etc.) to emit state changes and does not call `inst:ListenForEvent` or `inst:PushEvent`.