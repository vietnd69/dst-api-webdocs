---
id: pirate_flag_pole
title: Pirate Flag Pole
description: Implements the pirate flag pole structure, managing its visual animation, burnable behavior, loot drops, and flag number assignment.
tags: [structure, environment, burnable]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c46bcb6c
system_scope: environment
---

# Pirate Flag Pole

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `pirate_flag_pole` prefab implements a decorative structure that holds a flag with a randomly assigned number. It integrates the `workable`, `burnable`, and `lootdropper` components to support hammering, burning, and loot generation. The flag animation cycles through idle states and responds to entity wake/sleep events. It also persists the selected flag number and burn state across saves.

## Usage example
```lua
-- The prefab is instantiated automatically via the game engine during world generation or crafting.
-- Modders typically do not need to manually create this prefab, but can extend its behavior via prefabs/overrides:
local custom_flag = Prefab("my_custom_flag_pole", function()
    local inst = Prefab("pirate_flag_pole")
    -- modify or extend behavior here (e.g., override callback)
    return inst
end)
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `burnable`, `inspectable`
**Tags:** Adds `structure`; checks `burnt`, `burnable`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `flag_number` | string or nil | `nil` initially | Unique identifier for the flag (e.g., `"02"`, `"04"`) used to select the correct flag texture symbol. |
| `flagtask` | Task or nil | `nil` | Reference to the periodic task handling idle animation cycling. |

## Main functions
### `onhammered(inst)`
*   **Description:** Handles hammering completion by dropping loot, spawning a collapse FX, and removing the entity.
*   **Parameters:** `inst` (Entity) — The pirate flag pole instance.
*   **Returns:** Nothing.
*   **Error states:** None.

### `onhit(inst)`
*   **Description:** Plays the "hit" animation when the structure is being worked on, unless it is burnt.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `onbuilt(inst)`
*   **Description:** Plays the "place" animation and emits a sound when the structure is constructed.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `onburnt(inst)`
*   **Description:** Cancels the idle animation task and calls `DefaultBurntStructureFn` to transition to the burnt state.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `onignite(inst)`
*   **Description:** Calls `DefaultBurnFn` to initiate burning.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `flagidletask(inst)`
*   **Description:** Creates and schedules a repeating task that randomly alternates between `idle2` and `idle3` animations while the entity is awake.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `setflagnumber(inst, number)`
*   **Description:** Assigns and applies a flag texture based on `flag_number`. If `number` is nil, assigns a random flag (`01`–`04`).
*   **Parameters:** `inst` (Entity), `number` (string or nil).
*   **Returns:** Nothing.

### `onsave(inst, data)`
*   **Description:** Serializes burn state and `flag_number` into the save data table.
*   **Parameters:** `inst` (Entity), `data` (table).
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Restores burnt state or `flag_number` from save data upon entity load.
*   **Parameters:** `inst` (Entity), `data` (table or nil).
*   **Returns:** Nothing.

### `OnEntitySleep(inst)`
*   **Description:** Cancels the idle animation task when the entity goes to sleep.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnEntityWake(inst)`
*   **Description:** Restarts the idle animation task when the entity wakes up.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` — triggers the `onbuilt` callback to play placement animation and sound.
- **Pushes:** None directly; relies on engine events for save/load and entity lifecycle (e.g., `OnSave`, `OnLoad`, `OnEntitySleep`, `OnEntityWake`).