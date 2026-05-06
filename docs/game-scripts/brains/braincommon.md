---
id: braincommon
title: Braincommon
description: Provides shared utility functions and behavior tree nodes for AI brain construction.
tags: [ai, brain, utility, behavior]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: brains
source_hash: 4fb4608a
system_scope: brain
---

# Braincommon

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`Braincommon` is a utility module that exports reusable behavior tree nodes and helper functions for constructing AI brains. It provides common patterns for panic behaviors, saltlick seeking, leader assistance actions, item pickup workflows, and chassis possession logic. This module is required by individual brain files to compose complex AI behaviors without duplicating code.

## Usage example
```lua
local BrainCommon = require("brains/braincommon")

-- Create panic trigger node for fire/lunar burn
local panicNode = BrainCommon.PanicTrigger(inst)

-- Create saltlick anchoring behavior
local saltNode = BrainCommon.AnchorToSaltlick(inst)

-- Within a brain file where `self` is the brain instance (has self.inst):
-- Create leader assistance node for chopping trees
local assistNode = BrainCommon.NodeAssistLeaderDoAction(self, {
    action = "CHOP",
    chatterstring = "chopping",
})

-- Create item pickup and delivery node
local pickupNode = BrainCommon.NodeAssistLeaderPickUps(self, {
    range = 10,
    give_range = 5,
})
```

## Dependencies & tags
**External dependencies:**
- `behaviours/wander` -- wander behavior node factory
- `behaviours/panic` -- panic behavior node factory
- `behaviours/avoidelectricfence` -- electric fence avoidance behavior

**Components used:**
- `burnable` -- checks `IsBurning()` for saltlick validity
- `combat` -- calls `SetTarget(nil)` when scared
- `follower` -- calls `GetLeader()`, `GetLoyaltyPercent()`, `SetLeader()`
- `hauntable` -- checks `panic` property for panic trigger
- `health` -- checks `takingfiredamage` and `GetLunarBurnFlags()`
- `inventory` -- calls `DropItem()`, `GetActiveItem()`, `GetEquippedItem()`, `GetFirstItemInAnySlot()`, `IsFull()`, `IsOpenedBy()`
- `linkeditem` -- calls `GetOwnerInst()` for chassis validation
- `stackable` -- calls `IsFull()` for stack checks
- `timer` -- calls `GetTimeLeft()` for salt timer
- `trader` -- checks presence for give actions
- `trap` -- checks presence for check trap actions
- `workable` -- calls `GetWorkAction()` for dig validation

**Tags:**
- `saltlick` -- checked for saltlick entities
- `INLIMBO` -- excluded from saltlick search
- `fire` -- excluded from saltlick search
- `burnt` -- excluded from saltlick search
- `player` -- checked for leader validation
- `possessable_chassis` -- checked for possession targets
- `NOCLICK` -- excluded from chassis search
- `MINE_workable` -- searched for mine targets
- `CHOP_workable` -- searched for chop targets
- State tags: `hiding`, `mining`, `chopping`, `spinning`, `digging`, `tilling`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `BrainCommon` | table | --- | Top-level module table containing all exported functions and data. |
| `AssistLeaderDefaults` | table | --- | Default configuration for leader assistance actions. Contains nested tables for each action type (`MINE`, `CHOP`, `DIG`, `TILL`), each with `Starter`, `KeepGoing`, and `FindNew` function fields. |

## Main functions
### `ShouldSeekSalt(inst)`
* **Description:** Checks if the entity should seek a saltlick based on timer state. Returns true if saltlick exists and timer is below threshold.
* **Parameters:** `inst` -- entity instance to check
* **Returns:** boolean -- true if should seek salt, false otherwise
* **Error states:** None

### `AnchorToSaltlick(inst)`
* **Description:** Creates a behavior node that keeps the entity wandering near a saltlick. Automatically cleans up event listeners on node stop.
* **Parameters:** `inst` -- entity instance
* **Returns:** Behavior tree node (WhileNode with Wander)
* **Error states:** None

### `ShouldTriggerPanic(inst)`
* **Description:** Checks if panic conditions are met. Returns true if entity is taking fire damage, has lunar burn flags, or hauntable panic is active.
* **Parameters:** `inst` -- entity instance to check
* **Returns:** boolean -- true if panic should trigger
* **Error states:** None

### `PanicTrigger(inst)`
* **Description:** Creates a WhileNode that continuously triggers panic behavior while panic conditions are met.
* **Parameters:** `inst` -- entity instance
* **Returns:** Behavior tree node (WhileNode wrapping Panic)
* **Error states:** None

### `ShouldAvoidElectricFence(inst)`
* **Description:** Checks if entity should avoid electric fence based on panic_electric_field state.
* **Parameters:** `inst` -- entity instance
* **Returns:** boolean -- true if electric fence should be avoided
* **Error states:** None

