---
id: findclosest
title: Findclosest
description: AI behaviour node that finds and moves toward the nearest entity matching specified tag filters.
tags: [ai, behavior, locomotion]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: behaviour
source_hash: 27897de9
system_scope: ai
---

# Findclosest

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Findclosest` is a behaviour node used in the game's AI system (typically via `BehavIoUr` brains) to locate the nearest valid entity within a given radius that matches a set of tag conditions, then move toward it. It inherits from `BehaviourNode` and integrates with the `locomotor` component to execute movement. The node evaluates validity based on tags (required, excluded, and "one-of" conditions), refreshes its target periodically (every 5 seconds), and transitions to `SUCCESS` once it reaches a specified proximity to the target.

## Usage example
```lua
-- Example of adding Findclosest to a custom AI brain
inst:AddComponent("behaviourtree")
inst.components.behaviourtree:SetTree({
    Selector,
    {
        Findclosest(see_dist = 10, safe_dist = 3, tags = "prey", exclude_tags = "INLIMBO"),
        MoveTo(),
    },
    ...
})
```

## Dependencies & tags
**Components used:** `locomotor` (calls `GoToPoint` and `Stop`)  
**Tags:** Uses tag filtering logic via `HasTag()` on target entities; no tags are added or removed on the owner entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this behaviour belongs to. |
| `targ` | `Entity?` | `nil` | The currently selected target entity (may be `nil`). |
| `see_dist` | number | — | Maximum search radius for finding targets. |
| `safe_dist` | number or function | — | Desired distance to maintain from the target; may be a function `(inst, target) => number`. |
| `lastchecktime` | number | `0` | Timestamp of the last target search (used for throttling). |
| `tags` | table or string? | `nil` | List (or single string) of tags the target must have. |
| `exclude_tag` | table or string? | `nil` | List (or single string) of tags that exclude a target. |
| `one_of_tags` | table or string? | `nil` | List (or single string) where the target must have at least one. |

## Main functions
### `DBString()`
*   **Description:** Returns a human-readable debug string describing the current state of the node (e.g., `"Stay near target beefalo"`).
*   **Parameters:** None.
*   **Returns:** `string` — formatted description including the current target prefab name (or `"nil"` if no target).

### `Visit()`
*   **Description:** Executes the core AI logic for this node per tick: finds a target on first run, periodically refreshes it, checks tag validity, and moves the entity toward the target until within `safe_dist`. Sets the node status to `SUCCESS`, `FAILED`, or `RUNNING`.
*   **Parameters:** None.
*   **Returns:** Nothing. Updates `self.status` (`READY` → `RUNNING` → `SUCCESS/FAILED`).

### `PickTarget()`
*   **Description:** Searches the world for entities matching the configured tag filters (`tags`, `exclude_tag`, `one_of_tags`) within `see_dist`. Selects the first valid entity (excluding self) and updates `self.targ`.
*   **Parameters:** None.
*   **Returns:** Nothing. Sets `self.targ` and `self.lastchecktime`.

## Events & listeners
None identified.
