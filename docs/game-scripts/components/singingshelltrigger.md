---
id: singingshelltrigger
title: Singingshelltrigger
description: Triggers activation logic on nearby singing shells when the entity (e.g., a player or builder) enters their detection range, and deactivates upon death.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 5a5b5d46
---

# Singingshelltrigger

## Overview  
This component monitors the entity's surroundings for nearby entities tagged with `"singingshell"` (and not `"INLIMBO"`) within a fixed range, and invokes a custom `_activatefn` callback on each newly detected shell. It automatically starts/stops its update loop in response to death and resurrection events, ensuring activation logic only runs while the entity is alive.

## Dependencies & Tags  
- **Component Requirements**: None (uses only built-in engine APIs like `TheSim:FindEntities` and component update infrastructure).
- **Tags Added**: `"singingshelltrigger"`  
- **Tags Removed on Remove**: `"singingshelltrigger"`  
- **Listened Events**: `"death"`, `"respawnfromghost"`  
- **External Dependency Check**: Verifies existence of `TheWorld.components.singingshellmanager` before starting updates.

## Properties  
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `trigger_range` | number | `4` | Radius (in units) within which to scan for singing shells. |
| `findentitiesfn` | function | `findentities` (local closure) | Function used to locate entities matching shell criteria. |
| `updating` | boolean | `false` | Tracks whether the component’s `OnUpdate` is currently scheduled. |
| `overlapping` | table | `{}` | Tracks which entities are currently overlapping; keys are entity instances, values are `true` (first frame) or `false` (subsequent frames). |

## Main Functions  
### `StartUpdating()`  
* **Description:** Begins invoking `OnUpdate` each game tick by registering the component with the entity’s update manager. Ensures idempotency by only starting if not already updating.  
* **Parameters:** None.  

### `StopUpdating()`  
* **Description:** Halts the `OnUpdate` loop by unregistering the component from the entity’s update manager. Prevents unnecessary processing when inactive (e.g., on death).  
* **Parameters:** None.  

### `OnUpdate()`  
* **Description:** Executes each tick while `updating` is `true`. Clears stale overlap tracking, then scans for nearby singing shells and invokes `_activatefn(v, self.inst)` on newly detected shells. Maintains overlap state to differentiate first-frame detection from continued presence.  
* **Parameters:** None.  

### `OnRemoveFromEntity()`  
* **Description:** Cleans up upon component removal: removes the `"singingshelltrigger"` tag, and unregisters death/resurrection event callbacks.  
* **Parameters:** None.  

## Events & Listeners  
- Listens to `"death"` → invokes `ondeath(inst)`, which calls `StopUpdating()`.  
- Listens to `"respawnfromghost"` → invokes `onresurrect(inst)`, which calls `StartUpdating()`.