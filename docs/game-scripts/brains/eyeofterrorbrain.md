---
id: eyeofterrorbrain
title: Eyeofterrorbrain
description: Manages the behavior tree and decision logic for the Eye of Terror entity, coordinating movement, spawning, and attack selection.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: e9f9b931
---

# Eyeofterrorbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This brain component defines the behavioral logic for the Eye of Terror entity. It constructs and manages a behavior tree (BT) that orchestrates high-level actions such as movement (wandering and leash tracking), combat facing, and special move selection—including spawning mini-eyes, focusing guards, chomp attacks, and charge attacks. The brain integrates closely with the `combat`, `commander`, `knownlocations`, and `timer` components to make context-aware decisions and control movement and attack behaviors dynamically.

## Dependencies & Tags
- **Components used:**
  - `combat` (used for `HasTarget()`, `TargetIs()`, and accessing `self.target`)
  - `commander` (used for `GetNumSoldiers()` to track spawn status)
  - `knownlocations` (used for `GetLocation("spawnpoint")` and `RememberLocation()`)
  - `timer` (used for `StartTimer()` and `TimerExists()`)
- **Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_special_move` | `string?` | `nil` | Stores the name of the currently selected special move (e.g., `"spawnminieyes"`, `"focustarget"`, `"charge"`, `"chomp"`). Set by `ShouldUseSpecialMove()` and used to push the corresponding event. |
| `_leash_pos` | `Vector3?` | `nil` | Cached positional target for the `Leash` behavior. Computed lazily by `GetLeashPosition()` and reset after cooldown expires. |

## Main Functions
### `ShouldUseSpecialMove()`
* **Description:** Determines if a special move should be executed by evaluating spawn conditions, charge readiness, and attack proximity in priority order. Populates `_special_move` with the chosen action name if valid.
* **Parameters:** None.
* **Returns:** `boolean` — Returns `true` if a special move is selected; otherwise `false`.

### `GetLeashPosition()`
* **Description:** Computes and caches a leash position (7 units in front of the target along the line from target to Eye of Terror) when the leash cooldown has expired. Used by the `Leash` behavior to maintain safe distance while tracking the target.
* **Parameters:** None.
* **Returns:** `Vector3` — The computed leash position.

### `OnStart()`
* **Description:** Initializes the behavior tree with a hierarchical node structure:
  - Outer `WhileNode` ensures actions stop during charge animation.
  - Inner `PriorityNode` first checks for special moves (`spawnminieyes`, `focustarget`, `charge`, `chomp`).
  - Then evaluates leash logic if cooldown has expired.
  - Finally runs `FaceEntity` and `Wander` in parallel for routine movement and targeting alignment.
* **Parameters:** None.
* **Returns:** None.

### `OnInitializationComplete()`
* **Description:** Records the Eye of Terror's initial ground-level position (Y = 0) as `"spawnpoint"` in the `knownlocations` component. Prevents overwriting if already set (`dont_overwrite = true`).
* **Parameters:** None.
* **Returns:** None.

## Events & Listeners
- **Listens to:** None.
- **Pushes:**
  - `self._special_move` — Conditionally pushed during `OnStart()` based on the outcome of `ShouldUseSpecialMove()`; values may be `"spawnminieyes"`, `"focustarget"`, `"charge"`, or `"chomp"`.

> Note: Events are pushed directly via `self.inst:PushEvent(self._special_move)` inside the behavior tree; no event listeners are registered in this brain itself.