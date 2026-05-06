---
id: brightmare_gestaltguardbrain
title: Brightmare Gestaltguardbrain
description: AI behaviour tree for the brightmare gestalt guard, managing aggressive chasing, player relocation, chassis possession, and idle wandering based on behaviour level and player proximity.
tags: [brain, ai, behaviour-tree, brightmare, gestalt]
sidebar_position: 10
last_updated: 2026-04-27
build_version: 722832
change_status: stable
category_type: brains
source_hash: 7728c15a
system_scope: brain
---

# Brightmare Gestaltguardbrain

> Based on game build **722832** | Last updated: 2026-04-27

## Overview
`Brightmare Gestaltguardbrain` is the AI behaviour tree for the brightmare gestalt guard entity. It prioritises aggressive chasing at `behaviour_level == 3`, relocates when players get too close (within `RELOCATED_DISTSQ`), attempts chassis possession via `BrainCommon.PossessChassisNode`, faces valid combat targets within watching range, and wanders idly otherwise. Brains are paused when the entity is far from any player and resume automatically on player proximity. Brain trees are attached via `inst:SetBrain(brain)` during prefab construction.

## Usage example
```lua
-- Brains are attached during prefab construction:
local brain = require("brains/brightmare_gestaltguardbrain")
inst:SetBrain(brain)

-- The framework calls OnStart() to obtain the behaviour tree.
-- Manual access to the running tree:
if inst.brain ~= nil and inst.brain.bt ~= nil then
    -- inspect or reset the running behaviour tree
end
```

## Dependencies & tags
**External dependencies:**
- `behaviours/follow` -- imported but not directly used in visible code
- `behaviours/wander` -- Wander behaviour node factory
- `behaviours/standstill` -- StandStill behaviour node factory
- `behaviours/faceentity` -- FaceEntity behaviour node factory
- `brains/braincommon` -- provides `PossessChassisNode` for chassis possession logic

**Components used:**
- `combat` -- read current target via `inst.components.combat.target`
- `knownlocations` -- records spawn point via `RememberLocation` in `OnInitializationComplete`
- `sg` (stategraph) -- checked for `jumping` tag and triggers `relocate` state

**Tags:**
- `jumping` -- checked via `HasStateTag` to gate main behaviour tree execution

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ATTACK_CHASE_TIME` | constant (local) | `5` | Duration in seconds for ChaseAndAttack behaviour when `behaviour_level == 3`. |
| `WANDER_TIMES` | constant (local) | `{ minwalktime = 2, randwalktime = 2, minwaittime = 3, randwaittime = 3 }` | Timing parameters for Wander behaviour: walk and wait time ranges. |
| `RELOCATED_DISTSQ` | constant (local) | `9` | Squared distance threshold (3\*3) for detecting players too close, triggering relocation. |
| `GETFACINGTARGET_DISTSQ` | constant (local) | `TUNING.GESTALTGUARD_WATCHING_RANGE^2` | Squared distance threshold for determining if a combat target is within facing range. |
| `UPDATE_RATE` | constant (local) | `0.1` | Behaviour tree update interval in seconds for PriorityNode and WhileNode evaluations. |

## Main functions
### `OnStart()`
* **Description:** Constructs the root PriorityNode of the behaviour tree with nested WhileNodes gating behaviour by state and level. Priority order: aggressive chase (level 3) \> relocate (player too close) \> chassis possession \> face entity \> wander. The entire tree is wrapped in a WhileNode that skips execution if the entity has the `jumping` state tag. Called once when the brain is attached and on resume after pause.
* **Parameters:** None
* **Returns:** None (assigns `self.bt` with the BehaviourTree)
* **Error states:** Errors if `self.inst.sg` is nil when checking `HasStateTag` (no nil guard present before `self.inst.sg:HasStateTag` call).

### `OnInitializationComplete()`
* **Description:** Records the entity's spawn point location in the `knownlocations` component with the name `"spawnpoint"`. Uses `dont_overwrite = true` to prevent overwriting existing spawn point data. Called once after the brain is fully initialized.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.inst.components.knownlocations` is nil or missing. Errors if `self.inst:GetPosition()` returns invalid coordinates.

### `IsPlayerTooClose(inst)` (local)
* **Description:** Helper passed to the Relocate WhileNode. Returns true if any player is within `RELOCATED_DISTSQ` (squared distance of 9 tiles) of the entity. Uses `IsAnyPlayerInRangeSq` with the final boolean parameter set to `true`.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** boolean -- true if a player is within the relocation threshold distance
* **Error states:** Errors if `inst.Transform` is nil or `inst.Transform:GetWorldPosition()` fails.

### `Relocate(inst)` (local)
* **Description:** Helper passed to the Relocate ActionNode. Triggers the `relocate` state on the entity's stategraph, causing the entity to move to a new position away from nearby players.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** None
* **Error states:** Errors if `inst.sg` is nil or `inst.sg:GoToState` is unavailable.

### `GetFacingTarget(inst)` (local)
* **Description:** Helper passed to the FaceEntity behaviour node. Returns the current combat target if `behaviour_level == 2` and the target is within `GETFACINGTARGET_DISTSQ`. Calculates squared distance between entity and target positions (ignoring Y axis). Returns nil if no valid target or target is out of range.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** entity instance or `nil` if no valid target within range
* **Error states:** Errors if `inst.components.combat` is nil. Errors if `inst.Transform` or `target.Transform` is nil when getting positions.

### `KeepFacingTarget(inst, target)` (local)
* **Description:** Helper passed to the FaceEntity behaviour node. Validates whether the entity should continue facing the given target by checking if `GetFacingTarget(inst)` still returns the same target. Used to determine if the facing behaviour should persist or be cancelled.
* **Parameters:**
  - `inst` -- entity owning the brain
  - `target` -- candidate target entity to validate
* **Returns:** boolean -- true if target is still valid for facing
* **Error states:** Errors if `GetFacingTarget` fails due to missing components (see `GetFacingTarget` error states).

## Events & listeners
None — brain trees react to component state, not engine events directly. Event handling is done in the brain's host stategraph or via component subscriptions.