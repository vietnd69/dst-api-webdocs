---
id: marsh_tree
title: Marsh Tree
description: Represents a harvestable tree prefab that yields loot upon chopping and transitions through states (normal, burnt, stump) with associated behaviors and event handling.
tags: [harvest, environment, plant]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: eb1c99e5
system_scope: environment
---

# Marsh Tree

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `marsh_tree` prefab defines a stationary environmental object that can be chopped down, burnt, or dug up as a stump. It integrates with multiple components to manage work actions (`workable`), burning state (`burnable`), loot dropping (`lootdropper`), and inspectability (`inspectable`). It supports full serialization and state persistence via `OnSave`/`OnLoad` hooks, and transitions cleanly between visual and functional states (normal tree → burnt tree → stump).

## Usage example
```lua
local inst = SpawnPrefab("marsh_tree")
inst.Transform:SetPosition(x, y, z)
inst.components.workable:SetWorkLeft(10) -- reset work left if needed
inst.components.lootdropper:SetChanceLootTable('marsh_tree')
```

## Dependencies & tags
**Components used:** `burnable`, `lootdropper`, `workable`, `inspectable`, `propagator`, `hauntable`, `transform`, `animstate`, `dynamicshadow`, `soundemitter`, `minimapentity`, `network`, `physics`
**Tags:** Adds `plant`, `tree`, `burnt`, `stump`; checks `burnt`, `stump`, `playerghost`

## Properties
No public properties.

## Main functions
### `chop_tree(inst, chopper, chops)`
*   **Description:** Triggered during partial chopping; plays chop animation, emits axe sound (unless chopper is a ghost), and initiates sway animation.
*   **Parameters:**  
    `inst` (Entity) - the marsh tree instance  
    `chopper` (Entity or nil) - the actor performing the chop  
    `chops` (number) - amount of work done (unused in current logic)
*   **Returns:** Nothing.

### `set_stump(inst)`
*   **Description:** Converts a marsh tree into a stump by removing high-level components (`workable`, `burnable`, `propagator`, `hauntable`), adding small burnable/propagator/hauntable variants if not already burnt, removing physics colliders, adding the `stump` tag, and updating the minimap icon.
*   **Parameters:** `inst` (Entity) - the marsh tree instance.
*   **Returns:** Nothing.

### `dig_up_stump(inst, chopper)`
*   **Description:** Final dig action on a stump; drops one `log` and removes the stump instance.
*   **Parameters:**  
    `inst` (Entity) - the stump instance  
    `chopper` (Entity or nil) - the actor performing the dig
*   **Returns:** Nothing.

### `chop_down_tree(inst, chopper)`
*   **Description:** Final chop action on a healthy tree; triggers fall sound/animation, calls `set_stump`, drops loot, and reinitializes the stump as a `workable` entity with action `ACTIONS.DIG`.
*   **Parameters:**  
    `inst` (Entity) - the marsh tree instance  
    `chopper` (Entity or nil) - the actor performing the chop
*   **Returns:** Nothing.

### `chop_down_burnt_tree(inst, chopper)`
*   **Description:** Final chop action on a burnt tree; triggers crumble sound/animation, calls `set_stump`, removes physics colliders, schedules self-removal on animation finish, and drops burnt loot.
*   **Parameters:**  
    `inst` (Entity) - the burnt tree instance  
    `chopper` (Entity or nil) - the actor performing the chop
*   **Returns:** Nothing.

### `OnBurnt(inst)`
*   **Description:** Callback executed when the tree is fully burnt. Removes burnable/propagator/hauntable components, adds `hauntable` work variant, replaces loot table with `charcoal`, configures workable to `ACTIONS.CHOP` (renamed to "Dig" on stump) with finish callback `chop_down_burnt_tree`, updates animation and tags.
*   **Parameters:** `inst` (Entity) - the burnt tree instance.
*   **Returns:** Nothing.

### `inspect_tree(inst)`
*   **Description:** Provides a status string for the `inspectable` component based on the tree's current state (`BURNING`, `BURNT`, `CHOPPED`, or `nil`).
*   **Parameters:** `inst` (Entity) - the marsh tree instance.
*   **Returns:** `"BURNING"`, `"BURNT"`, `"CHOPPED"`, or `nil` (if healthy and not burning).

### `onsave(inst, data)`
*   **Description:** Serializes state for network/save sync; records `burnt` and `stump` flags in `data` if the corresponding tags are present.
*   **Parameters:**  
    `inst` (Entity) - the marsh tree instance  
    `data` (table) - the save data table
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Restores the correct state after loading; transitions to stump or burnt mode depending on `data.stump` and `data.burnt` flags.
*   **Parameters:**  
    `inst` (Entity) - the marsh tree instance  
    `data` (table or nil) - the loaded save data
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` (only on burnt tree finish) - triggers `inst.Remove`.
- **Pushes:** None directly (events are handled by components like `lootdropper`).