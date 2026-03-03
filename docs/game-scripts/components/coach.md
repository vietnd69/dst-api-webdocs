---
id: coach
title: Coach
description: Provides periodic support effects (sanity and fight buffs) to nearby players and followers when the host entity is tagged as "coaching".
tags: [support, buff, leadership, sanity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 297abeff
system_scope: entity
---

# Coach

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Coach` is a support component that periodically buffs nearby allies—both direct followers and players within range—with small sanity increases and fight-related debuffs. It is designed to be used by a leadership-type entity (e.g., Wolfgang) to boost team performance. The component activates when enabled and relies on the `leader` and `sanity` components, as well as the `talker` component for team-finding notifications.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("coach")
inst:AddTag("coaching") -- optional, enables visual state
inst.components.coach:Enable()

-- Later, disable the coaching behavior:
inst.components.coach:Disable()
```

## Dependencies & tags
**Components used:** `leader`, `sanity`, `talker`  
**Tags:** Adds `coaching` when enabled; removes `coaching` when disabled.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | boolean | `false` | Whether the coaching cycle is active. |
| `randtime` | number | `30` | Random delay (in seconds) added to the base inspire interval. |
| `settime` | number | `10` | Minimum fixed delay (in seconds) between inspiration attempts. |
| `lastcoachtime` | number or `nil` | `nil` | Timestamp of the last successful inspiration attempt. |
| `noteamlasttime` | boolean or `nil` | `nil` | Tracks whether the coach recently announced "no team" to avoid spam. |
| `inspiretask` | Task or `nil` | `nil` | Reference to the scheduled task for the next inspiration cycle. |

## Main functions
### `Enable()`
*   **Description:** Enables the coaching component by adding the `coaching` tag and starting the periodic inspiration loop.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Disable()`
*   **Description:** Disables the coaching component by removing the `coaching` tag and cancels the current inspiration task.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StartInspiring()`
*   **Description:** Schedules the next inspiration call using `TUNING.COACH_TIME_TO_INSPIRE` as the initial delay. Does nothing if an `inspiretask` is already active.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StopInspiring()`
*   **Description:** Cancels any pending `inspiretask` and sets it to `nil`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `inspire(inst)`
*   **Description:** Core logic function that searches for nearby allies (within `INSPIRE_DIST` units) and applies buffs. Called automatically via task scheduling.  
    * Sanity buff is applied to players with `sanity.GetPercent()` below `0.75`.  
    * Fight buffs (`wolfgang_coach_buff`) and `cheer` events are applied to followers and nearby players (or their followers).  
    * If no buffs are applied, it triggers a spoken announcement via `talker:Say(...)`.
*   **Parameters:** `inst` (Entity) — the coach entity instance.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `coach.lastcoachtime` exists and current time is less than `coach.lastcoachtime + coach.settime`. Does not apply buffs to entities outside range or without required components.

## Events & listeners
- **Listens to:** None (component itself does not register listeners).
- **Pushes:** `coach` — fired when at least one ally receives a buff.  
- **Pushes via `talker` (external):** Triggers speech via `inst.components.talker:Say(...)` when no ally is eligible for buffs, with the string key `"ANNOUNCE_WOLFGANG_NOTEAM"`.
