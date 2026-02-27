---
id: shadowthrall_horns_brain
title: Shadowthrall Horns Brain
description: Controls the AI decision-making logic for Shadowthrall Horns, orchestrating attack timing, movement, and coordination with teammate entities.
tags: [ai, combat, boss, behavior_tree]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 72f45bd1
---

# Shadowthrall Horns Brain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The ShadowThrallHornsBrain component implements the behavior tree for the Shadowthrall Horns entity, which functions as a coordinated sub-division of the larger Shadowthrall boss. It manages combat prioritization, sequential attack coordination (especially with "hands" and "wings" teammates), and positional behavior (wandering, targeting, formation positioning). This brain integrates with several components: Combat for attack state and target tracking, EntityTracker for referencing teammates, and KnownLocations for spawn-based homing.

## Usage example
This brain is typically attached to an entity instance during prefab initialization and does not require manual method calls. The behavior tree is constructed automatically when the entity enters its StateGraph.

```lua
inst:AddComponent("shadowthrallhornsbrain")
-- The component is added implicitly via prefabs that use this brain class
-- and the behavior tree starts running when the entity's stategraph begins.
```

## Dependencies & tags
**Components used:**
- `combat`: accessed via `inst.components.combat.target`, `inst.components.combat:InCooldown()`, `inst.components.combat:TargetIs(target)`.
- `entitytracker`: accessed via `inst.components.entitytracker:GetEntity(name)`.
- `knownlocations`: accessed via `inst.components.knownlocations:GetLocation(name)`.
- `stategraph`: referenced via `inst.sg:HasStateTag("jumping")`, `inst.sg.mem.lastattack`.

**Tags:** None identified (no tags added/removed by this component directly).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.formation` | `number` or `nil` | `nil` | Angle offset (in degrees) used to compute formation position relative to the target; only used if non-nil. |
| `bt` | `BT` | `nil` (assigned in `OnStart`) | The BehaviorTree root instance constructed during `OnStart()` initialization. |

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree root node for the Shadowthrall Horns entity. Constructs a hierarchical priority tree that handles turn-based attack sequencing, movement toward targets, formation positioning, wandering, and attack triggering.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** This function must be called exactly once during entity initialization (typically via the StateGraph). If `inst.formation` is set but target position is unavailable, formation calculation silently returns `nil`.

### `GetHome(inst)`
* **Description:** Helper function that retrieves the spawn point location for use in wandering or leashing logic.
* **Parameters:**
  - `inst`: Entity instance.
* **Returns:** `vector3` or `nil` — position of the location named `"spawnpoint"` from `KnownLocations`, or `nil` if not found.
* **Error states:** Returns `nil` if `"spawnpoint"` has not been registered in `KnownLocations`.

### `GetTarget(inst)`
* **Description:** Retrieves the current combat target of the entity.
* **Parameters:**
  - `inst`: Entity instance.
* **Returns:** Entity instance or `nil` — the value of `inst.components.combat.target`.
* **Error states:** May return `nil` if no target is set.

### `GetTargetPos(inst)`
* **Description:** Returns the current world position of the combat target.
* **Parameters:**
  - `inst`: Entity instance.
* **Returns:** `vector3` or `nil` — position of the target, or `nil` if no target exists.
* **Error states:** Returns `nil` if target is `nil` or target lacks `GetPosition()`.

### `GetFormationPos(inst)`
* **Description:** Calculates a position offset from the target based on the entity's configured `inst.formation` angle and a fixed distance (`FORMATION_DIST = 6`).
* **Parameters:**
  - `inst`: Entity instance.
* **Returns:** `vector3` or `nil` — offset position if `inst.formation` is set and target position is available; otherwise `nil`.
* **Error states:** May return `nil` if `inst.formation` is `nil`, or if `GetTargetPos(inst)` returns `nil`.

### `IsTheirTurnToAttack(inst, teammate)`
* **Description:** Determines whether a specified teammate (`teammate` name such as `"hands"` or `"wings"`) should attack before this entity based on attack timestamp comparison and shared target.
* **Parameters:**
  - `inst`: Entity instance.
  - `teammate`: `string` — name key for the teammate entity as registered in `EntityTracker`.
* **Returns:** `boolean` — `true` if the teammate is present, has a valid StateGraph memory with a recorded `lastattack`, and attacked earlier than this entity while sharing the same target.
* **Error states:** Returns `false` if teammate is `nil`, missing StateGraph, missing `lastattack`, missing Combat component, or has a different target.

### `IsMyTurnToAttack(inst)`
* **Description:** Checks whether this entity is allowed to initiate an attack, considering both its own combat cooldown and precedence over teammates.
* **Parameters:**
  - `inst`: Entity instance.
* **Returns:** `boolean` — `true` if attack is not on cooldown and no teammate with precedence has attacked more recently.
* **Error states:** Returns `false` if currently in attack cooldown or if a teammate's turn is active per `IsTheirTurnToAttack`.

### `IsTarget(inst, target)`
* **Description:** Convenience wrapper around `Combat:TargetIs`.
* **Parameters:**
  - `inst`: Entity instance.
  - `target`: Entity instance — the entity to compare against the current combat target.
* **Returns:** `boolean` — `true` if `target` matches `inst.components.combat.target`.
* **Error states:** Returns `false` if `target` is `nil` or mismatched.

## Events & listeners
- **Listens to:** None (this brain does not register its own event listeners; it uses StateGraph memory and component callbacks).
- **Pushes:**
  - `"doattack"` — pushed via `inst:PushEvent("doattack", { target = ... })` when the entity’s turn arrives and attack conditions are met (inside `ForceAttack` node). This event triggers the actual combat action sequence.

The `"doattack"` event is expected to be handled elsewhere, typically by combat-related StateGraph states or prefabs referencing the entity's attack logic.