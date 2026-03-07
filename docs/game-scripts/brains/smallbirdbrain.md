---
id: smallbirdbrain
title: Smallbirdbrain
description: Controls the AI behavior of small birds, prioritizing survival (starvation, food), following leaders, evading players when not companions, and engaging in combat when necessary.
tags: [ai, brain, smallbird, follower, combat]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 36dcdc3b
---

# Smallbirdbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `SmallBirdBrain` component implements the decision-making logic for small bird entities in Don't Starve Together. It uses a behavior tree to prioritize actions based on hunger, leader presence, combat status, and proximity to players. The brain integrates with several components — `hunger`, `follower`, `combat`, `eater`, and `trader` — to dynamically select appropriate actions such as wandering, following a leader, fleeing players, seeking food, or attacking targets. This brain is part of the Entity Component System (ECS), attached via `inst:AddComponent("brain")` and used exclusively during entity runtime to drive AI behavior.

## Usage example

```lua
local inst = Entity(entityid)
inst:AddComponent("hunger")
inst:AddComponent("follower")
inst:AddComponent("combat")
inst:AddComponent("eater")
inst:AddComponent("trader")
inst:AddTag("teenbird")
inst:AddTag("companion")
inst:AddBrain("smallbirdbrain")
```

## Dependencies & tags
**Components used:** `combat`, `eater`, `follower`, `hunger`, `trader`

**Tags:** `teenbird`, `companion`, `INLIMBO`, `outofreach`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (passed to constructor) | Reference to the entity instance the brain controls |
| `bt` | `BT` | `nil` (initialized in `OnStart`) | Behavior tree instance used for decision making |

## Main functions

### `SmallBirdBrain:OnStart()`
* **Description:** Initializes the behavior tree with a priority-ordered list of tasks. This is the entry point for AI behavior setup and is called once when the brain is first activated.
* **Parameters:** None
* **Returns:** `nil`
* **Error states:** None documented; relies on valid component presence and tags.

### Helper Functions (Internal)

#### `GetLeader(inst)`
* **Description:** Retrieves the leader of the entity if `follower` component exists.
* **Parameters:** `inst` (`Entity`) — the entity to inspect.
* **Returns:** `Entity?` — the leader entity, or `nil`.
* **Error states:** Returns `nil` if `follower` component is missing or no leader is set.

#### `IsHungry(inst)`
* **Description:** Checks if the entity’s hunger level is below `FIND_FOOD_HUNGER_PERCENT`.
* **Parameters:** `inst` (`Entity`) — the entity to inspect.
* **Returns:** `boolean` — `true` if hunger percent < `0.75`, otherwise `false`.
* **Error states:** Returns `false` if `hunger` component is missing.

#### `IsStarving(inst)`
* **Description:** Checks if the entity is currently starving (`hunger <= 0`).
* **Parameters:** `inst` (`Entity`) — the entity to inspect.
* **Returns:** `boolean` — `true` if `hunger:IsStarving()` returns `true`, otherwise `false`.
* **Error states:** Returns `false` if `hunger` component is missing.

#### `ShouldStandStill(inst)`
* **Description:** Determines if the entity should remain stationary, e.g., when starving and not a teenbird or not accompanied by a tallbird leader.
* **Parameters:** `inst` (`Entity`) — the entity to inspect.
* **Returns:** `boolean` — `true` if starvation and no `teenbird` tag, or leader is not a tallbird; otherwise `false`.
* **Error states:** Returns `false` if `hunger` component is missing.

#### `CanSeeFood(inst)`
* **Description:** Searches within `SEE_FOOD_DIST` for an edible item on valid ground, using `eater:CanEat` and `Item:IsOnValidGround`.
* **Parameters:** `inst` (`Entity`) — the entity performing the search.
* **Returns:** `Entity?` — the first edible item found, or `nil`.
* **Error states:** Returns `nil` if no matching item exists, or if `eater` component is missing.

#### `FindFoodAction(inst)`
* **Description:** Returns a `BufferedAction` to eat a visible food item if available.
* **Parameters:** `inst` (`Entity`) — the entity initiating the action.
* **Returns:** `BufferedAction?` — action to eat the target, or `nil` if no food is visible.
* **Error states:** Returns `nil` if `CanSeeFood(inst)` returns `nil`.

#### `GetTraderFn(inst)`
* **Description:** Determines if the entity or its leader is currently being offered a trade.
* **Parameters:** `inst` (`Entity`) — the entity to inspect.
* **Returns:** `Entity?` — the leader if trading is in progress and entity has `companion` tag; otherwise `nil`.
* **Error states:** Returns `nil` if no leader, no `trader` component, or no trade action initiated.

#### `KeepTraderFn(inst, target)`
* **Description:** Verifies if `target` is actively trying to trade with `inst`.
* **Parameters:** 
  * `inst` (`Entity`) — the entity being traded with.
  * `target` (`Entity`) — the proposed trading partner.
* **Returns:** `boolean` — `true` if `trader:IsTryingToTradeWithMe(target)` returns `true`.
* **Error states:** Returns `false` if `trader` component is missing.

#### `ShouldRunAwayFromPlayer(inst, player)`
* **Description:** Decides if the entity should flee from a given player.
* **Parameters:** 
  * `inst` (`Entity`) — the entity being evaluated.
  * `player` (`Entity`) — the player entity.
* **Returns:** `boolean` — `true` if entity has no leader and lacks `companion` tag; otherwise `false`.
* **Error states:** None documented.

## Events & listeners
None. The component does not register or fire any events directly. Behavior updates are driven by the behavior tree evaluation loop.