### `ElectricFencePanicTrigger(inst)`
* **Description:** Creates a WhileNode that triggers electric fence avoidance behavior.
* **Parameters:** `inst` -- entity instance
* **Returns:** Behavior tree node (WhileNode wrapping AvoidElectricFence)
* **Error states:** None

### `HasElectricFencePanicTriggerNode(inst)`
* **Description:** Checks if entity has the electric fence panic trigger node flag set.
* **Parameters:** `inst` -- entity instance
* **Returns:** boolean -- value of `_has_electric_fence_panic_trigger`
* **Error states:** None

### `ShouldTriggerPanicShadowCreature(inst)`
* **Description:** Checks if shadow creature panic task is active.
* **Parameters:** `inst` -- entity instance
* **Returns:** boolean -- true if `_shadow_creature_panic_task` is set
* **Error states:** None

### `PanicTriggerShadowCreature(inst)`
* **Description:** Creates a WhileNode that triggers panic behavior for shadow creature events.
* **Parameters:** `inst` -- entity instance
* **Returns:** Behavior tree node (WhileNode wrapping Panic)
* **Error states:** None

### `PanicWhenScared(inst, loseloyaltychance, chatty)`
* **Description:** Creates a panic node triggered by `epicscare` events. Optionally includes loyalty loss chance and chatty behavior. Cleans up event listener on node stop.
* **Parameters:**
  - `inst` -- entity instance
  - `loseloyaltychance` -- number (0-1) chance to lose leader on panic, or nil
  - `chatty` -- string chatter key for chatty node, or nil
* **Returns:** Behavior tree node (WhileNode with Panic, optionally ParallelNode for loyalty loss)
* **Error states:** None

### `IsUnderIpecacsyrupEffect(inst)`
* **Description:** Checks if entity has the ipecac syrup debuff active.
* **Parameters:** `inst` -- entity instance
* **Returns:** boolean -- result of `HasDebuff("ipecacsyrup_buff")`
* **Error states:** None

### `IpecacsyrupPanicTrigger(inst)`
* **Description:** Creates a WhileNode that triggers panic behavior while under ipecac syrup effect.
* **Parameters:** `inst` -- entity instance
* **Returns:** Behavior tree node (WhileNode wrapping Panic)
* **Error states:** None

### `NodeAssistLeaderDoAction(self, parameters)`
* **Description:** Creates a behavior node for followers to assist their leader with work actions (MINE, CHOP, DIG, TILL). Uses defaults from `AssistLeaderDefaults` if parameters not provided.
* **Parameters:**
  - `self` -- brain instance (provides `self.inst`)
  - `parameters` -- table with optional overrides:
    - `action` -- string action type (MINE, CHOP, DIG, TILL)
    - `starter` -- function override for starter condition
    - `keepgoing` -- function override for keepgoing condition
    - `finder` -- function override for target finder
    - `keepgoing_leaderdist` -- distance for keepgoing check
    - `finder_finddist` -- distance for finding new targets
    - `chatterstring` -- string for chatty node, or nil
    - `shouldrun` -- function for action execution condition
* **Returns:** Behavior tree node (IfThenDoWhileNode with LoopNode)
* **Error states:** None

### `NodeAssistLeaderPickUps(self, parameters)`
* **Description:** Creates a behavior node for followers to pickup items and deliver them to their player leader. Handles pickup, give, and drop actions in priority order.
* **Parameters:**
  - `self` -- brain instance (provides `self.inst`)
  - `parameters` -- table with optional configuration:
    - `cond` -- function for overall condition check
    - `range` -- number pickup search range
    - `range_local` -- number local pickup range around leader
    - `give_cond` -- function for give condition
    - `give_range` -- number range for giving items
    - `furthestfirst` -- boolean to prioritize furthest items
    - `positionoverride` -- function or vector3 for position override
    - `ignorethese` -- table of items to ignore (with task tracking)
    - `wholestacks` -- boolean to only pickup full stacks
    - `allowpickables` -- boolean to allow pickable entities
    - `custom_pickup_filter` -- function for custom item filtering
* **Returns:** Behavior tree node (PriorityNode with WhileNodes for pickup and give/drop)
* **Error states:** None

### `PossessChassisNode(self, update_rate)`
* **Description:** Creates a behavior node for possessing a chassis entity. Searches for valid possessable chassis, leashes to it, and pushes possess event on success.
* **Parameters:**
  - `self` -- brain instance (provides `self.inst`)
  - `update_rate` -- number update rate for PriorityNode
* **Returns:** Behavior tree node (IfNode with PriorityNode containing Leash, ActionNode, FaceEntity)
* **Error states:** None

## Events & listeners
- **Listens to:** `saltlick_placed` -- updates cached saltlick reference when new saltlick is placed
- **Listens to:** `epicscare` -- extends scare duration for `PanicWhenScared` behavior
- **Pushes:** `possess_chassis` -- fired when chassis possession succeeds, includes `target` in event data