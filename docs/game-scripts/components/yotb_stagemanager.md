---
id: yotb_stagemanager
title: Yotb Stagemanager
description: Manages game stages, contest logic, and wandering trader interactions for the Yotb mod in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: e5bb1204
---

# Yotb Stagemanager

## Overview
This component acts as the central coordinator for stage-based contests within the Yotb mod. It tracks registered stages, controls the activation and deactivation of contest logic per stage, manages wandering trader visibility, and handles saving/loading of contest state across game sessions. It operates on the world entity (`TheWorld`) and integrates with the DST world state and event systems.

## Dependencies & Tags
- Relies on `yotb_stager` component being present on stage entities (used in `OnStageBuilt` via `v.components.yotb_stager:EnableContest()`).
- Listens to and dispatches custom mod events (e.g., `yotb_onstagebuilt`, `yotb_contestenabled`, `yotb_conteststarted`, `yotb_contestfinished`, `wanderingtrader_created`, `onremove`, `yotb_onabortcontest`, `yotb_oncontestfinshed`).
- Watches the `cycles` world state to trigger daily logic.
- Registers callbacks on stage entities for `conteststarted`, `contestcheckpoint`, `onremove`, and `contestfinished` (currently commented out).
- No tags are added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the world entity the component is attached to. |
| `stages` | `table` | `{}` | List of registered stage entities. |
| `wanderingtraders` | `table` | `{}` | Map of registered wandering trader entities. |
| `contest_enabled` | `boolean` | `false` | Whether contest logic is currently enabled globally. |
| `contest_active` | `boolean` | `false` | Whether a contest is currently in progress. |
| `save_contest` | `boolean` | `false` | Flag indicating whether the current contest state should be persisted on save. |
| `active_stage` | `Entity?` | `nil` | The stage currently hosting the active contest. |
| `host_visible` | `boolean?` | `nil` | Controls wandering trader visibility state (only set via `SetHostVisible`). |

## Main Functions

### `:RegisterWanderingTrader(wanderingtrader)`
* **Description:** Registers a wandering trader entity for visibility management and sets up a listener to automatically unregister it when the trader is removed.  
* **Parameters:**  
  - `wanderingtrader` (`Entity`): The wandering trader entity to register.

### `:UnregisterWanderingTrader(wanderingtrader)`
* **Description:** Removes a wandering trader from the registry, typically invoked automatically via `onremove` event.  
* **Parameters:**  
  - `wanderingtrader` (`Entity`): The wandering trader entity to unregister.

### `:OnNewDay()`
* **Description:** Called at the start of each new day. If neither contest nor contest enabling is active, it automatically calls `EnableContest()`.  
* **Parameters:** None.

### `:OnStageBuilt(stage)`
* **Description:** Registers a new stage, adds it to the internal stages list, and sets up event listeners for contest lifecycle events (`conteststarted`, `contestcheckpoint`, `onremove`). If contests are enabled, it immediately activates contest mode on the stage’s `yotb_stager` component.  
* **Parameters:**  
  - `stage` (`Entity`): The newly built stage entity.

### `:OnStageDestroyed(stage)`
* **Description:** Cleans up stage tracking and removes all event callbacks associated with the stage. Removes the stage from the internal `stages` list.  
* **Parameters:**  
  - `stage` (`Entity`): The destroyed stage entity.

### `:OnContestCheckPoint(stage)`
* **Description:** Sets the `save_contest` flag to `true`, ensuring the current contest state will be persisted during save.  
* **Parameters:**  
  - `stage` (`Entity`): The stage that triggered the contest checkpoint.

### `:SetHostVisible(visible)`
* **Description:** Updates and synchronizes the visibility of all registered wandering traders. Pushes `wanderingtrader_hide` or `wanderingtrader_show` events to them as appropriate.  
* **Parameters:**  
  - `visible` (`boolean`): `true` to show traders, `false` to hide them.

### `:EnableContest()`
* **Description:** Enables contest mode globally across all valid registered stages. Has no effect if a contest is already active. Fires the `yotb_contestenabled` event upon success.  
* **Parameters:** None.

### `:OnContestBegun(active_stage)`
* **Description:** Marks a contest as active, stores the current stage, disables contest mode on all other stages, and fires the `yotb_conteststarted` event.  
* **Parameters:**  
  - `active_stage` (`Entity`): The stage where the contest has begun.

### `:OnContestEnded()`
* **Description:** Resets the active contest state, clears `save_contest`, unsets the active stage, and fires the `yotb_contestfinished` event.  
* **Parameters:** None.

### `:OnSave()`
* **Description:** Prepares and returns save data for the component, including stage GUIDs, contest status, and whether the contest should be persisted. Returns two values: the data table and a list of entity GUIDs to persist.  
* **Parameters:** None.  
* **Returns:**  
  - `data` (`table`): Contains `contest_enabled`, `contest_active`, and `stages` (array of GUIDs).  
  - `ents` (`table`): List of GUIDs for stages to persist.

### `:LoadPostPass(newents, savedata)`
* **Description:** Reconstructs the component state after a save is loaded. Re-registers stages using `OnStageBuilt`, restores contest flags, and re-enables contests if needed.  
* **Parameters:**  
  - `newents` (`table`): Map of GUIDs to loaded entities.  
  - `savedata` (`table`): Saved component data (from `OnSave`).  

## Events & Listeners
- **Listens for:**
  - `yotb_onstagebuilt` → calls `OnStageBuilt(stage)` (via anonymous callback).
  - `yotb_onabortcontest` → resets `contest_active` and `active_stage`.
  - `yotb_oncontestfinshed` → calls `OnContestEnded()`.
  - `wanderingtrader_created` → calls `RegisterWanderingTrader(wanderingtrader)`.
- **Listens per-stage (in `OnStageBuilt`):**
  - `conteststarted` → calls `conteststarted(stage)` (local hook → `OnContestBegun`).
  - `contestcheckpoint` → calls `contestcheckpoint(stage)` (local hook → `OnContestCheckPoint`).
  - `onremove` → calls `stageremoved(stage)` (local hook → `OnStageDestroyed`).
- **Listens to world state:**
  - `cycles` → calls `OnNewDay()` (via `WatchWorldState`).
- **Pushes:**
  - `yotb_contestenabled`
  - `yotb_conteststarted`
  - `yotb_contestfinished`
  - `wanderingtrader_hide` / `wanderingtrader_show` (on wandering traders when visibility changes).