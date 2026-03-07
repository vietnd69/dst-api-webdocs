---
id: schoolherd
title: Schoolherd
description: Manages a school of fish that moves between pre-defined navigation points and reacts to entity sleep states.
tags: [ai, water, school, lifecycle, navigation]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5b658f44
system_scope: world
---

# Schoolherd

> Based on game build **714001** | Last updated: 2026-03-07

## Overview
`schoolherd` is a prefab generator for aquatic animal herds that behave as coordinated groups in open water. It creates entities that act as group heads, organizing multiple fish members into a cohesive school. The school moves between predefined navigation points (`nav1`, `nav2`, etc.) that are randomly sampled in swimmable locations, with delays and wander zones controlled by per-fish configuration data. It integrates with the `herd`, `knownlocations`, and `timer` components to manage group behavior, memory of positions, and lifetime.

## Usage example
This component is not used directly; it is instantiated automatically by the game for each fish type defined in `prefabs/oceanfishdef.lua`. The resulting prefabs (e.g., `schoolherd_squid`) are spawned during world generation.

```lua
-- Not for direct use — the game auto-generates and spawns school prefabs
-- Example of resulting prefab instantiation (internal):
local inst = Prefab("schoolherd_squid", fn, nil, { "squid" })
```

## Dependencies & tags
**Components used:** `herd`, `knownlocations`, `timer`  
**Tags added:** `herd`, `NOBLOCK`, `NOCLICK`  
**Tags checked/removed:** `herd_<fishprefab>` (via `SetMemberTag`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fishprefab` | string | `nil` | Reference to the fish prefab name used to look up configuration in `FISH_DATA.fish`. |
| `currentnav` | number | `2` (set in `setupnavs`) | Index of the current navigation point (`navX`) the school is targeting. |
| `delaying` | boolean or `nil` | `nil` | `true` when the school is waiting before moving to the next nav point. |

## Main functions
### `AddMember(inst, member)`
*   **Description:** Attaches an event listener to a school member so that when the member falls asleep (`entitysleep`), the school can evaluate whether to dissolve (via `checkforremoval`). Also stores a callback reference on the member for cleanup.
*   **Parameters:**  
    `inst` (Entity) — the school herd entity.  
    `member` (Entity) — the fish entity being added to the herd.
*   **Returns:** Nothing.
*   **Error states:** None.

### `RemoveMember(inst, member)`
*   **Description:** Cleans up the entity sleep listener attached during `AddMember`, preventing memory leaks or invalid callbacks.
*   **Parameters:**  
    `inst` (Entity) — the school herd entity.  
    `member` (Entity) — the fish entity being removed.
*   **Returns:** Nothing.
*   **Error states:** Safely handles cases where the listener was never attached.

### `_OnUpdate(inst, self)`
*   **Description:** Wrapper that delegates to `inst.components.herd:OnUpdate()`, ensuring the herd logic (member gathering, position averaging, etc.) runs on schedule.
*   **Parameters:**  
    `inst` (Entity) — the school herd entity.  
    `self` (Herd) — the herd component instance.
*   **Returns:** Nothing.

### `updateposfn(inst)`
*   **Description:** Computes and returns the herd's target position based on the current navigation point. Handles inter-nav delays (e.g., pausing to "wander" near the current point before proceeding) and assigns each herd member a randomized offset around the current nav point.
*   **Parameters:**  
    `inst` (Entity) — the school herd entity.
*   **Returns:** `Vector3` — the computed world position for the herd to move toward.
*   **Error states:** Falls back to `nav1` if `navX` is missing; no errors reported.

### `setupnavs(inst)`
*   **Description:** Initializes a sequence of six navigation points in swimmable areas around the school's origin. Also starts the school’s lifetime timer.
*   **Parameters:**  
    `inst` (Entity) — the school herd entity.
*   **Returns:** Nothing.
*   **Error states:** Skips reinitialization if `nav1` already exists.

### `checkforremoval(inst)`
*   **Description:** Determines if all herd members are in entity-sleep state. If so, dissolves the entire school by removing all members and the herd entity itself.
*   **Parameters:**  
    `inst` (Entity) — the school herd entity.
*   **Returns:** Nothing.
*   **Error states:** None — safe to call periodically.

### `OnTimerDone(inst, data)`
*   **Description:** Handles the `lifetime` timer expiration by instructing all herd members to leave via the `doleave` event, then removes the herd entity.
*   **Parameters:**  
    `inst` (Entity) — the school herd entity.  
    `data` (table) — timer callback data (must include `name` = `"lifetime"`).
*   **Returns:** Nothing.
*   **Error states:** Only triggers on `"lifetime"` timer — no-op for other timers.

## Events & listeners
- **Listens to:**  
  `entitysleep` (on each member) — triggers `checkforremoval` to assess herd dissolution.  
  `timerdone` (on `inst`) — triggers `OnTimerDone` when the school’s lifetime expires.
- **Pushes:**  
  None directly, but causes members to receive `doleave` event when dissolving.
  
