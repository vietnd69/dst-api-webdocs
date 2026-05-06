---
id: runawaytodist
title: Runawaytodist
description: BehaviourNode that calculates and moves to a safe distance away from a hunter entity; returns SUCCESS when safe distance is achieved.
tags: [behaviour, ai, behaviour-tree, locomotion, escape]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: behaviours
source_hash: 03f39c45
system_scope: brain
---

# RunAwayToDist

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`RunAwayToDist` is a custom BehaviourNode that causes an entity to flee from a hunter until reaching a specified safe distance. Returns READY/RUNNING/SUCCESS/FAILED in the standard BehaviourNode contract. Used by brains as a reusable escape behavior, particularly for possessed body entities (e.g., WX-78 possessed body). Integrates with the locomotor component for movement and handles aquatic/terrestrial pathfinding differences.

## Usage example
```lua
-- Embed inside a brain's behaviour tree:
local RunAwayToDist = require("behaviours/runawaytodist")

local function GetHunter(inst)
    return inst.components.combat.target
end

local function ShouldRun(hunter, inst)
    return hunter ~= nil and hunter:IsValid()
end

local root = SelectorNode{
    RunAwayToDist:new(self.inst, {getfn = GetHunter}, 10, ShouldRun, true, false, false),
    Wander(self.inst, GetHomePos, WANDER_DIST),
}
```

## Dependencies & tags
**Components used:**
- `locomotor` -- GoToPoint(), Stop(), IsAquatic(), CanPathfindOnWater() for movement control

**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | --- | Entity owning the behaviour. Set by constructor. |
| `safe_dist` | number | --- | Target distance to maintain from hunter. Can be a function via FunctionOrValue. |
| `gethunterfn` | function | `nil` | Function `(inst) -> entity` that returns the hunter to flee from. Set if hunterparams is a table. |
| `shouldrunfn` | function | `nil` | Predicate `(hunter, inst) -> boolean`; node runs only while it returns true. |
| `fix_overhang` | boolean | `nil` | If true, recalculates position if entity steps on ocean overhang land boundary. |
| `walk_instead` | boolean | `nil` | If true, uses walking speed instead of running when fleeing. |
| `allow_boats` | boolean | `nil` | Allows pathfinding to include boat entities as valid destinations. |
| `hunter` | entity | `nil` | Current hunter entity being fled from. Set during Visit() via gethunterfn. |
| `avoid_time` | number | `nil` | Internal: timestamp when last deflection occurred for wall avoidance caching. |
| `avoid_angle` | vector | `nil` | Internal: cached offset angle from last deflection to reuse within 1 second. |
| `status` | BehaviourNode status | `READY` | Current node status (READY, RUNNING, SUCCESS, FAILED). Inherited from BehaviourNode. |
| `TOLERANCE_DIST` | number | `0.5` | File-scope constant; distance threshold for determining if entity has reached target position. |
| `TOLERANCE_DIST_SQ` | number | `0.25` | File-scope constant; squared distance threshold used in Visit() to avoid sqrt calculations. |

## Main functions
### `__tostring()`
*   **Description:** Returns debug string showing current safe distance and hunter entity for behaviour tree debugger overlay.
*   **Parameters:** None
*   **Returns:** string in format `"RUNAWAY {safe_dist} from: {hunter}"`
*   **Error states:** None — uses tostring() which handles nil safely.

### `GetRunPosition(pt, hp, safe_dist)`
*   **Description:** Calculates a flee position at `safe_dist` away from hunter position `hp`, starting from entity position `pt`. Behavior depends on multiple fallback branches:
  - Cached deflection check — if `avoid_angle` was set within last 1 second, returns cached offset immediately without recalculating.
  - Standard offset calculation — uses `FindWalkableOffset` or `FindSwimmableOffset` based on `locomotor:IsAquatic()`, with wall avoidance enabled.
  - Retry without wall avoidance — if standard calculation returns nil, retries with wall avoidance disabled.
  - Overhang correction — if `fix_overhang` is true and still failed, searches for nearby land (`FindNearbyLand`) or ocean (`FindNearbyOcean`) and recalculates from that point.
  - Final fallback — if all attempts fail, returns nil (caller treats as failure).
  Caches deflected angles for 1 second to avoid oscillation.
*   **Parameters:**
    - `pt` -- vector; current entity position
    - `hp` -- vector; hunter position
    - `safe_dist` -- number; target radius from hunter
*   **Returns:** vector offset from hunter position, or `nil` if no valid position found
*   **Error states:** Errors if `self.inst.components.locomotor` is nil — no guard before calling IsAquatic() or CanPathfindOnWater().

### `Visit()`
*   **Description:** Called each tick by the parent node. Transitions status: READY → RUNNING when hunter found and shouldrunfn returns true; RUNNING → SUCCESS when safe distance achieved; RUNNING → FAILED when hunter invalid, shouldrunfn returns false, or position calculation fails. Uses Sleep(0.125) to throttle updates while RUNNING.
*   **Parameters:** None (uses self.inst, self.hunter, self.safe_dist, self.shouldrunfn)
*   **Returns:** nil — sets self.status as side effect
*   **Error states:** Errors if `self.inst.components.locomotor` is nil — no guard before calling Stop() or GoToPoint().

## Events & listeners
None.