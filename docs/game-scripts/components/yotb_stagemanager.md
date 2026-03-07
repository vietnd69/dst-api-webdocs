---
id: yotb_stagemanager
title: Yotb Stagemanager
description: Manages the lifecycle and state of contest stages in a structured world progression system, including stage registration, contest activation, and save/load synchronization.
tags: [progression, boss, world, save, event]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: e5bb1204
system_scope: world
---

# Yotb Stagemanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`YOTB_StageManager` coordinates the progression of contest stages in the game world — tracking registered stages, enabling/disabling contest participation, and managing active contest state. It listens for stage-related and contest lifecycle events, integrates with the `yotb_stager` component, and persists state via the world save/load system. Typically attached to the world entity (`TheWorld`), it orchestrates transitions between idle, contest-enabled, and active-contest phases.

## Usage example
```lua
-- Add the component to the world (commonly done during world initialization)
TheWorld:AddComponent("yotb_stagemanager")

-- Enable the contest (creates the contest-enabled state for stages)
TheWorld.components.yotb_stagemanager:EnableContest()

-- Check current contest status
if TheWorld.components.yotb_stagemanager:IsContestActive() then
    print("Contest is currently active!")
end
```

## Dependencies & tags
**Components used:** `yotb_stager` (via `stage.components.yotb_stager`)
**Tags:** Adds `yotb_contestenabled`, `yotb_conteststartable`, `nomagic` to the stager entity when contest is enabled (as delegated to `yotb_stager:EnableContest()`). No tags are managed directly by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stages` | table | `{}` | List of registered stage entities. |
| `wanderingtraders` | table | `{}` | Set of registered wandering trader entities. |
| `contest_enabled` | boolean | `false` | Whether the contest can be started (global flag). |
| `contest_active` | boolean | `false` | Whether a contest is currently running. |
| `save_contest` | boolean | `false` | Whether the current contest state should be saved. |
| `active_stage` | entity or `nil` | `nil` | The currently active stage entity during a contest. |
| `host_visible` | boolean or `nil` | `nil` | Controls visibility of wandering traders (client-side hint). |

## Main functions
### `RegisterWanderingTrader(wanderingtrader)`
* **Description:** Registers a wandering trader entity for lifecycle tracking; listens for its `onremove` event to auto-unregister.
* **Parameters:** `wanderingtrader` (entity) — The wandering trader prefab instance.
* **Returns:** Nothing.

### `UnregisterWanderingTrader(wanderingtrader)`
* **Description:** Removes a wandering trader from tracking.
* **Parameters:** `wanderingtrader` (entity).
* **Returns:** Nothing.

### `OnStageBuilt(stage)`
* **Description:** Registers a new stage; attaches event listeners for contest lifecycle events and enables/disables the stage’s `yotb_stager` component based on global `contest_enabled` state.
* **Parameters:** `stage` (entity) — The stage entity to register.
* **Returns:** Nothing.

### `OnStageDestroyed(stage)`
* **Description:** Unregisters a stage and removes its event listeners.
* **Parameters:** `stage` (entity).
* **Returns:** Nothing.

### `EnableContest()`
* **Description:** Activates the global contest-enabled state and calls `yotb_stager:EnableContest()` on all valid registered stages. Skipped if a contest is already active.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if `contest_active` is `true`.

### `OnContestBegun(active_stage)`
* **Description:** Marks the start of a contest with the given stage, disables contest on all other stages, and fires the `yotb_conteststarted` event.
* **Parameters:** `active_stage` (entity).
* **Returns:** Nothing.

### `OnContestEnded()`
* **Description:** Terminates the active contest, resets internal state (`active_stage`, `save_contest`), and fires `yotb_contestfinished`.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetHostVisible(visible)`
* **Description:** Sets the host-visible flag and broadcasts `wanderingtrader_hide` or `wanderingtrader_show` to all registered traders.
* **Parameters:** `visible` (boolean).
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes current state (`contest_enabled`, `contest_active`, stage GUIDs) for world save.
* **Parameters:** None.
* **Returns:** Two values: `data` (table with serialized flags and stage GUIDs), `ents` (list of stage GUIDs to be saved as entities).

### `LoadPostPass(newents, savedata)`
* **Description:** Restores stages and state after world load; re-enables contest if applicable.
* **Parameters:** `newents` (table mapping GUID → entity), `savedata` (table from `OnSave()`).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `yotb_onstagebuilt` — triggers `OnStageBuilt()` with `data.stage`.
  - `yotb_onabortcontest` — resets `contest_active` and `active_stage`.
  - `yotb_oncontestfinshed` — triggers `OnContestEnded()`.
  - `wanderingtrader_created` — registers new trader via `RegisterWanderingTrader()`.
  - `onremove` (on stages and traders) — unregisters stage or trader.
- **Pushes:**
  - `yotb_contestenabled` — fired after `EnableContest()` succeeds.
  - `yotb_conteststarted` — fired after `OnContestBegun()`.
  - `yotb_contestfinished` — fired after `OnContestEnded()`.
  - `wanderingtrader_hide` / `wanderingtrader_show` — fired by `SetHostVisible()`.

> **Note:** Internally, stage-specific event callbacks (`conteststarted`, `contestcheckpoint`, `onremove`) are attached during `OnStageBuilt()` and removed during `OnStageDestroyed()` to ensure proper cleanup and prevent dangling references.
