---
id: wx78_scannerbrain
title: Wx78 Scannerbrain
description: AI behavior controller for the Wx78 Scanner that manages scanning target tracking, following, and return-to-player logic.
tags: [ai, brain, scanner, entitytracking]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 2469be2e
---

# Wx78 Scannerbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This brain component implements the autonomous AI logic for the Wx78 Scanner entity in Don't Starve Together. It orchestrates the scanner's behavior during scanning tasks, including target acquisition, spatial tracking (leashing), orientation, and post-scan return to the player. It relies on the `EntityTracker` component to manage the `scantarget` entity and the `Follower` component to identify the player leader. The brain uses Behavior Tree (BT) constructs with custom action and condition nodes to implement state-dependent decision-making.

## Usage example
Typically attached automatically via the Wx78 Scanner prefab definition during entity initialization. No manual instantiation is required in mod code.

```lua
-- Example: How the brain is instantiated in the Wx78 Scanner prefab
inst:AddComponent("wx78scannerbrain")
```

## Dependencies & tags
**Components used:** `entitytracker`, `follower`  
**Tags:** None identified

## Properties
No public properties are declared or initialized in the constructor. All behavior logic is implemented via function closures and Behavior Tree composition.

## Main functions
The brain provides a single public method inherited from `Brain`:

### `OnStart()`
* **Description:** Initializes and assigns the Behavior Tree root node to `self.bt`. Constructs a priority-based tree that prioritizes completing scans over other activities. Handles three main phases: not scanned yet, no scan target, has scan target, and fallback to player proximity.
* **Parameters:** None (uses `self.inst`).
* **Returns:** None.
* **Error states:** None documented. Tree construction assumes required behavior modules (`doaction`, `faceentity`, `leash`, `wander`) are correctly loaded.

The following local helper functions are used internally and are critical to behavior correctness:

### `GetLeader(inst)`
* **Description:** Retrieves the scanner's leader (typically the controlling player) via the `follower` component.
* **Parameters:** `inst` — the scanner entity instance.
* **Returns:** Leader instance or `nil` if no leader exists or `follower` component is missing.

### `GetLeaderPosition(inst)`
* **Description:** Gets the leader's world position, or the scanner's own position if no leader is available.
* **Parameters:** `inst` — the scanner entity instance.
* **Returns:** Vector3 or nil, depending on leader presence.

### `ReturnToPlayerAfterFinishedScan(inst)`
* **Description:** Initiates a buffered walk action to a position near the player after scanning is complete. If scanning isn't finished (`inst._donescanning` is false), returns `nil`. Otherwise, computes a walkable offset around the leader or random fallback position and executes the action.
* **Parameters:** `inst` — the scanner entity instance.
* **Returns:** `nil` if scan not finished; otherwise a `BufferedAction` with success/failure handlers calling `OnReturnedAfterSuccessfulScan`.
* **Error states:** May return `nil` if `FindWalkableOffset` fails to find a valid location or no leader is available and random fallback fails.

### `GetScanTarget(inst)`
* **Description:** Queries the `entitytracker` component for the entity tagged as `"scantarget"`, but only if the stategraph does not have the `"scanned"` tag.
* **Parameters:** `inst` — the scanner entity instance.
* **Returns:** Target entity instance or `nil` if no target is tracked or scanning is finished.

### `GetTargetScanFollowDistance(inst)`
* **Description:** Calculates the minimum radius the scanner should maintain around the scan target (target radius + `TARGET_FOLLOW` = 0.1).
* **Parameters:** `inst` — the scanner entity instance.
* **Returns:** Numeric distance or `TARGET_FOLLOW` if no target.

### `GetMaxScanFollowDistance(inst)`
* **Description:** Calculates the maximum radius the scanner may drift from the target before leashing applies, clamped to `TUNING.WX78_SCANNER_SCANDIST - 0.05`.
* **Parameters:** `inst` — the scanner entity instance.
* **Returns:** Numeric distance, clamped, or `MAX_TARGET_FOLLOW` if no target.

### `GetScanTargetLocation(inst)`
* **Description:** Returns the world position of the scan target, or the scanner’s own position if no target exists.
* **Parameters:** `inst` — the scanner entity instance.
* **Returns:** Vector3 or nil.

### `KeepFacingScanTarget(inst, target)`
* **Description:** Callback used by `FaceEntity` to verify the scanner should continue facing the scan target (i.e., target still exists and is tracked).
* **Parameters:**  
  - `inst` — the scanner entity instance.  
  - `target` — the entity being faced (unused directly in logic).  
* **Returns:** Boolean — `true` if a scan target exists (via `GetScanTarget`), `false` otherwise.

## Events & listeners
No direct event registration (`inst:ListenForEvent`) is present in this brain. Behavior execution is driven entirely by Behavior Tree state transitions and action node triggers.