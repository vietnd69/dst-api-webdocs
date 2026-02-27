---
id: wobybigbrain
title: Wobybigbrain
description: Controls the decision-making behavior of Woby (Walter's Woby), including following, combat avoidance, assisting with CHOP/MINE tasks, and interacting with players and the player link UI.
tags: [ai, brain, boss, combat, helper]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 168c1d97
---

# Wobybigbrain

## Overview
`Wobybigbrain` is a behavior tree (`BT`) implementation that defines the decision logic for Woby, Walter's loyal companion entity. It orchestrates high-priority actions such as combat avoidance (including retreat and observation), assisting the owner with CHOP and MINE tasks (when the `walter_woby_taskaid` skill is activated), and responding to rider mounting or player interaction prompts. The brain extends the base `Brain` class and composes multiple behavior nodes—leveraging `WobyBrainCommon` and `BrainCommon` modules—to prioritize context-sensitive behaviors (e.g., task assistance over wandering) and dynamically adjust movement and facing logic.

The component relies on several helper functions to determine targets (e.g., owner, rider, interactive players), validate combat proximity, and select actions based on Woby's current state and the player link UI. It also integrates with the `follower`, `health`, `grouptargeter`, `walkableplatform`, and `skilltreeupdater` components for context-aware decision-making.

## Usage example

```lua
local WobyBigBrain = require("brains/wobybigbrain")
local inst = TheSim:FindEntity("woby", 1, { "woby" })
if inst ~= nil then
    inst:AddComponent("brain")
    inst.components.brain:SetBrain(WobyBigBrain(inst))
    -- The brain automatically initializes its behavior tree on first tick
end
```

## Dependencies & tags
**Components used:** `follower`, `health`, `grouptargeter`, `walkableplatform`, `skilltreeupdater`, `combat` (via `_avoidtargetfn` helper).  
**Tags checked/used internally:** `_combat`, `_health`, `wall`, `INLIMBO` (for combat avoidance entity filtering).  
**No tags are explicitly added/removed by this component.**

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_hasavoidcombattarget` | function | `HasAvoidCombatTarget` | A stored reference to the `HasAvoidCombatTarget` function; used within the behavior tree for condition checks. |

No other public properties are initialized directly in the constructor.

## Main functions

### `WobyBigBrain:OnStart()`
* **Description:** Initializes the behavior tree (`self.bt`) with a priority-based node hierarchy. This includes conditional guards, combat avoidance, interaction handling, task assistance, and fallback behaviors like following, wandering, and idle waiting. The tree is wrapped in a state guard (`<busy state guard>`) that prevents execution while Woby is jumping or transforming.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** None. The function sets up `self.bt` for execution by the ECS `brain` component.

### `GetOwner(inst)`
* **Description:** Returns the owner (leader) of Woby by delegating to `components.follower:GetLeader()`, or `nil` if no follower component exists.
* **Parameters:** `inst` (Entity instance).
* **Returns:** Entity instance (owner) or `nil`.
* **Error states:** Returns `nil` if `inst.components.follower` is absent or `GetLeader()` returns `nil`.

### `GetHomePos(inst)`
* **Description:** Determines the reference position for wandering: the platform’s position if Woby is on a `walkableplatform`, otherwise the owner’s position.
* **Parameters:** `inst` (Entity instance).
* **Returns:** Position (x,y,z) or `nil` if no platform or owner is available.
* **Error states:** Returns `nil` if `GetCurrentPlatform()` is `nil` and no owner is present.

### `GetWanderDist(inst)`
* **Description:** Returns the maximum wander radius: `platform_radius` if on a walkable platform, otherwise the default `WANDER_DIST` (12).
* **Parameters:** `inst` (Entity instance).
* **Returns:** Number (distance).
* **Error states:** Defaults to `PLATFORM_WANDER_DIST` (4) if the platform component or property is missing.

### `HasAvoidCombatTarget(self)`
* **Description:** Checks if Woby should avoid nearby combat: either by validating an existing `runawayfrom` target, or by querying entities within combat range (`COMBAT_TOO_CLOSE_DIST = 10`) using `_avoidtargetfn`. Uses strict tags (`_combat`, `_health`) and exclusion tags (`wall`, `INLIMBO`).
* **Parameters:** `self` (Behavior tree node context, with `self.runawayfrom` and `self.inst`).
* **Returns:** Boolean (`true` if a combat target is within unsafe range).
* **Error states:** Clears `self.runawayfrom` if validation fails.

### `_avoidtargetfn(self, target)`
* **Description:** Determines whether a given entity (`target`) represents a combat threat that Woby (via its owner) should avoid. Evaluates owner/target combat relationships, proximity, and recent activity (timeout-based).
* **Parameters:** `self` (behavior context), `target` (Entity instance).
* **Returns:** Boolean (`true` if target is a combat threat).
* **Error states:** Returns `false` if owner or target lacks `combat`/`health` components, is dead, or too far.

### `FindNew_MINE(inst, leaderdist, finddist, ...)`
* **Description:** Wraps `BrainCommon.AssistLeaderDefaults.MINE.FindNew` to locate a mineable target and adjusts the required distance to the target to be at least `WORK_MIN_DISTANCE + target.physics_radius`.
* **Parameters:** `inst`, `leaderdist`, `finddist`, and optional arguments passed to the base finder.
* **Returns:** Action table (e.g., `action = "MINE"`, `target = ...`, `distance = ...`) or `nil`.
* **Error states:** Returns `nil` if the base finder returns `nil`; otherwise, sets `distance` and notifies the player link via `"tellwobywork"`.

### `FindNew_CHOP(inst, leaderdist, finddist, ...)`
* **Description:** Similar to `FindNew_MINE`, but for CHOP tasks.
* **Parameters:** `inst`, `leaderdist`, `finddist`, and optional arguments.
* **Returns:** Action table or `nil`.
* **Error states:** Same as `FindNew_MINE`.

### `IsAllowedToWorkThings(inst)`
* **Description:** Returns whether Woby is permitted to assist with work tasks based on the `woby_commands_classified` flag.
* **Parameters:** `inst` (Entity instance).
* **Returns:** Boolean (`true` if `inst.woby_commands_classified:ShouldWork()` is `true`).

### `HasTaskAidBehavior(inst)`
* **Description:** Checks if the `walter_woby_taskaid` skill is activated for the player link.
* **Parameters:** `inst` (Entity instance).
* **Returns:** Boolean (`true` if skill is active).

## Events & listeners
* **Listens to:** None explicitly (no `inst:ListenForEvent` calls in this file).
* **Pushes:** `"critter_avoidcombat"` (with `{avoid=true}` or `{avoid=false}`) when entering/exiting combat avoidance state.
* **Pushes:** `"tellwobywork"` to the player link (`inst._playerlink`) after successfully selecting a CHOP or MINE target.