---
id: rabbitking_bunnymanbrain
title: Rabbitking Bunnymanbrain
description: Provides AI behavior for rabbit-related minions under the Rabbit King's command, implementing movement, aggression, fleeing, and burrowing logic via a behavior tree.
tags: [ai, brain, combat, movement, boss]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 97927569
---

# Rabbitking Bunnymanbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This brain component implements the artificial intelligence for rabbit minions (such as Bunnyman or Rabbit King's henchmen) in `Don't Starve Together`. It uses a behavior tree (`BT`) rooted in a `PriorityNode` to coordinate state-driven actions: fleeing when scared or on fire, avoiding electric fences, pursuing and attacking enemies, following the leader (if present), wandering when idle, and burrowing when leaderless. It relies heavily on external behavior modules and components like `follower`, `hauntable`, and `health` to adapt dynamically to game state.

The brain is part of the ECS-driven entity system and inherits from `Brain`, integrating with DST’s behavior tree system, event system, and common AI utilities via `BrainCommon`.

## Usage example

```lua
local inst = ... -- some entity instance
inst:AddBrain("rabbitking_bunnymanbrain")

-- Example: Trigger panic via hauntable component (handled automatically by behavior tree)
if inst.components.hauntable then
    inst.components.hauntable.panic = true
end

-- Example: Set leader for follow behavior
if inst.components.follower then
    inst.components.follower:SetLeader(some_leader_entity)
end
```

## Dependencies & tags

**Components used:**
- `follower` — to retrieve the leader entity via `GetLeader()` and determine follow distance logic.
- `hauntable` — checks the `panic` property to trigger panic behavior when haunted.
- `health` — checks `takingfiredamage` to trigger panic/fire behavior.

**Tags:** None identified.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this brain controls (inherited from `Brain` base class). |
| `bt` | `BT` | `nil` (initialized in `OnStart`) | Behavior tree instance constructed during `OnStart()`. |

*Note: No additional public properties are defined in the constructor; the class relies on inherited `Brain._ctor` and behavior node configuration.*

## Main functions

### `RabbitKing_BunnymanBrain:OnStart()`
* **Description:** Initializes and constructs the behavior tree for the entity. It builds a priority-based `PriorityNode` root containing sub-trees for panic (from haunting or fire), electric fence avoidance, chasing/attacking, following, and wandering/burrowing. The tree is assigned to `self.bt`.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None; assumes required components (`follower`, `hauntable`, `health`) are already added to `inst`. Fallback behavior (e.g., `GetLeader` returning `nil`) is handled gracefully.

## Events & listeners

- **Listens to:**
  - None (this component does not register event listeners directly).
- **Pushes:**
  - `burrowaway` — Fired on the entity when `GetLeader(self.inst) == nil` during the wandering phase (inside the `ActionNode`). Triggers a state or visual effect (e.g., burrowing away) when the entity loses its leader.

> *Note: Event processing is delegated to behavior nodes (e.g., `ChattyNode`, `Panic`) and the entity’s state graph; this brain does not register direct event handlers.*