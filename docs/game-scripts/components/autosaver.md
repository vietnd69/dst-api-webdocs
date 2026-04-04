---
id: autosaver
title: Autosaver
description: Manages automatic world saving intervals and shard synchronization states.
tags: [network, save, world]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: components
source_hash: f109226b
system_scope: world
---

# Autosaver

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
The `Autosaver` component handles the logic for automatic world saving, including timing, network replication of save states, and synchronization between master and secondary shards. It manages rollback procedures if snapshot data diverges and updates the player HUD during save operations. This component is primarily internal to the engine simulation lifecycle and interacts heavily with `TheNet` and `TheWorld` globals.

## Usage example
```lua
-- Typically attached internally to the world entity
local world = TheWorld
if world.components.autosaver then
    local last_save = world.components.autosaver:GetLastSaveTime()
    print("Last save occurred at time: " .. tostring(last_save))
end
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `GetLastSaveTime()`
*   **Description:** Returns the simulation time timestamp of the last successful save operation.
*   **Parameters:** None.
*   **Returns:** `number` - The time value recorded during the last save.
*   **Error states:** Returns `nil` or initial start time if no save has completed yet.

## Events & listeners
-   **Listens to:** `issavingdirty` - Triggers HUD updates when the network save variable changes.
-   **Listens to:** `ms_save` (on `TheWorld`) - Initiates the save process on master simulation.
-   **Listens to:** `ms_setautosaveenabled` (on `TheWorld`) - Toggles the autosave enabled state.
-   **Listens to:** `secondary_autosaverupdate` (on `TheWorld`) - Handles snapshot synchronization on secondary shards.
-   **Pushes:** `master_autosaverupdate` (on `TheWorld`) - Notifies other systems of snapshot updates during save.