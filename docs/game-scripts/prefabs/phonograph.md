---
id: phonograph
title: Phonograph
description: A furniture item that plays music and automatically tends nearby farm plants when active.
tags: [furniture, audio, farm, crafting]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 911e07cd
system_scope: crafting
---

# Phonograph

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `phonograph` prefab is a functional furniture item that serves as a record player. It accepts `phonograph_record` items via its `inventory` and `trader` components, plays music when turned on, and periodically tends to nearby tendable farm plants (those with the `tendable_farmplant` tag) within range. It integrates with multiple components including `machine`, `inventory`, `lootdropper`, and `workable` to handle state, item interactions, destruction, and save/load behavior.

## Usage example
```lua
-- Create a phonograph entity and verify it accepts records
local inst = SpawnPrefab("phonograph")
inst.Transform:SetPosition(x, y, z)

-- Insert a record manually (e.g., via code)
local record = SpawnPrefab("record")
record.songToPlay = "dontstarve/music/gramaphone_loop"
inst.components.inventory:GiveItem(record)

-- Phonograph auto-turns on when a record is placed and inventory is non-empty
-- To manually toggle:
inst.components.machine:TurnOn()
inst.components.machine:TurnOff()
```

## Dependencies & tags
**Components used:** `furnituredecor`, `inspectable`, `inventory`, `inventoryitem`, `lootdropper`, `machine`, `trader`, `workable`  
**Tags added:** `structure`, `trader`, `recordplayer`, `furnituredecor`  
**Tags checked:** `phonograph_record`, `tendable_farmplant`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `DropRecord` | function | — | Callback used to drop all inventory items and turn off the machine. |
| `OnHammered` | function | — | Handles destruction when hammered, dropping loot and spawning debris FX. |
| `ShouldAcceptItem` | function | — | Validates whether an item (specifically records) can be inserted. |
| `OnGetItemFromPlayer` | function | — | Called when a record is accepted; turns on the machine and plays animation. |
| `GetRecordSong` | function | — | Retrieves the song filename from the first record in inventory. |
| `TryToPlayRecord` | function | — | Attempts to play the record if one is present and the phonograph is not held. |
| `StopPlayingRecord` | function | — | Stops playback, cancels tasks, and emits end sound. |
| `TurnOffMachine` | function | — | Safely turns off the machine component. |
| `OnPutInInventory` | function | — | Turns off machine when picked up. |
| `OnDroppedFromInventory` | function | — | Enables machine if inventory contains items. |
| `OnLoad` | function | — | Restores machine state on world load. |
| `enabled` (machine) | boolean | `false` | Controls whether the phonograph may play music. |

## Main functions
### `DropRecord(inst)`
*   **Description:** Dumps all items currently stored in the phonograph's inventory and disables the machine. Typically called before destruction or upon removal from inventory.
*   **Parameters:** `inst` (Entity) — the phonograph instance.
*   **Returns:** Nothing.
*   **Error states:** None.

### `OnHammered(inst, worker)`
*   **Description:** Destroys the phonograph when hammered, drops loot, creates collapse FX, and removes the entity.
*   **Parameters:**  
    - `inst` (Entity) — the phonograph instance.  
    - `worker` (Entity) — the entity performing the hammering (unused internally).
*   **Returns:** Nothing.

### `ShouldAcceptItem(inst, item)`
*   **Description:** Validates whether an item can be inserted. Only returns `true` for items tagged `phonograph_record`.
*   **Parameters:**  
    - `inst` (Entity) — the phonograph instance.  
    - `item` (Entity) — the item being inserted.
*   **Returns:** `true` if `item:HasTag("phonograph_record")`, otherwise `nil`.

### `OnGetItemFromPlayer(inst, giver, item)`
*   **Description:** Called when the trader component accepts an item (i.e., a record). Drops any existing record first, gives the new item, animates "open", and turns on the machine if not already on.
*   **Parameters:**  
    - `inst` (Entity) — the phonograph instance.  
    - `giver` (Entity) — the player inserting the record.  
    - `item` (Entity) — the record being inserted.
*   **Returns:** Nothing.

### `GetRecordSong(inst)`
*   **Description:** Retrieves the song filename from the first `phonograph_record` in the inventory. Prefers `songToPlay_skin` if present, otherwise uses `songToPlay`.
*   **Parameters:** `inst` (Entity) — the phonograph instance.
*   **Returns:** `string` or `nil` — the song filename if a record is present, else `nil`.

### `TryToPlayRecord(inst)`
*   **Description:** Attempts to start playback. Enables the machine if a valid record is present and the phonograph is not held. Cancels previous tasks and schedules playback after zero delay.
*   **Parameters:** `inst` (Entity) — the phonograph instance.
*   **Returns:** Nothing.
*   **Error states:** Returns early and disables `machine.enabled` if no record is found or if `inventoryitem:IsHeld()` is true.

### `StopPlayingRecord(inst)`
*   **Description:** Stops playback, cancels pending and periodic tasks, resets animation to idle, kills the playback sound, emits an end sound, and pushes `turnedoff` event.
*   **Parameters:** `inst` (Entity) — the phonograph instance.
*   **Returns:** Nothing.

### `TurnOffMachine(inst)`
*   **Description:** Calls `machine:TurnOff()` if the component exists.
*   **Parameters:** `inst` (Entity) — the phonograph instance.
*   **Returns:** Nothing.

### `OnPutInInventory(inst, owner)`
*   **Description:** Ensures the phonograph is turned off when placed into a player's inventory.
*   **Parameters:**  
    - `inst` (Entity) — the phonograph instance.  
    - `owner` (Entity) — the inventory owner.
*   **Returns:** Nothing.

### `OnDroppedFromInventory(inst)`
*   **Description:** Enables machine functionality when dropped from inventory *if* the phonograph contains at least one item.
*   **Parameters:** `inst` (Entity) — the phonograph instance.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores machine state on load: enables machine if inventory contains items (restore state after deserialization).
*   **Parameters:**  
    - `inst` (Entity) — the phonograph instance.  
    - `data` (table) — save data (unused).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** —  
- **Pushes:** `turnedoff` — fired by `StopPlayingRecord` when playback ends.  
- **Triggers (via components):** `machineturnedon`, `machineturnedoff` (via `machine`), `entity_droploot` (via `lootdropper:DropLoot`).