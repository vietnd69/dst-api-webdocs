---
id: autosaver
title: Autosaver
description: Manages the game's automatic saving process, coordinating save states and rollbacks between the master and secondary shards.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: world
source_hash: f109226b
---

# Autosaver

## Overview
The Autosaver component is a world-level system responsible for managing the automatic saving of the game state. It operates differently depending on whether it's on the master shard or a secondary shard. On the master shard, it initiates saves, typically triggered by world state changes like the day-night cycle. On secondary shards, it listens for save commands from the master and synchronizes its state, triggering a rollback if it falls too far out of sync. This component also controls the "Saving..." indicator on the player's HUD.

## Dependencies & Tags
None identified.

## Properties
| Property | Type           | Default Value                                | Description                          |
|----------|----------------|----------------------------------------------|--------------------------------------|
| `inst`   | `EntityInstance` | The entity instance this component is attached to. | A reference to the owner entity. |

## Main Functions
### `GetLastSaveTime()`
* **Description:** Returns the `GetTime()` timestamp of the last successful save on the current shard.
* **Parameters:** None.

## Events & Listeners
*   **Listens for `issavingdirty`:** Triggers when the networked `_issaving` variable changes. This function is responsible for showing or hiding the "Saving..." indicator on the player's HUD. On non-master simulations, it also triggers the local save process.
*   **Listens for `ms_save` (on `TheWorld`):**
    *   On the **master shard**, this event initiates the entire world save process.
    *   On a **secondary shard**, this event sends a request to the master shard to begin a save.
*   **Listens for `ms_setautosaveenabled` (on `TheWorld`):** On the master shard, this event toggles the autosave functionality. When enabled, it starts watching the world's `cycles` (day/night) to trigger saves automatically.
*   **Listens for `secondary_autosaverupdate` (on `TheWorld`):** On secondary shards, this event is received from the master shard and contains the latest save snapshot information. The secondary shard uses this data to either perform its own save to match the master or, if it's too far out of sync, trigger a rollback to the master's state.
*   **Pushes `master_autosaverupdate`:** After initiating a save, the master shard pushes this event to all secondary shards, broadcasting its current save snapshot to ensure all servers remain synchronized.