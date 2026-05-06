---
id: wx78_scannerbrain
title: Wx78 Scannerbrain
description: AI brain for WX-78's scanner companion, managing target acquisition, scanning behaviour, and return-to-player logic after scan completion.
tags: [brain, ai, wx78, scanner]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: brains
source_hash: 3d676032
system_scope: brain
---

# Wx78 Scannerbrain

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`WX78ScannerBrain` is the AI behaviour tree for WX-78's scanner companion entity. It manages the complete scanning workflow: finding scan targets via the entitytracker component, maintaining appropriate follow distances while scanning, facing the target during scan operations, and returning to the player leader after scanning completes. The brain prioritises unfinished scan returns over active scanning, and scanning over idle wandering. Brains are paused when the entity is far from any player and resume automatically on player proximity. The brain class is returned by the module and attached by the prefab brain system.

## Usage example
```lua
-- Brains are attached during prefab construction:
local brain = require("brains/wx78_scannerbrain")
inst:SetBrain(brain)

-- The framework calls OnStart() to construct the behaviour tree.
```

## Dependencies & tags
**External dependencies:**
- `behaviours/doaction` -- DoAction behaviour node for executing actions
- `behaviours/faceentity` -- FaceEntity behaviour node for orientation
- `behaviours/leash` -- Leash behaviour node for follow-distance maintenance
- `behaviours/wander` -- Wander behaviour node (imported but not used in tree)

**Components used:**
- `follower` -- queried via `GetLeader()` to find the player leader
- `entitytracker` -- queried via `GetEntity("scantarget")` to find scan targets
- `stategraph` -- checked via `sg:HasStateTag("scanned")` for scan completion state

**Tags:**
- `scanned` -- state tag checked to determine if scanning is complete

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `TARGET_FOLLOW` | constant (local) | `0.1` | Minimum follow distance from scan target during scanning operations. |
| `MAX_TARGET_FOLLOW` | constant (local) | `2.0` | Maximum follow distance from scan target; clamped if target physics radius exceeds this. |

## Main functions
### `OnStart()` (Brain method)
* **Description:** Constructs the root PriorityNode of the behaviour tree. Priority order: (1) return to player if scan finished but not returned, (2) find scan target if none exists, (3) maintain position and face target while scanning, (4) leash to leader position, (5) stand still. Called once when the brain is attached and on resume after pause.
* **Parameters:** `self` -- the brain instance (implicit via method syntax)
* **Returns:** None (assigns `self.bt` with the BehaviourTree)
* **Error states:** Errors if `self.inst` is nil at the moment OnStart fires (engine guarantees non-nil; included for completeness).

### `GetLeader(inst)` (local)
* **Description:** Helper function to retrieve the scanner's leader entity. Returns the leader from the follower component if available.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** Leader entity instance or `nil` if no follower component or no leader assigned
* **Error states:** None — guards `inst.components.follower` access with `and` short-circuit.

### `GetLeaderPosition(inst)` (local)
* **Description:** Returns the leader's current position, or the scanner's own position if no leader exists. Used by Leash behaviour to determine follow target.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** Vector3 position table or `nil` if both leader and inst position are unavailable
* **Error states:** None — guards leader nil check before calling `GetPosition()`.

### `ReturnToPlayerAfterFinishedScan(inst)` (local)
* **Description:** Creates a WalkTo action to return the scanner to the player leader after scanning completes. Only executes if `inst._donescanning` is true. Calls `inst:OnReturnedAfterSuccessfulScan()` on action success.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** BufferedAction for WALKTO or `nil` if scan not finished or no valid offset found
* **Error states:** None — guards `_donescanning` flag and leader existence before creating action.

### `GetScanTarget(inst)` (local)
* **Description:** Retrieves the current scan target from the entitytracker component. Returns nil if the stategraph has the `scanned` tag (scan already completed).
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** Target entity instance or `nil` if no target tracked or scan already finished
* **Error states:** None — guards state tag check and entitytracker access with `and` short-circuit.

### `GetTargetScanFollowDistance(inst)` (local)
* **Description:** Calculates the minimum follow distance from the scan target. Adds `TARGET_FOLLOW` to the target's physics radius to maintain appropriate scanning range.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** Number representing follow distance in world units, or `TARGET_FOLLOW` if no target
* **Error states:** None — guards target nil check before calling `GetPhysicsRadius()`.

### `GetMaxScanFollowDistance(inst)` (local)
* **Description:** Calculates the maximum follow distance from the scan target. Clamps to `inst:GetScannerScanDistance() - 0.05` to avoid stop/start oscillation at scan range boundary. Uses target physics radius plus `MAX_TARGET_FOLLOW`, whichever is smaller.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** Number representing max follow distance in world units, or `MAX_TARGET_FOLLOW` if no target
* **Error states:** Errors if `inst` lacks scanner component (`inst:GetScannerScanDistance()` called with no nil guard).

### `GetScanTargetLocation(inst)` (local)
* **Description:** Returns the current position of the scan target, or the scanner's own position if no target exists. Used by Leash behaviour for position reference.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** Vector3 position table
* **Error states:** None — falls back to `inst:GetPosition()` if target is nil.

### `KeepFacingScanTarget(inst, target)` (local)
* **Description:** Validation function for FaceEntity behaviour. Returns true while the scan target remains valid in the entitytracker. Called each tick while facing.
* **Parameters:**
  - `inst` -- entity owning the brain
  - `target` -- current face target entity (unused; re-queries entitytracker)
* **Returns:** boolean -- true if scan target still exists, false otherwise
* **Error states:** None — re-queries via `GetScanTarget()` which handles nil safely.

## Events & listeners
None — brain trees react to component state changes and stategraph tags, not engine events directly. Event handling is done in the brain's host stategraph or via component subscriptions.