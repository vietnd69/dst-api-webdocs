---
id: bunnymanbrain
title: Bunnymanbrain
description: AI controller that manages autonomous behavior for bunnyman entities, including combat, fleeing, foraging, home-seeking, and trading interactions.
tags: [ai, entity, combat, foraging, home]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 0eb14219
system_scope: brain
---

# Bunnymanbrain

> Based on game build **7140014** | Last updated: 2026-03-03

## Overview
`BunnymanBrain` is a behavior tree-based AI controller for bunnyman entities. It implements a priority-based decision system that handles fleeing (from threats, fire, acid rain, low health), pursuing and attacking targets (including scarers), seeking food, trading with players, following a leader, and returning to a home when appropriate. It relies heavily on common DST components like `health`, `combat`, `eater`, `homeseeker`, `follower`, and `trader`, and uses a prioritized behavior tree to coordinate actions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("bunnyman")
inst:AddComponent("health")
inst:AddComponent("combat")
inst:AddComponent("eater")
inst:AddComponent("homeseeker")
inst:AddComponent("follower")
inst:AddComponent("trader")
inst:AddComponent("hauntable")
inst:AddComponent("burnable")
-- ... (initialize home and leader if needed)
inst.brain = BunnymanBrain(inst)
inst.brain:OnStart()
```

## Dependencies & tags
**Components used:** `health`, `combat`, `eater`, `edible`, `equippable`, `follower`, `trader`, `hauntable`, `burnable`, `inventory`, `inventoryitem`, `homeseeker`, `playercontroller`.  
**Tags:** Checks `"manrabbitscarer"`, `"INLIMBO"`, `"outofreach"`, `"NOCLICK"`, `"burnt"`; adds no tags itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *assigned at construction* | Reference to the entity instance the brain controls. |
| `bt` | `BehaviorTree` | `nil` (set in `OnStart`) | The root behavior tree, initialized and assigned during `OnStart`. |

## Main functions
### `OnStart()`
* **Description:** Constructs and initializes the behavior tree using a priority-ordered sequence of conditionally activated nodes. It sets up a behavior tree that evaluates high-priority threats (panic triggers) first, then falls back to combat, trading, foraging, following, home-seeking, and wandering.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Requires that `inst.components` has all necessary components (`health`, `combat`, `eater`, `homeseeker`, `follower`, `trader`, `hauntable`, `burnable`, `inventory`, `inventoryitem`) attached before calling; otherwise node execution may fail.

## Events & listeners
* **Listens to:** None — this brain uses a reactive behavior tree evaluated each tick rather than event-driven scheduling.
* **Pushes:** None — the brain itself does not fire events, though its sub-behaviours (e.g., `Panic`, `RunAway`) may.
