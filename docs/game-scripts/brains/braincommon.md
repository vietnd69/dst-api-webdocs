---
id: braincommon
title: Braincommon
description: Provides shared utility functions and behavior nodes for entity AI brains, including saltlick seeking, panic triggers, leader-assisted actions, and inventory pickup/give/drop logic.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 7dfe398d
---

# Braincommon

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

`Braincommon.lua` is a utility module that exports reusable AI behavior functions and node factories for use in entity brains. It centralizes common decision-making patterns such as saltlick seeking, panic triggers (for fire, lunar burn, hauntable, electric fence, shadow creature, and ipecac syrup effects), leader assistance (MINE/CHOP actions), and inventory management (pickup, give, drop). This component does not attach directly to entities but serves as a library for brain stategraph implementations.

## Dependencies & Tags

- **Components used:** `burnable` (`IsBurning`), `combat` (`SetTarget`), `follower` (`GetLeader`, `GetLoyaltyPercent`, `SetLeader`), `hauntable` (`panic` property), `health` (`takingfiredamage`, `GetLunarBurnFlags`), `inventory` (`DropItem`, `GetActiveItem`, `GetFirstItemInAnySlot`, `IsFull`, `IsOpenedBy`), `stackable` (`IsFull`), `timer` (`GetTimeLeft`), `trap`.
- **Tags checked:** `"saltlick"`, `"INLIMBO"`, `"fire"`, `"burnt"`, `"MINE_workable"`, `"CHOP_workable"`, `"carnivalgame_part"`, `"event_trigger"`, `"waxedplant"`, `"player"`.
- **Tags added/removed:** None.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ShouldSeekSalt` | `function` | (undefined) | Returns `true` if `timer` exists and `"salt"` timer has less than 16 seconds remaining. |
| `AnchorToSaltlick` | `function` | (undefined) | Returns a `WhileNode`-wrapped `Wander` behavior that stays near a saltlick until the timer expires or the saltlick becomes invalid. Handles cleanup of saltlick listeners and state. |
| `ShouldTriggerPanic` | `function` | (undefined) | Returns `true` if the entity is taking fire damage, experiencing lunar burn, or has `hauntable.panic` set. |
| `PanicTrigger` | `function` | (undefined) | Returns a `WhileNode` that triggers `Panic` behavior when `ShouldTriggerPanic(inst)` is true. |
| `ShouldAvoidElectricFence` | `function` | (undefined) | Returns `true` if `inst.panic_electric_field` is set. |
| `ElectricFencePanicTrigger` | `function` | (undefined) | Returns a `WhileNode` that triggers `AvoidElectricFence` behavior when electric fence panic condition is active. |
| `HasElectricFencePanicTriggerNode` | `function` | (undefined) | Returns `inst._has_electric_fence_panic_trigger`, set internally by `AvoidElectricFence`. |
| `ShouldTriggerPanicShadowCreature` | `function` | (undefined) | Returns `true` if `inst._shadow_creature_panic_task` is not `nil`. |
| `PanicTriggerShadowCreature` | `function` | (undefined) | Returns a `WhileNode` that triggers `Panic` behavior for shadow creature panic events. |
| `PanicWhenScared` | `function` | (undefined) | Returns a panic node that activates on `"epicscare"` events, optionally reduces loyalty, and clears combat target during panic. |
| `IsUnderIpecacsyrupEffect` | `function` | (undefined) | Returns `true` if entity has debuff `"ipecacsyrup_buff"`. |
| `IpecacsyrupPanicTrigger` | `function` | (undefined) | Returns a `WhileNode` that triggers `Panic` while under ipecac syrup effect. |
| `AssistLeaderDefaults` | `table` | `{ MINE = ..., CHOP = ... }` | Public table of default behavior functions for `NodeAssistLeaderDoAction`. Exposed for mod support customization. |
| `NodeAssistLeaderDoAction` | `function` | (undefined) | Returns a behavior node that lets followers assist leader's mining or chopping tasks. |
| `NodeAssistLeaderPickUps` | `function` | (undefined) | Returns a behavior node that helps leader by picking up items, giving/dropping to leader when inventory is full. |

## Main Functions

### `FindSaltlick(inst)`
* **Description:** Finds and caches the nearest valid saltlick within `TUNING.SALTLICK_CHECK_DIST`. Ensures the saltlick is not burning, burnt, or in limbo. Registers a one-time listener for `"saltlick_placed"` if a saltlick is newly found.
* **Parameters:**  
  `inst`: The entity instance.
* **Returns:** `true` if a valid saltlick is found; `false` otherwise.

### `WanderFromSaltlickDistFn(inst)`
* **Description:** Calculates a dynamic wander radius for saltlick-seeking behavior. Reduces the radius as the `"salt"` timer approaches `TIME_TO_SEEK_SALT` (16s), encouraging closer approach near expiry.
* **Parameters:**  
  `inst`: The entity instance.
* **Returns:** `number`: A distance value between `TUNING.SALTLICK_USE_DIST * 0.75` and `TUNING.SALTLICK_CHECK_DIST * 0.75`, or `TUNING.SALTLICK_CHECK_DIST * 0.75` if no timer.

### `ShouldSeekSalt(inst)`
* **Description:** Determines if the entity should seek a saltlick based on remaining `"salt"` timer.
* **Parameters:**  
  `inst`: The entity instance.
* **Returns:** `true` if a saltlick exists and timer has less than 16 seconds remaining.

### `AnchorToSaltlick(inst)`
* **Description:** Returns a behavior node that makes the entity stay near a saltlick until the `"salt"` timer expires. Wraps `Wander` behavior inside a `WhileNode` that checks `FindSaltlick`. Cleans up saltlick listener and internal state (`inst._brainsaltlick`) when stopped.
* **Parameters:**  
  `inst`: The entity instance.
* **Returns:** `node`: A `WhileNode`-based behavior tree node.

### `ShouldTriggerPanic(inst)`
* **Description:** Evaluates conditions that should trigger panic behavior: fire damage, lunar burn, or hauntable panic flag.
* **Parameters:**  
  `inst`: The entity instance.
* **Returns:** `true` if any panic condition is active.

### `PanicTrigger(inst)`
* **Description:** Creates a `WhileNode` that executes `Panic(inst)` while `ShouldTriggerPanic(inst)` is true.
* **Parameters:**  
  `inst`: The entity instance.
* **Returns:** `node`: A behavior tree node.

### `ShouldAvoidElectricFence(inst)`
* **Description:** Checks if the entity should trigger electric fence avoidance panic (e.g., due to proximity).
* **Parameters:**  
  `inst`: The entity instance.
* **Returns:** `true` if `inst.panic_electric_field` is set.

### `ElectricFencePanicTrigger(inst)`
* **Description:** Creates a `WhileNode` that executes `AvoidElectricFence(inst)` while electric fence panic condition is active.
* **Parameters:**  
  `inst`: The entity instance.
* **Returns:** `node`: A behavior tree node.

### `HasElectricFencePanicTriggerNode(inst)`
* **Description:** Reports whether the entity has an active electric fence panic trigger node set by `AvoidElectricFence`.
* **Parameters:**  
  `inst`: The entity instance.
* **Returns:** `boolean`: Value of `inst._has_electric_fence_panic_trigger`.

### `ShouldTriggerPanicShadowCreature(inst)`
* **Description:** Checks if the entity is experiencing panic due to a shadow creature event (based on presence of `_shadow_creature_panic_task`).
* **Parameters:**  
  `inst`: The entity instance.
* **Returns:** `boolean`.

### `PanicTriggerShadowCreature(inst)`
* **Description:** Returns a `WhileNode` that triggers `Panic` behavior while shadow creature panic is active.
* **Parameters:**  
  `inst`: The entity instance.
* **Returns:** `node`.

### `PanicWhenScared(inst, loseloyaltychance, chatty)`
* **Description:** Creates a panic node that activates on `"epicscare"` events. Optionally reduces follower loyalty (with probability `loseloyaltychance`) and supports chatter. Clears combat target during panic. Removes event listener and cleans up state on stop.
* **Parameters:**  
  `inst`: The entity instance.  
  `loseloyaltychance`: `number` or `nil`: Chance to lose a follower on panic (0–1).  
  `chatty`: `string` or `nil`: Chatter string to use with `ChattyNode`.
* **Returns:** `node`.

### `IsUnderIpecacsyrupEffect(inst)`
* **Description:** Checks if the entity is affected by ipecac syrup (has debuff `"ipecacsyrup_buff"`).
* **Parameters:**  
  `inst`: The entity instance.
* **Returns:** `boolean`.

### `IpecacsyrupPanicTrigger(inst)`
* **Description:** Returns a `WhileNode` that triggers `Panic` behavior while the entity is under ipecac syrup effect.
* **Parameters:**  
  `inst`: The entity instance.
* **Returns:** `node`.

### `NodeAssistLeaderDoAction(self, parameters)`
* **Description:** Generates a behavior tree node for followers to assist their leader in performing actions (e.g., MINE, CHOP). Uses configurable `Starter`, `KeepGoing`, and `FindNew` functions (defaults provided in `AssistLeaderDefaults`). Supports chatter and optional condition overrides.  
* **Parameters:**  
  `self`: The current behavior context (`self.inst` is used).  
  `parameters`: A table with keys:  
    - `action`: `"MINE"` or `"CHOP"`  
    - `starter`, `keepgoing`, `finder`: Optional override functions  
    - `chatterstring`: Optional chatter string  
    - `shouldrun`: Optional custom condition  
    - `keepgoing_leaderdist`: Distance threshold to stay near leader (default `TUNING.FOLLOWER_HELP_LEADERDIST`)  
    - `finder_finddist`: Search radius for new targets (default `TUNING.FOLLOWER_HELP_FINDDIST`)  
* **Returns:** `node`: An `IfThenDoWhileNode` wrapping a `LoopNode` of the action.

### `NodeAssistLeaderPickUps(self, parameters)`
* **Description:** Generates a priority behavior node for followers to pick up items from leader’s inventory radius, give them to the leader if possible, or drop them if the follower’s inventory is full. Designed for items the leader is managing (e.g., loot, supplies).  
* **Parameters:**  
  `self`: Behavior context (`self.inst` used).  
  `parameters`: A table with keys (optional unless specified):  
    - `cond`: `function` returning `boolean` — run condition for pickup loop (default: `AlwaysTrue`)  
    - `range`: `number` — search radius for pickup items (leader’s position)  
    - `range_local`: `number` — local search radius around follower  
    - `give_cond`: `function` or `nil` — additional condition for giving items  
    - `give_range`: `number` — max distance to leader for giving/dropping (optional)  
    - `furthestfirst`: `boolean` — prioritize furthest items  
    - `positionoverride`: `function` or `Vector` — override position for pickup/give  
    - `ignorethese`: `table` — tracked ignored items (to avoid race conditions)  
    - `wholestacks`: `boolean` — only pickup items if inventory has space for full stack  
    - `allowpickables`: `boolean` — allow picking up pickable items  
    - `custom_pickup_filter`: `function` — custom filter for pickupable items  
* **Returns:** `node`: A `PriorityNode` that prioritizes giving items to leader over dropping, within a `WhileNode` loop.

## Events & Listeners

- **Listens to:** `"saltlick_placed"`, `"epicscare"`.
- **Pushes:** `inst:PushEvent("leaderchanged", { new = new_leader, old = prev_leader })` — triggered internally by `Follower:SetLeader` when leader changes during panic (see `Follower.lua` usage).

> Note: Event listeners in `Braincommon.lua` are registered per-instance within functions like `AnchorToSaltlick` and `PanicWhenScared`, not globally in the module’s constructor.