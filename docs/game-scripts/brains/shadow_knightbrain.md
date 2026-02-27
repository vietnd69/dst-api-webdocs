---
id: shadow_knightbrain
title: Shadow Knightbrain
description: Controls the AI behavior of the Shadow Knight boss entity, managing attack timing, dodge actions, face-target logic, and eventual despawn via a behavior tree.
tags: [ai, boss, combat, behavior-tree]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 06723aa5
---

# Shadow Knightbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This brain component implements the AI logic for the Shadow Knight boss entity using a behavior tree (`BT`). It orchestrates priority-based actions including attacking when not in cooldown, fleeing/dodging when targeted, facing the nearest player, wandering, and automatically triggering a `despawn` event after a fixed time. The brain relies on the `Combat` component to determine whether a valid target exists and whether an attack is in cooldown, and on the `Health` component to validate target state (e.g., not dead, not a ghost). It integrates with several behavior modules: `ChaseAndAttack`, `RunAway`, `FaceEntity`, `Wander`, and custom utility functions.

## Usage example

```lua
inst:AddBrain("shadow_knightbrain")
inst:ListenForEvent("despawn", function() ... end)
```

## Dependencies & tags

**Components used:**
- `Combat`: accessed via `inst.components.combat` to check for `HasTarget()` and `InCooldown()`
- `Health`: accessed via `target.components.health` to check `IsDead()`, and via `inst.components.health` (indirectly via target)

**Tags:**
- `notarget`: checked on candidate targets to exclude them from targeting
- `playerghost`: checked on candidate targets to exclude ghost players
- `despawn`: pushed as an event by this component after TUNING.SHADOW_CHESSPIECE_DESPAWN_TIME

## Properties

No public properties are initialized in the constructor. The component stores only the behavior tree root internally as `self.bt`.

## Main functions

### `OnStart()`
* **Description:** Initializes the behavior tree root for the Shadow Knight. It constructs a prioritized sequence of behaviors: (1) Attack when no target is present or cooldown has ended, (2) Dodge/run away when a target is active, (3) Face the nearest valid player, and (4) Concurrently wander and schedule a `despawn` event after a fixed time. Called automatically when the brain is attached and started.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** None documented. Assumes `inst.components.combat` and `inst.components.health` exist on the entity.

## Events & listeners

- **Listens to:** None directly — event listeners are managed internally by behavior modules (e.g., `ChaseAndAttack`, `RunAway`).
- **Pushes:**
  - `despawn`: Fired on `self.inst` after `TUNING.SHADOW_CHESSPIECE_DESPAWN_TIME` seconds, via the behavior tree. No data payload.

---