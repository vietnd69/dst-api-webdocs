---
id: firebug
title: Firebug
description: Triggers periodic announcements and spawns a prefab when an entity's fire timer expires, optionally subject to sanity thresholds.
tags: [component, sanity, announcement, spawn]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: a55dcb73
system_scope: entity
---

# Firebug

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Firebug` is a periodic behavior component that triggers timed events on its owner entity. It updates each frame via `OnUpdate`, tracks a countdown timer (`time_to_fire`), and at intervals (`time_interval ± time_variance`) executes two actions: (1) causes the entity to speak a localized string (`ANNOUNCE_LIGHTFIRE`) via the `talker` component, and (2) spawns a prefab (if configured) at the entity’s position. It optionally respects sanity state — if `sanity_threshold` is set, it skips the action when the entity is in Insanity Mode and has sanity at or above the threshold.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("firebug")

-- Configure firing behavior
inst.components.firebug.time_interval = 90
inst.components.firebug.time_variance = 30
inst.components.firebug.prefab = "firebug_fx"
inst.components.firebug.sanity_threshold = 0.4

-- Enable (starts timer)
inst.components.firebug:Enable()
```

## Dependencies & tags
**Components used:** `sanity`, `talker`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `time_to_fire` | number | `60` | Remaining time (in seconds) before the next trigger. Decremented each frame; reset after firing. |
| `time_interval` | number | `120` | Base interval (in seconds) between triggers. |
| `time_variance` | number | `120` | Random variance added to `time_interval`; actual delay = `time_interval + time_variance * math.random()`. |
| `sanity_threshold` | number or `nil` | `nil` | If set, skips triggers when entity is in Insanity Mode *and* has sanity percentage ≥ this value. |
| `prefab` | string or `nil` | `nil` | Name of the prefab to spawn at the entity's location on trigger. |
| `enabled` | boolean | `true` (initially) | Whether the component is active and receiving `OnUpdate` calls. |

## Main functions
### `Enable(enable)`
*   **Description:** Activates the component. If called with no argument (or `true`), it enables updating and sets `enabled = true`. If called with `false`, it acts as `Disable()`.
*   **Parameters:** `enable` (boolean, optional) — If provided and `false`, disables the component.
*   **Returns:** Nothing.
*   **Error states:** No effect if `enabled` is already `true`.

### `Disable()`
*   **Description:** Deactivates the component. Stops updates and sets `enabled = false`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No effect if `enabled` is already `false`.

### `OnUpdate(dt)`
*   **Description:** Called each frame while `enabled`. Decrements `time_to_fire`; when it reaches zero, triggers the announcement and optional spawn, then resets `time_to_fire`.
*   **Parameters:** `dt` (number) — Delta time in seconds since last frame.
*   **Returns:** Nothing.
*   **Error states:** Early return occurs if `sanity_threshold` is set *and* the entity is in Insanity Mode with `sanity:GetPercent() >= sanity_threshold`. Also, if `time_to_fire > dt`, only decrements the timer.

### `GetDebugString()`
*   **Description:** Returns a formatted string for debugging, showing current state.
*   **Parameters:** None.
*   **Returns:** string — e.g., `"enabled=true, time_to_fire=45.23"`.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.
