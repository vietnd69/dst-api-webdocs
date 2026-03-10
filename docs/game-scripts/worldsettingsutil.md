---
id: worldsettingsutil
title: Worldsettingsutil
description: Provides helper utilities for integrating world-setting-based timer control into core gameplay components like ChildSpawner, Spawner, and Pickable.
tags: [timer, world-settings, spawner, pickable]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: a679a7ca
system_scope: world
---

# Worldsettingsutil

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`worldsettingsutil` is a utility module that centralizes boilerplate logic for wiring world-setting-controlled timers into key components (`childspawner`, `spawner`, `pickable`). It abstracts the setup and teardown of `WorldSettingsTimer` instances and exposes standardized callback functions for these components to use when timers are started, stopped, paused, resumed, or queried. This allows world settings to influence timing behavior (e.g., spawn rates, regen periods) without modifying core component logic.

## Usage example
```lua
-- Attaching a timer to a spawner for world-controlled delay:
WorldSettings_Spawner_SpawnDelay(inst, 30, true)

-- Preparing world settings data during world load for a pickable:
WorldSettings_Pickable_PreLoad(inst, data, 60)

-- Starting and stopping the spawn timer for a child spawner manually:
local inst = some_entity
WorldSettings_ChildSpawner_SpawnPeriod(inst, 20, true)
```

## Dependencies & tags
**Components used:** `childspawner`, `pickable`, `spawner`, `worldsettingstimer`
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `WorldSettings_ChildSpawner_SpawnPeriod(inst, spawnperiod, enabled)`
*   **Description:** Configures a timer for the `childspawner`'s spawn period using `WorldSettingsTimer`, allowing external (e.g., world setting) control over spawn rate. Registers callback functions on `childspawner` to delegate timer operations.
*   **Parameters:** `inst` (entity instance), `spawnperiod` (number, total duration in seconds), `enabled` (boolean, whether the timer starts active).
*   **Returns:** Nothing.
*   **Error states:** Asserts if `inst` lacks a `childspawner` component.

### `WorldSettings_ChildSpawner_RegenPeriod(inst, regenperiod, enabled)`
*   **Description:** Configures a timer for the `childspawner`'s regen period using `WorldSettingsTimer`, allowing external control over regeneration rate. Registers callback functions on `childspawner` to delegate timer operations.
*   **Parameters:** `inst` (entity instance), `regenperiod` (number, total duration in seconds), `enabled` (boolean).
*   **Returns:** Nothing.
*   **Error states:** Asserts if `inst` lacks a `childspawner` component.

### `WorldSettings_Spawner_SpawnDelay(inst, startdelay, enabled)`
*   **Description:** Configures a timer for the `spawner`'s initial spawn delay using `WorldSettingsTimer`, enabling world settings to control how long before the first spawn occurs.
*   **Parameters:** `inst` (entity instance), `startdelay` (number, delay in seconds), `enabled` (boolean).
*   **Returns:** Nothing.
*   **Error states:** Asserts if `inst` lacks a `spawner` component.

### `WorldSettings_Pickable_RegenTime(inst, regentime, enabled)`
*   **Description:** Configures a timer for the `pickable` component's regen time using `WorldSettingsTimer`, allowing world settings to influence regrowth duration. Registers callback functions on `pickable` to manage timer lifecycle.
*   **Parameters:** `inst` (entity instance), `regentime` (number, regrowth time in seconds), `enabled` (boolean).
*   **Returns:** Nothing.
*   **Error states:** Asserts if `inst` lacks a `pickable` component.

### `WorldSettings_ChildSpawner_PreLoad(inst, data, spawnperiod_max, regenperiod_max)`
*   **Description:** Prepares serialized timer state data for child spawner timers during world load. Normalizes time values relative to max periods and preserves paused states.
*   **Parameters:** `inst` (entity instance), `data` (table, save data), `spawnperiod_max` (number, maximum spawn period value for normalization), `regenperiod_max` (number, maximum regen period value).
*   **Returns:** Nothing.

### `WorldSettings_Spawner_PreLoad(inst, data, maxstartdelay)`
*   **Description:** Prepares serialized timer state data for spawner's start delay during world load. Normalizes `nextspawntime` relative to `maxstartdelay`.
*   **Parameters:** `inst` (entity instance), `data` (table, save data), `maxstartdelay` (number, maximum start delay value).
*   **Returns:** Nothing.

### `WorldSettings_Pickable_PreLoad(inst, data, maxregentime)`
*   **Description:** Prepares serialized timer state data for pickable's regen time during world load. Uses `pause_time` or `time` values, normalizes them relative to `maxregentime`, and preserves the paused state.
*   **Parameters:** `inst` (entity instance), `data` (table, save data), `maxregentime` (number, maximum regen time value).
*   **Returns:** Nothing.

### `WorldSettings_Timer_PreLoad(inst, data, timername, maxtimeleft)`
*   **Description:** Copies existing timer data from a legacy `timer` component into the `worldsettingstimer` structure and normalizes `timeleft` to a maximum.
*   **Parameters:** `inst` (entity instance), `data` (table, save data), `timername` (string, name of the timer), `maxtimeleft` (number, normalization factor).
*   **Returns:** Nothing.

### `WorldSettings_Timer_PreLoad_Fix(inst, data, timername, maxmultiplier)`
*   **Description:** Ensures the normalized time value does not exceed `maxmultiplier`, acting as a sanity check/override after `WorldSettings_Timer_PreLoad`.
*   **Parameters:** `inst` (entity instance), `data` (table, save data), `timername` (string), `maxmultiplier` (number).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `externaltimerfinished` (internal handler): Used by `spawner` timer to detect timer completion.
- **Pushes:** No events.
