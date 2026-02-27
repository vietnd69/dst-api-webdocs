---
id: findclosest
title: Findclosest
description: Selects the closest valid entity within range based on tag filters and moves the owner entity to maintain a safe distance from it.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: behaviour
system_scope: entity
source_hash: 27897de9
---

# Findclosest

## Overview
`Findclosest` is a `BehaviourNode` subclass used in DST's behavior tree system. Its primary responsibility is to identify the nearest entity that matches a specified tag-based query within a given search radius (`see_dist`) and command the owner entity to approach and maintain a minimum distance (`safe_dist`) from that target. This node is commonly used for pathfinding logic in AI behaviors—such as following a leader, approaching a food source, or staying near an ally—where proximity-based movement is required. It interacts directly with the `locomotor` component to initiate and halt movement, and relies on tag-based entity filtering for selective target identification.

## Dependencies & Tags
- **Components used:** `locomotor` (uses `GoToPoint` and `Stop` methods)
- **Tags:** No tags are added or removed. Tag filtering is performed dynamically during target selection via:
  - `self.tags`: required tags (all must be present)
  - `self.exclude_tag`: forbidden tags (none may be present)
  - `self.one_of_tags`: at least one of these must be present

## Properties
| Property        | Type             | Default Value                    | Description |
|-----------------|------------------|----------------------------------|-------------|
| `inst`          | `Entity`         | *(passed to constructor)*        | The entity that owns and executes this behavior node. |
| `targ`          | `Entity?`        | `nil`                            | The currently selected target entity. May be `nil` if no valid target is found. |
| `see_dist`      | `number`         | *(passed to constructor)*        | Maximum search radius (in world units) for candidate entities. |
| `safe_dist`     | `number|function`| *(passed to constructor)*        | Desired minimum distance to maintain from the target. Can be a number or a function returning a number (signature: `(owner, target) -> number`). |
| `lastchecktime` | `number`         | `0`                              | Timestamp of the last full target search (used with `CHECK_INTERVAL` for periodic updates). |
| `tags`          | `table|string?`  | `nil`                            | Array of tags the target must *all* have (if provided). Auto-converts string to `{tags}`. |
| `exclude_tag`   | `table|string?`  | `nil`                            | Array of tags the target must *none* have (if provided). Auto-converts string to `{exclude_tags}`. |
| `one_of_tags`   | `table|string?`  | `nil`                            | Array of tags where *at least one* must be present on the target (if provided). Auto-converts string to `{one_of_tags}`. |

## Main Functions
### `FindClosest:Visit()`
* **Description:** Core logic executed each tick by the behavior tree. On first run, it selects a target and sets status to `RUNNING`. On subsequent runs, it checks if 5 seconds (`CHECK_INTERVAL`) have elapsed since the last full search, and if so, re-evaluates the target. If the current target becomes invalid or fails tag checks, it is cleared. Movement is then issued toward or away from the target to maintain `safe_dist`.
* **Parameters:** None.
* **Returns:** None. Updates `self.status` to `SUCCESS` (when within range), `FAILED` (when no target exists), or `RUNNING`.

### `FindClosest:PickTarget()`
* **Description:** Executes a world-space search for candidate entities using `TheSim:FindEntities`, then selects the closest valid candidate (first result that is not self, or second if first is self). Updates `self.lastchecktime`.
* **Parameters:** None.
* **Returns:** None. Sets `self.targ` to the chosen entity (or `nil` if no valid candidate).

### `FindClosest:DBString()`
* **Description:** Returns a debug string used by behavior tree inspectors to show the node’s current goal.
* **Parameters:** None.
* **Returns:** `string` — a human-readable description like `"Stay near target [Entity]"` or `"Stay near target nil"`.

## Events & Listeners
None.

## Implementation Notes
- **Check Interval:** Full re-targeting occurs only every 5 seconds (configurable via `CHECK_INTERVAL`), balancing responsiveness with performance. Intermediate status checks (e.g., tag validity) happen each tick without re-querying the world.
- **Safe Distance Handling:** The `safe_dist` argument supports runtime flexibility: if a function is passed, it is invoked with `(self.inst, self.targ)` as arguments to compute a per-target distance.
- **Fallback Targeting:** If the closest entity (`ents[1]`) is the owner itself, it skips to `ents[2]`. If only one entity exists (the owner), `ents[2]` is `nil`, and `self.targ` becomes `nil`, resulting in `FAILED` status.
- **Movement Logic:** When not within `safe_dist`, the owner is ordered to move to a point *adjacent* to the target at `0.98 * safe_dist` (via `GetPositionAdjacentTo`), ensuring it stops slightly *closer* than the target radius—this compensates for rounding and collision bounds.