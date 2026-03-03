---
id: beecommon
title: Beecommon
description: Provides shared constants and utility functions for bee behavior, including combat targeting, hive defense, and home-seeking logic.
tags: [combat, ai, hive, bees]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: dcf15014
system_scope: entity
---

# Beecommon

> Based on game build **7140014** | Last updated: 2026-03-03

## Overview
`beecommon.lua` is a utility module containing shared logic and constants used by bee-related AI systems in DST. It defines distance thresholds for behavioral states (e.g., fleeing, targeting, foraging), and implements core combat and coordination functions—most notably `OnAttacked`, which handles target acquisition, hive-based emergency bee spawning, and coordinated target sharing among nearby bees. This module does not define a component itself, but rather returns a table of reusable functions and constants for use in state graphs and brain scripts.

## Usage example
```lua
local beecommon = require "brains/beecommon"

inst:ListenForEvent("attacked", beecommon.OnAttacked)
inst:ListenForEvent("worked", beecommon.OnWorked)

local action = beecommon.GoHomeAction(inst)
if action then
    inst:PushEvent("dowork", { action = action })
end
```

## Dependencies & tags
**Components used:** `combat`, `health`, `homeseeker`, `childspawner`, `burnable`
**Tags:** Checks `bee`, `companion`, `epic`; used with hive-associated prefabs (e.g., `killerbee` spawn).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `RUN_AWAY_DIST` | number | `10` | Distance threshold at which bees flee from threats. |
| `SEE_FLOWER_DIST` | number | `10` | Maximum distance to detect flowers for foraging. |
| `SEE_TARGET_DIST` | number | `6` | Distance at which bees engage a target. |
| `MAX_CHASE_DIST` | number | `7` | Farthest a bee will chase a target from its hive. |
| `MAX_CHASE_TIME` | number | `8` | Seconds a bee will continue chasing before returning home. |
| `MAX_WANDER_DIST` | number | `32` | Maximum radius bees may wander from their hive. |
| `SHARE_TARGET_DIST` | number | `30` | Radius around which bees can be summoned to assist in combat. |
| `MAX_TARGET_SHARES` | number | `10` | Maximum number of bees that can be summoned per defensive trigger. |

## Main functions
### `GoHomeAction(inst)`
*   **Description:** Creates a buffered `GOHOME` action toward the bee’s hive if the hive exists, is valid, and not burning.
*   **Parameters:** `inst` (Entity) - the bee entity requesting the action.
*   **Returns:** `BufferedAction` or `nil` - returns `nil` if no valid hive exists or if the hive is burning.
*   **Error states:** Does not spawn bees or return actions if the hive is burning (checked via `burnable:IsBurning()`).

### `OnAttacked(inst, data)`
*   **Description:** Handles defensive response when the bee is attacked: sets the attacker as the combat target, spawns emergency bees from the hive if applicable, and alerts nearby bees in the same hive to share the target.
*   **Parameters:**  
  `inst` (Entity) - the bee entity that was attacked.  
  `data` (table, optional) - event data table containing `data.attacker` (Entity).  
*   **Returns:** Nothing.
*   **Error states:**  
  - Hive emergency spawning is skipped if the hive or `childspawner` is missing.  
  - Target sharing is skipped if `attacker` is nil or invalid.  
  - Companion bees (`companion` tag) only share targets with other companions; wild bees do not share with companions.  
  - Bees already dead, in Limbo, or marked `epic` are excluded from sharing.

### `OnWorked(inst, data)`
*   **Description:** Forwards worker-related events to `OnAttacked`, allowing bees to respond defensively when a worker (e.g., player) defends the hive.
*   **Parameters:**  
  `inst` (Entity) - the bee entity.  
  `data` (table) - event data containing `data.worker` (Entity) acting as attacker.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `attacked` - triggers `OnAttacked` to initiate defense.  
  - `worked` - triggers `OnWorked` to respond to defensive worker actions.  
- **Pushes:** No events directly, but `OnAttacked` may result in:  
  - `childspawner:ReleaseAllChildren()` spawning `killerbee` prefabs.  
  - `combat:ShareTarget()` activating other bees’ combat brains.
