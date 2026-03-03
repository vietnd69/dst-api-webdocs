---
id: chaseandram
title: Chaseandram
description: A behavior node that executes a charged ram attack toward a target, managing pursuit, alignment, and termination conditions such as distance, time, or attack count limits.
tags: [ai, combat, locomotion, boss]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: ai
source_hash: bee17ea9
system_scope: ai
---

# Chaseandram

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Chaseandram` is a `BehaviourNode` subclass responsible for orchestrating a target-chasing and ramming maneuver (e.g., a charging attack) for an entity. It coordinates movement via `locomotor`, triggers combat actions via `combat`, and enforces runtime limits based on time, distance, or number of attacks. It is typically used for boss or aggressive AI entities that must close distance before striking.

The node listens for `onattackother` and `onmissother` events to track attack attempts and resets pursuit timers accordingly. During execution, it adds the `ChaseAndRam` tag to the entity and removes it upon success or failure.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("combat")
inst:AddComponent("locomotor")
inst:AddComponent("health")
inst:AddComponent("embarker") -- optional, affects platform-hopping logic

local chase_node = Chaseandram(inst, max_chase_time=5, give_up_dist=12, max_charge_dist=20, max_attacks=3)
chase_node:Visit() -- Called during AI update loop
```

## Dependencies & tags
**Components used:** `combat`, `locomotor`, `health`, `embarker` (optional, used for platform detection)  
**Tags:** Adds `ChaseAndRam` while running; removes on failure/success.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | — | The entity instance this behavior controls. |
| `max_chase_time` | number | — | Maximum time (seconds) allowed for the chase before aborting. |
| `give_up_dist` | number | — | Distance (squared threshold via `distsq`) beyond which the behavior fails if the target is missed while overshooting. |
| `max_charge_dist` | number | — | Maximum distance from start point allowed during the charge; exceeded → fail. |
| `max_attacks` | number? | `nil` | Optional limit on number of attacks; exceeded → succeed. |
| `numattacks` | number | `0` | Counter for successful attacks (incremented on `onattackother`/`onmissother`). |
| `startruntime` | number? | `nil` | Timestamp when the run began, used to enforce `max_chase_time`. |
| `startloc` | Vector? | `nil` | Position vector at start of charge. |
| `ram_angle` | number? | `nil` | Target angle for the ram (in radians). |
| `ram_vector` | Vector? | `nil` | Normalized direction vector of the ram. |
| `onattackfn` | function | — | Internal callback for `onattackother` and `onmissother` events. |

## Main functions
### `OnStop()`
* **Description:** Cleans up event listeners and is called when the behavior is aborted or preempted (e.g., by a higher-priority node).
* **Parameters:** None.
* **Returns:** Nothing.

### `OnAttackOther(target)`
* **Description:** Increments `numattacks` and resets `startruntime` (to delay time-based timeout). Called automatically on attack events.
* **Parameters:** `target` — the target entity involved in the attack (ignored; stored in `data.target` in event handler).
* **Returns:** Nothing.

### `AreDifferentPlatforms(inst, target)`
* **Description:** Determines whether the entity and target are on different platforms (e.g., ground vs. floating). Checks `embarker` component if present.
* **Parameters:**  
  - `inst` (Entity) — usually `self.inst`  
  - `target` (Entity) — the target entity  
* **Returns:** `true` if platforms differ and `embarker` exists; otherwise `false`.
* **Error states:** Returns `false` if `embarker` component is absent.

### `Visit()`
* **Description:** Core behavior execution logic. Handles state transitions (`READY` → `RUNNING` → `SUCCESS`/`FAILED`) and movement logic. Must be called periodically by the AI system.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:**  
  - Immediately sets `status = FAILED` if target is invalid or missing at `READY` stage.  
  - Sets `status = SUCCESS` if target dies mid-run.  
  - Sets `status = FAILED` on timeout, distance limit, missed charge, or different-platform failure.  
  - Resets `ram_vector`, stops locomotion, removes `ChaseAndRam` tag, and clears combat target on failure.

## Events & listeners
- **Listens to:**  
  - `onattackother` — tracked via `onattackfn` to count attacks and reset chase timer.  
  - `onmissother` — also tracked via `onattackfn` (both events increment `numattacks`).  
- **Pushes:** None (relies on `combat:ForceAttack()` and `locomotor` side effects to trigger further gameplay events).
