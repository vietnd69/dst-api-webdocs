---
id: experiencecollector
title: Experiencecollector
description: Periodically awards experience points to characters based on their prefab's skill tree definition.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: b1edac6a
---

# Experiencecollector

## Overview
This component manages timed experience (XP) accumulation for playable characters. It schedules periodic tasks that grant 1 XP per cycle (matching the configured period) to entities that have a matching skill tree definition in `skilltree_defs`. It also implements save/load compatibility via `OnSave`/`OnLoad` and handles long update intervals (e.g., world desyncs or lag) via `LongUpdate`.

## Dependencies & Tags
- Relies on `self.inst.components.skilltreeupdater` being present (expects a `AddSkillXP` method).
- Relies on `skilltreedefs.SKILLTREE_DEFS[self.inst.prefab]` existing (checks for a valid skill tree definition for the entity's prefab).
- No components are explicitly added or tags set in this script.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (assigned via constructor) | The entity instance this component is attached to. |
| `xp_period` | `number` | `TUNING.TOTAL_DAY_TIME` | Time interval (in seconds) between XP grants. |
| `xpgeneration_task` | `Task?` | `nil` | Internal periodic task that triggers `UpdateXp()`. Stored on `inst` for persistence. |

## Main Functions

### `SetTask(time)`
* **Description:** Cancels any existing XP generation task and schedules a new one, using the current `xp_period`. If `time` is provided, it schedules the task to trigger after that many seconds; otherwise, it starts immediately.
* **Parameters:**
  * `time` (`number`, optional): Delay (in seconds) until the next XP grant. Defaults to immediate if omitted.

### `UpdateXp()`
* **Description:** Awards 1 XP to the entity’s skill tree (if the entity has a defined skill tree in `skilltreedefs`). Does nothing if no skill tree is defined for the entity’s prefab.
* **Parameters:** None.

### `LongUpdate(dt)`
* **Description:** Adjusts the XP schedule after a long time step (e.g., world pause/unpause or lag). Computes how many XP periods fit into the elapsed time, grants XP accordingly, and reschedules the next task to maintain accurate timing.
* **Parameters:**
  * `dt` (`number`): Elapsed real time (in seconds) since the last update.

### `OnSave()`
* **Description:** Returns a table containing the remaining time (in seconds) on the current XP task, used for saving game state.
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Restores the XP task state after loading. Uses the saved `time` value to reschedule the next XP grant at the correct offset.
* **Parameters:**
  * `data` (`table`): Loaded data table, expected to contain a `time` field (`number`).

## Events & Listeners
None.