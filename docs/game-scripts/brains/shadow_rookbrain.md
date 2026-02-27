---
id: shadow_rookbrain
title: Shadow Rookbrain
description: AI brain controlling Shadow Rook entities that manages targeting, facing, wandering, and timed despawn behavior via behavior tree logic.
tags: [ai, combat, boss, movement, timing]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: cf7345f5
---

# Shadow Rookbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This component defines the artificial intelligence (`Brain`) for Shadow Rook entities in `Don't Starve Together`. It implements behavior tree logic to coordinate movement, combat, facing orientation, and timed despawn behavior. The brain integrates with the `Combat` and `Health` components to maintain accurate targeting and respond to entity states, and uses the `Wander`, `FaceEntity`, and `ChaseAndAttack` behaviors to orchestrate movement and orientation behavior. It ensures the Rook maintains a defensive posture—prioritizing facing its target while optionally chasing if the target is outside attack range or out of combat cooldown.

## Usage example
The brain is attached to an entity instance during prefab initialization, typically as part of a boss entity (e.g., `shadow_rook.lua`). Once added via `inst:AddComponent("brain")` (with `Shadow_RookBrain` as the registered brain type), the behavior tree is automatically initialized on `OnStart()`.

```lua
inst:AddComponent("brain")
inst.components.brain:SetBrainClass("shadow_rookbrain")
inst:StartBrain()
```

## Dependencies & tags
**Components used:**
- `inst.components.combat` — for target checking (`HasTarget`), cooldown state (`InCooldown`), and attack range.
- `inst.components.health` — to verify target is alive via `IsDead`.

**Tags checked:**
- `"notarget"` — used to skip invalid targets (e.g., non-solid or invulnerable entities).
- `"playerghost"` — excluded as valid facing/chase targets.
- `"idle"` — state tag used internally to trigger taunt animations.

**Tags added:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_shouldchase` | `boolean` | `false` | Internal cache indicating whether the entity should currently be in chase mode. Used to prevent rapid toggling due to fluctuating distance conditions. |

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree for the Shadow Rook, setting up prioritized tasks that govern chasing, facing, idle taunting, and despawn behavior.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None—assumes valid `Combat` and `Health` components are attached.

### `GetFaceTargetFn(inst)` (local)
* **Description:** Computes the preferred entity to face. Prioritizes the current combat target, otherwise falls back to the nearest player within `START_FACE_DIST` (8 units). Excludes entities with `"notarget"` tag.
* **Parameters:**
  - `inst`: The entity instance whose brain is requesting the target.
* **Returns:** `Entity` or `nil`.
* **Error states:** Returns `nil` if no target exists or the only candidates are excluded by tag or distance.

### `KeepFaceTargetFn(inst, target)` (local)
* **Description:** Determines whether to continue facing a given target, ensuring it remains alive, valid, and within proximity.
* **Parameters:**
  - `inst`: The entity instance.
  - `target`: The proposed target entity to keep facing.
* **Returns:** `boolean` — `true` if target is valid and within `KEEP_FACE_DIST` (15 units), `false` otherwise.
* **Error states:** Returns `false` if target lacks `Health` component, is dead, is a player ghost, has `"notarget"`, or is too far.

### `ShouldChase(self)` (local)
* **Description:** Evaluates whether the entity should enter chase mode. Updates the internal `_shouldchase` cache and returns the decision.
* **Parameters:**
  - `self`: The brain instance.
* **Returns:** `boolean` — `true` if either no target exists, combat is not in cooldown, or the target is outside adjusted attack range (`attackrange ± 2` depending on previous chase state).
* **Error states:** None—uses hysteresis (`±2`) to reduce oscillation near the attack range boundary.

## Events & listeners
- **Pushes:**
  - `"despawn"` — Fired via `self.inst:PushEvent("despawn")` after a delay (`TUNING.SHADOW_CHESSPIECE_DESPAWN_TIME`), triggered by the despawn subtree in the behavior tree.

- **Listens to:** None—this brain component does not directly register event listeners.

---