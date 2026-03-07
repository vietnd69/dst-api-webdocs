---
id: braincommon
title: Braincommon
description: Provides shared AI behavior utilities for followers and non-player entities, including panic triggers, saltlick navigation, and leader-assisted actions.
tags: [ai, brain, follower, panic]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 7dfe398d
system_scope: brain
---

# Braincommon

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Braincommon` is a shared utility module that defines reusable AI behavior patterns for entities, particularly followers. It centralizes logic for panic responses (e.g., from fire, lunar burn, electricity, or scaring events), navigation near saltlicks, and leader-assisted actions such as mining, chopping, and item pickup/giving. This module does not instantiate or manage a component directly; instead, it exports functions to be used by brain definitions (e.g., in `brains/*.lua` files).

It interacts with multiple components including `health`, `hauntable`, `combat`, `follower`, `inventory`, `timer`, `burnable`, and `trap` to evaluate state and construct behavior nodes.

## Usage example
```lua
local BrainCommon = require "brains/braincommon"

-- Use panic triggers in a brain definition
local brain = {
    { 
        BrainCommon.PanicTrigger,
        BrainCommon.ElectricFencePanicTrigger,
        BrainCommon.PanicTriggerShadowCreature,
    },
    -- Use leader-assist mining with custom chatter
    BrainCommon.NodeAssistLeaderDoAction(self, {
        action = "MINE",
        chatterstring = "chatter_mine",
    }),
    -- Attach to saltlick when time is low
    BrainCommon.AnchorToSaltlick(inst),
}
```

## Dependencies & tags
**Components used:** `health`, `hauntable`, `combat`, `follower`, `inventory`, `timer`, `burnable`, `trap`, `leader` (via `follower`), `trader`  
**Tags:** Uses `saltlick`, `INLIMBO`, `fire`, `burnt`, `MINE_workable`, `CHOP_workable`, `carnivalgame_part`, `event_trigger`, `waxedplant`, `player`  
**Debuffs:** Checks for `"ipecacsyrup_buff"`

## Properties
No public properties are initialized or stored in this module.

## Main functions
### `BrainCommon.ShouldSeekSalt(inst)`
* **Description:** Returns `true` if the entity is near the end of its saltlick timer (within `TIME_TO_SEEK_SALT = 16` seconds) and has a valid saltlick reference.
* **Parameters:** `inst` (entity instance) — entity whose timer and saltlick are checked.
* **Returns:** `boolean` — whether the entity should seek a saltlick.
* **Error states:** Returns `false` if `inst._brainsaltlick` is `nil`, invalid, or timer component is missing.

### `BrainCommon.AnchorToSaltlick(inst)`
* **Description:** Returns a behavior node tree that causes the entity to stay near a saltlick when low on salt, using a dynamic wander radius that shrinks as salt runs out.
* **Parameters:** `inst` (entity instance) — the entity to anchor.
* **Returns:** Behavior node (`WhileNode` containing `Wander`) — to be used in a brain or task sequence.
* **Error states:** Cleans up the saltlick reference and event listener on node stop.

### `BrainCommon.ShouldTriggerPanic(inst)`
* **Description:** Returns `true` if the entity should enter panic due to fire, lunar burn, or `hauntable.panic` state.
* **Parameters:** `inst` (entity instance) — the entity whose health and hauntable states are checked.
* **Returns:** `boolean` — whether panic should be triggered.
* **Error states:** Safely handles missing `health` or `hauntable` components.

### `BrainCommon.PanicTrigger(inst)`
* **Description:** Returns a `WhileNode` that activates `Panic(inst)` behavior when `ShouldTriggerPanic(inst)` becomes `true`.
* **Parameters:** `inst` (entity instance).
* **Returns:** Behavior node (`WhileNode` containing `Panic`).
* **Error states:** None.

### `BrainCommon.ShouldAvoidElectricFence(inst)`
* **Description:** Returns `true` if the entity has `panic_electric_field` set (e.g., due to nearby electric fence).
* **Parameters:** `inst` (entity instance).
* **Returns:** `boolean`.
* **Error states:** Assumes `inst.panic_electric_field` is a boolean flag.

### `BrainCommon.ElectricFencePanicTrigger(inst)`
* **Description:** Returns a behavior node that triggers `AvoidElectricFence` while `ShouldAvoidElectricFence(inst)` is `true`.
* **Parameters:** `inst` (entity instance).
* **Returns:** Behavior node (`WhileNode` containing `AvoidElectricFence`).
* **Error states:** Relies on `AvoidElectricFence` setting `inst._has_electric_fence_panic_trigger`.

### `BrainCommon.HasElectricFencePanicTriggerNode(inst)`
* **Description:** Returns whether the entity currently has an active electric fence panic trigger node (used for coordination).
* **Parameters:** `inst` (entity instance).
* **Returns:** `boolean`.

### `BrainCommon.ShouldTriggerPanicShadowCreature(inst)`
* **Description:** Returns `true` if a shadow creature panic task has been scheduled (via modded or event systems like `hermitcrabtea_moon_tree_blossom_buff`).
* **Parameters:** `inst` (entity instance).
* **Returns:** `boolean`.

### `BrainCommon.PanicTriggerShadowCreature(inst)`
* **Description:** Returns a behavior node that activates `Panic(inst)` while shadow creature panic is active.
* **Parameters:** `inst` (entity instance).
* **Returns:** Behavior node (`WhileNode` containing `Panic`).

### `BrainCommon.PanicWhenScared(inst, loseloyaltychance, chatty)`
* **Description:** Returns a behavior node that triggers panic in response to `"epicscare"` events. Optionally drops loyalty (via `loseloyaltychance`) and/or adds chatty dialogue.
* **Parameters:**  
  - `inst` (entity instance)  
  - `loseloyaltychance` (number? — probability [0–1] to lose follower loyalty on panic; default `nil` skips loyalty logic)  
  - `chatty` (string? — chatter name to use; default `nil` disables chatty)  
* **Returns:** Behavior node (`WhileNode` containing `Panic`, plus optional loyalty-degradation logic).
* **Error states:** Cancels active `combat.target` during panic; cleans up `"epicscare"` listener on node stop.

### `BrainCommon.IsUnderIpecacsyrupEffect(inst)`
* **Description:** Returns `true` if the entity is affected by the `"ipecacsyrup_buff"` debuff.
* **Parameters:** `inst` (entity instance).
* **Returns:** `boolean`.

### `BrainCommon.IpecacsyrupPanicTrigger(inst)`
* **Description:** Returns a behavior node that triggers panic while the entity is under the ipecac syrup effect.
* **Parameters:** `inst` (entity instance).
* **Returns:** Behavior node (`WhileNode` containing `Panic`).

### `BrainCommon.NodeAssistLeaderDoAction(self, parameters)`
* **Description:** Returns a behavior node that enables an entity (follower) to assist its leader in performing `MINE` or `CHOP` actions. Supports optional chatter, custom condition overrides, and fallback to leader-targeted workables.
* **Parameters:**  
  - `self` — caller context (typically `self` in a brain function)  
  - `parameters` (table) —  
    - `action` (string `"MINE"` or `"CHOP"`) — required  
    - `starter`/`keepgoing`/`finder` (function?) — optional overrides  
    - `chatterstring` (string?) — optional chatter tag  
    - `shouldrun` (function?) — optional guard  
* **Returns:** Behavior node (`IfThenDoWhileNode` containing `LoopNode` with `DoAction`).
* **Error states:** Defaults to using `AssistLeaderDefaults[action]` if not overridden.

### `BrainCommon.NodeAssistLeaderPickUps(self, parameters)`
* **Description:** Returns a behavior node that enables a follower to pick up items for a player leader and give/drop them appropriately based on inventory state and distance.
* **Parameters:**  
  - `self` — caller context  
  - `parameters` (table) — includes:  
    - `cond`, `range`, `range_local`, `give_cond`, `give_range`, `furthestfirst`, `positionoverride`, `ignorethese`, `wholestacks`, `allowpickables`, `custom_pickup_filter`  
* **Returns:** Behavior node (`PriorityNode` with `WhileNode`s for `PickUp`, then `GiveAction`/`DropAction`).
* **Error states:** Drops active item first; skips if leader missing `trader`, inventory not opened, or leader not a `player`.

## Events & listeners
- **Listens to:**  
  - `"saltlick_placed"` — resets cached `_brainsaltlick` and updates saltlick reference  
  - `"epicscare"` — extends panic duration and clears combat target  
- **Pushes:**  
  - `"leaderchanged"` — via `follower:SetLeader(nil)` during panic  
  - `"dropitem"` — via `inventory:DropItem()`  
  - Internal event callbacks are cleaned up on node stop in `AnchorToSaltlick` and `PanicWhenScared`.
