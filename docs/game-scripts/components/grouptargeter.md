---
id: grouptargeter
title: Grouptargeter
description: Manages weighted targeting for AI entities by tracking multiple potential targets and dynamically adjusting selection probabilities based on recent choices.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: brain
source_hash: dfe8c577
---

# Grouptargeter

## Overview
The `Grouptargeter` component maintains a set of potential targets with associated selection weights and implements weighted-random targeting logic. It dynamically adjusts weights to prevent repeated targeting of the same entity—increasing the weight of unselected targets and decreasing the weight of recently selected ones—ensuring balanced target selection across multiple entities. It is primarily used by AI brains to select intelligent, fair targets during combat or interaction scenarios.

## Dependencies & Tags
- Uses `inst:ListenForEvent` and `inst:RemoveEventCallback` to monitor `"onremove"` events on target entities.
- Does **not** add or remove tags on the host entity.
- No explicit component dependencies (e.g., no `AddComponent` calls) are present.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `targets` | `table` (entity → number) | `{}` | Maps target entities to their current selection weights. |
| `total_weight` | `number` | `1` | Unused in logic (internal debug only); not actively maintained. |
| `weight_change` | `number` | `0.1` | Amount by which weights are adjusted when a target is selected. |
| `num_targets` | `number` | `0` | Current count of tracked targets. |
| `min_chance` | `number` | `0` | Minimum probability for attempting a new target selection on `TryGetNewTarget`. |
| `max_chance` | `number` | `0.7` | Maximum probability cap for target re-evaluation. |
| `chance_delta` | `number` | `0.1` | Increment applied to `current_chance` on failure to pick a new target. |
| `current_chance` | `number` | `0` | Current probability threshold for triggering a new target selection attempt. |
| `_ontargetremoved` | `function` | *(internal)* | Callback registered to stop tracking when a target is removed from the world. |

## Main Functions

### `StartTracking(target)`
* **Description:** Registers a listener for the `"onremove"` event on the given `target` entity to automatically stop tracking it when it is removed.
* **Parameters:**
  * `target` *(Entity)*: The target entity to begin tracking.

### `StopTracking(target)`
* **Description:** Removes the `"onremove"` event listener registered for the given `target`.
* **Parameters:**
  * `target` *(Entity)*: The target entity to stop tracking.

### `AddTarget(target)`
* **Description:** Adds a new target to the internal list with appropriate weight normalization to preserve total weight ≈ 1. Initial target gets full weight if list was empty; otherwise, weights are rebalanced proportionally.
* **Parameters:**
  * `target` *(Entity)*: The new target to add.

### `RemoveTarget(target)`
* **Description:** Removes a target and redistributes its weight equally among remaining targets. If it was the last target, clears the list.
* **Parameters:**
  * `target` *(Entity)*: The target to remove.

### `OnPickTarget(target)`
* **Description:** Adjusts weights after a target is selected: *decreases* the weight of the chosen target and *increases* the weight of all other targets proportionally (preventing consecutive repeats).
* **Parameters:**
  * `target` *(Entity)*: The target that was just selected.

### `SelectTarget()`
* **Description:** Returns a target using weighted-random selection based on current weights in `self.targets`. Iterates through targets, accumulating weights until the random selection point falls within a target's range.
* **Parameters:** None.

### `TryGetNewTarget()`
* **Description:** Attempts to select a new target based on a probability threshold (`current_chance`). On success, calls `OnPickTarget` and returns the new target; on failure, increments `current_chance` and returns `nil`.
* **Parameters:** None.

### `GetTargets()`
* **Description:** Returns the internal `targets` map.
* **Parameters:** None.

### `IsTargeting(target)`
* **Description:** Returns whether the given entity is currently tracked as a target.
* **Parameters:**
  * `target` *(Entity)*: The entity to check.

## Events & Listeners
- Listens for `"onremove"` event on each tracked target entity via `inst:ListenForEvent("onremove", self._ontargetremoved, target)` in `StartTracking`.
- Triggers no custom events itself.
- `OnRemoveFromEntity` ensures cleanup by stopping tracking of all targets.