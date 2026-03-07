---
id: experiencecollector
title: Experiencecollector
description: Periodically awards experience points to eligible characters based on in-game time.
tags: [xp, player, time]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b1edac6a
system_scope: entity
---

# Experiencecollector

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ExperienceCollector` is an entity component that awards 1 experience point at regular intervals (defined by `TUNING.TOTAL_DAY_TIME`) to characters who have a matching entry in `SKILLTREE_DEFS`. It is typically attached to player characters and uses a periodic task to trigger XP gains automatically. When the game saves or reloads, the component preserves the internal timer state to maintain consistent XP timing across sessions.

The component relies on `SkillTreeUpdater:AddSkillXP` to apply the earned experience and properly handle network synchronization between server and clients.

## Usage example
```lua
local inst = ThePlayer
inst:AddComponent("experiencecollector")
-- XP is awarded automatically at the configured period (TUNING.TOTAL_DAY_TIME)
-- The component handles task scheduling and persistence automatically
```

## Dependencies & tags
**Components used:** `skilltreeupdater`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `xp_period` | number | `TUNING.TOTAL_DAY_TIME` | Interval in seconds between XP awards. |

## Main functions
### `SetTask(time)`
*   **Description:** Schedules or reschedules the periodic XP-gain task. Cancels any existing task first.
*   **Parameters:** `time` (number, optional) - If provided, starts the task at this remaining time (used for resuming after save/load or time-dilation).
*   **Returns:** Nothing.

### `UpdateXp()`
*   **Description:** Awards 1 XP to the owning entity via `SkillTreeUpdater:AddSkillXP`. Aborts early if the entity's prefab has no skill tree definition.
*   **Parameters:** None.
*   **Returns:** `nil` if no skill tree definition exists for the prefab.

### `LongUpdate(dt)`
*   **Description:** Adjusts the XP task schedule during large time jumps (e.g., fast-forwarding, paused/unpaused cycles). Ensures XP is awarded for any elapsed intervals that would have been missed.
*   **Parameters:** `dt` (number) - Delta time elapsed since last update.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Returns serialization data for the current task state.
*   **Parameters:** None.
*   **Returns:** Table `{ time = number }` containing the remaining time (in seconds) until the next XP award, or `nil` if no task exists.

### `OnLoad(data)`
*   **Description:** Restores the XP task state using saved data.
*   **Parameters:** `data` (table) - Expected to contain `{ time = number }`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.
