---
id: shadowcreaturebrain
title: Shadowcreaturebrain
description: Implements the AI behavior for shadow creatures, including target tracking, harassment mechanics, and conditional chasing or loitering based on combat state and locomotion speed.
tags: [ai, combat, boss, shadow, navigation]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: a79a8657
---

# Shadowcreaturebrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `ShadowCreatureBrain` component defines the behavior tree for shadow creatures (e.g., Abigail's shadow minions or similar entities). It manages high-level AI logic such as selecting and tracking a primary target, initiating harassment behaviors (including battle cries and loitering while facing the target), and falling back to wandering or following when harassment is not applicable. It integrates with the `Combat`, `Locomotor`, and `ShadowSubmissive` components to dynamically adapt behavior based on the target's dominance status, walk speed, and proximity.

Key responsibilities include:
- Maintaining a master target (`mytarget`) and a harassment target (`_harasstarget`).
- Initiating "ChaseAndHarass" sequences when the creature's walk speed is below 5 or it is too far from the harassment target.
- Triggering `BattleCry()` and event-driven taunt animation alignment during harassment.
- Reacting to the target being on land vs. sea, with teleportation if applicable.

## Usage example

```lua
local inst = Entity()

-- Attach required components before adding the brain
inst:AddComponent("combat")
inst:AddComponent("locomotor")
inst:AddComponent("shadowsubmissive")

-- Initialize and attach the brain
inst:AddBrain("ShadowCreatureBrain")
```

Note: This component is typically added via `inst:AddBrain("ShadowCreatureBrain")` in the prefab definition. The constructor does not require manual invocation.

## Dependencies & tags

**Components used:**
- `combat` (accesses `target`, `nextbattlecrytime`, and `BattleCry()`)
- `locomotor` (accesses `walkspeed`)
- `shadowsubmissive` (accesses `ShouldSubmitToTarget(target)`)

**Tags:** None identified.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `mytarget` | `Entity?` | `nil` | Primary target (e.g., spawn-originating player); tracked via `"onremove"` event callback. |
| `_harasstarget` | `Entity?` | `nil` | Secondary target used during harassment (set when `ShouldSubmitToTarget` returns `true` on `combat.target`). |
| `listenerfunc` | `function?` | `nil` | Callback used to clear `mytarget` when the target entity is removed. Initialized on first target assignment. |

## Main functions

### `SetTarget(target)`
* **Description:** Sets the primary target (`mytarget`) and manages event listeners for target removal. If the new target is invalid, `mytarget` is set to `nil`. If the target changes, any previous `"onremove"` listener is unregistered and a new one registered.
* **Parameters:**
  - `target` (`Entity?`): The entity to assign as the primary target. May be `nil`.
* **Returns:** None.
* **Error states:** No explicit error conditions; silently invalidates stale entities.

### `OnStart()`
* **Description:** Initializes and starts the behavior tree. Sets `mytarget` to `inst.spawnedforplayer`, then constructs a priority-based behavior tree with nodes for panic, land/sea teleportation, attack, harassment, loiter, follow, and wander. The tree is stored in `self.bt`.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** Assumes all dependencies (`combat`, `locomotor`, `shadowsubmissive`) are present; missing components may result in runtime errors when the tree executes.

### `OnStop()`
* **Description:** Clears the primary target (`mytarget`) and associated event listener, effectively resetting the brain's target state.
* **Parameters:** None.
* **Returns:** None.

## Events & listeners

- **Listens to:**
  - `"onremove"` on `mytarget`: Fires `listenerfunc` (defined in `SetTarget`) to clear `mytarget` when the primary target is removed.
- **Pushes:**
  - `"teleport_to_sea"`: Triggered by the behavior tree when the current target is on land and the entity is following it (`inst.followtosea`), initiating teleport logic.