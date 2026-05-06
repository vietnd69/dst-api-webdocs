---
id: phonograph
title: Phonograph
description: Defines the Phonograph prefab, a decorative machine that plays music records and tends nearby farm plants.
tags: [prefab, decor, music, farming]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 217eb121
system_scope: entity
---

# Phonograph

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
The `phonograph` prefab defines a decorative structure capable of playing music records. When active, it emits sound and periodically tends to nearby farm plants within a specific range. It functions as a trader accepting record items, and can be destroyed via hammering to drop loot and spawn collapse effects.

## Usage example
```lua
-- Spawn a phonograph in the world
local phonograph = SpawnPrefab("phonograph")

-- Check if it is currently enabled
local is_enabled = phonograph.components.machine.enabled

-- Manually trigger record playback logic if a record is inserted
phonograph:TryToPlayRecord()

-- Force stop playing and turn off machine
phonograph:StopPlayingRecord()
```

## Dependencies & tags
**External dependencies:**
- `TUNING` -- accesses `PHONOGRAPH_TEND_RANGE` and `PHONOGRAPH_PLAY_TIME`
- `ACTIONS` -- references `HAMMER` action for workable component
- `SpawnPrefab` -- spawns `collapse_small` fx on destruction

**Components used:**
- `inventory` -- manages inserted record items via `DropEverything`, `GiveItem`, `NumItems`, `GetItemsWithTag`
- `inventoryitem` -- checks ownership via `IsHeld`, sets put/drop callbacks
- `machine` -- controls power state via `TurnOn`, `TurnOff`, `IsOn`, `enabled`
- `lootdropper` -- spawns loot via `DropLoot` on hammer
- `trader` -- handles item acceptance via `SetAcceptTest`, `onaccept`
- `workable` -- configures hammering via `SetWorkAction`, `SetOnFinishCallback`
- `furnituredecor` -- marks entity as decorative furniture
- `inspectable` -- allows player inspection
- `hauntable` -- enables ghost haunting interactions

**Tags:**
- `structure` -- added on creation
- `trader` -- added on creation
- `recordplayer` -- added on creation
- `furnituredecor` -- added on creation
- `groundonlymachine` -- added on creation
- `tendable_farmplant` -- checked via `FindEntities` for farming effect
- `phonograph_record` -- checked via `HasTag`/`GetItemsWithTag` for record validation

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `components.machine.enabled` | boolean | `false` | Determines if the machine is allowed to operate and play songs. |
| `_play_song_task` | taskref | `nil` | Internal reference to the delayed task playing the song. |
| `_stop_song_task` | taskref | `nil` | Internal reference to the task scheduled to stop the song. |
| `_tend_update_task` | taskref | `nil` | Internal reference to the periodic task tending nearby plants. |

## Main functions
### `DropRecord()`
*   **Description:** Drops the current record item from inventory and disables the machine. Called when inserting a new record or removing the old one.
*   **Parameters:** None
*   **Returns:** None
*   **Error states:** Errors if `components.machine` or `components.inventory` is missing (no nil guard present).

### `OnHammered(worker)`
*   **Description:** Callback executed when the phonograph is hammered. Drops loot, spawns collapse fx, and removes the entity.
*   **Parameters:**
    - `worker` -- The entity performing the hammer action.
*   **Returns:** None
*   **Error states:** Errors if `components.lootdropper` is missing (nil dereference). May crash if `collapse_small` prefab does not exist (fx would be nil before Transform access).

### `ShouldAcceptItem(item)`
*   **Description:** Test function for the trader component to validate if an item can be inserted.
*   **Parameters:**
    - `item` -- The item entity being offered.
*   **Returns:** `true` if item has `phonograph_record` tag, otherwise `nil`.
*   **Error states:** None

### `OnGetItemFromPlayer(giver, item)`
*   **Description:** Callback when a player successfully trades a record to the phonograph. Drops existing record, accepts new one, and turns machine on.
*   **Parameters:**
    - `giver` -- The player entity giving the item.
    - `item` -- The record item entity.
*   **Returns:** None
*   **Error states:** Errors if `components.inventory` or `components.machine` is missing.

### `GetRecordSong()`
*   **Description:** Retrieves the song identifier from the currently held record item.
*   **Parameters:** None
*   **Returns:** String song name or `nil` if no record is found.
*   **Error states:** Errors if `components.inventory` is missing.

### `TryToPlayRecord()`
*   **Description:** Attempts to start playing the record. Checks if held and if a song exists. Enables machine and starts animation/tasks.
*   **Parameters:** None
*   **Returns:** None
*   **Error states:** Errors if `components.inventoryitem`, `components.machine`, or `AnimState` is missing.

### `StopPlayingRecord()`
*   **Description:** Stops the current song, cancels tasks, resets animation, and plays stop sound. Pushes `turnedoff` event.
*   **Parameters:** None
*   **Returns:** None
*   **Error states:** Errors if `SoundEmitter` or `AnimState` is missing.

### `TurnOffMachine()`
*   **Description:** Helper function to safely turn off the machine component.
*   **Parameters:** None
*   **Returns:** None
*   **Error states:** None

### `OnPutInInventory(owner)`
*   **Description:** Callback when the phonograph itself is picked up. Turns off the machine if it was playing.
*   **Parameters:**
    - `owner` -- The entity picking up the phonograph.
*   **Returns:** None
*   **Error states:** Errors if `components.machine` is missing.

### `OnDroppedFromInventory()`
*   **Description:** Callback when the phonograph is dropped from inventory. Re-enables machine if inventory has items.
*   **Parameters:** None
*   **Returns:** None
*   **Error states:** Errors if `components.inventory` or `components.machine` is missing.

### `OnLoad(data)`
*   **Description:** Load callback to restore machine enabled state based on inventory contents.
*   **Parameters:**
    - `data` -- Save data table (unused in logic but required signature).
*   **Returns:** None
*   **Error states:** Errors if `components.inventory` or `components.machine` is missing.

## Events & listeners
- **Listens to:** None directly via `ListenForEvent`. Relies on component callbacks (`inventoryitem`, `machine`, `workable`, `trader`).
- **Pushes:** `turnedoff` - Fired when `StopPlayingRecord` completes the shutdown sequence.