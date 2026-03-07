---
id: boat_rotator
title: Boat Rotator
description: Provides the logic and interaction handling for the Boat Rotator structure in DST, including workability, burnability, and loot dropping on destruction.
tags: [structure, workable, burnable, environment]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9742dd3b
system_scope: environment
---

# Boat Rotator

> Based on game build **714004** | Last updated: 2026-03-04

## Overview
The `boat_rotator` prefab implements a rotateable steering wheel structure used to control the direction of the player's boat. It is added as a component to the entity and integrates with the `workable`, `burnable`, `lootdropper`, and `Inspectable` components. The component handles construction (`onbuilt`), hammering (`on_hammered`), ignition (`onignite`), and burning (`onburnt`) events, and properly saves and loads state across sessions.

## Usage example
```lua
local inst = SpawnPrefab("boat_rotator")
inst.Transform:SetPosition(x, y, z)
inst:PushEvent("onbuilt")
```

## Dependencies & tags
**Components used:** `boatrotator`, `lootdropper`, `workable`, `burnable`, `inspectable`, `propagator`, `hauntable`, `soundemitter`, `animstate`, `transform`, `network`  
**Tags:** Adds `structure` to the entity; checks `burnt` and `structure`.

## Properties
No public properties.

## Main functions
This component does not expose standalone functions beyond event callbacks used internally. All logic resides in the prefab factory function (`fn`) and associated event handlers.

### Event handlers
The following callbacks are registered during construction and used internally:

#### `on_hammered(inst, hammerer)`
*   **Description:** Called when the structure is fully hammered. Destroys the entity, spawns a `collapse_small` FX, and drops loot via `lootdropper`.
*   **Parameters:** `inst` (entity) — the Boat Rotator instance; `hammerer` (entity or nil) — the player who hammered it.
*   **Returns:** Nothing.

#### `onignite(inst)`
*   **Description:** Called when the structure catches fire. Delegates to `DefaultBurnFn` to start the burn sequence.
*   **Parameters:** `inst` (entity) — the Boat Rotator instance.
*   **Returns:** Nothing.

#### `onburnt(inst)`
*   **Description:** Called when the structure finishes burning. Invokes `DefaultBurntStructureFn` to finalize burning state, then removes the `boatrotator` component.
*   **Parameters:** `inst` (entity) — the Boat Rotator instance.
*   **Returns:** Nothing.

#### `onbuilt(inst)`
*   **Description:** Called when the structure is placed by a player. Plays a sound and sets the animation state to `"place"`.
*   **Parameters:** `inst` (entity) — the Boat Rotator instance.
*   **Returns:** Nothing.

#### `onsave(inst, data)`
*   **Description:** Saves whether the structure is currently burning or burnt into the save data.
*   **Parameters:** `inst` (entity); `data` (table) — the save data table.
*   **Returns:** Nothing.

#### `onload(inst, data)`
*   **Description:** Restores burning state on load. If saved as burnt, directly calls `onburnt` callback.
*   **Parameters:** `inst` (entity); `data` (table or nil) — the loaded save data.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` — triggers `onbuilt` callback to play sound and set animation.
- **Pushes:** None directly. Relies on underlying components (`burnable`, `workable`, `lootdropper`) to emit their own events as needed.
- **Persisted state events:** `OnSave`, `OnLoad` — attached to the entity for serialization/deserialization.