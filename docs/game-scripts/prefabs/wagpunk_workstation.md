---
id: wagpunk_workstation
title: Wagpunk Workstation
description: A crafting and prototyping station prefab for the Wagpunk event that provides access to specialized blueprints and toggles arena manager state.
tags: [crafting, event, wagpunk, station, prototype]
sidebar_position: 10
last_updated: 2026-04-18
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 956cf88a
system_scope: crafting
---

# Wagpunk Workstation

> Based on game build **722832** | Last updated: 2026-04-18

## Overview
`wagpunk_workstation` is a stationary crafting structure used during the Wagpunk event. It functions as both a `prototyper` and `craftingstation`, allowing players to unlock and craft event-specific items. The workstation communicates with the `wagpunk_arena_manager` world component to track activation state. When activated, it plays looping animations and proximity sounds; when deactivated, it returns to idle state.

## Usage example
```lua
-- Spawn the workstation in the world
local workstation = SpawnPrefab("wagpunk_workstation")

-- Access components after spawning
-- Note: Setting .on directly bypasses onturnon callback (animations/sounds won't play)
-- Activation is handled by player interaction with the workstation
if workstation.components.prototyper then
    -- workstation.components.prototyper.on is managed by player interaction
end

-- Check tags for identification
if workstation:HasTag("wagpunk_workstation") then
    -- Workstation is valid
end
```

## Dependencies & tags
**External dependencies:**
- `TUNING.PROTOTYPER_TREES.WAGPUNK_WORKSTATION` -- prototype tree configuration for available recipes

**Components used:**
- `inspectable` -- allows players to examine the workstation
- `craftingstation` -- stores and provides access to learned blueprints
- `prototyper` -- enables recipe prototyping; callbacks wired to local handlers
- `wagpunk_arena_manager` (world component) -- notified on toggle state changes

**Tags:**
- `prototyper` -- added on creation; marks entity as a prototype source
- `wagpunk_workstation` -- added on creation; identifies this specific station type

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | | | No public properties are defined. This is a prefab factory, not a class. |

## Internal Callbacks
### `OnTurnOn(inst)`
* **Description:** Called when the prototyper component is activated. Plays looping proximity animation and sound, then notifies the arena manager.
* **Parameters:** `inst` -- the workstation entity instance
* **Returns:** None
* **Error states:** None

### `OnTurnOff(inst)`
* **Description:** Called when the prototyper component is deactivated. Stops idle sound, plays idle animation, and notifies the arena manager.
* **Parameters:** `inst` -- the workstation entity instance
* **Returns:** None
* **Error states:** None

### `FinishUseAnim(inst)`
* **Description:** Completes the activation animation sequence. Resets the activated task and restores either looping or idle state based on prototyper status.
* **Parameters:** `inst` -- the workstation entity instance
* **Returns:** None
* **Error states:** None

### `OnActivate(inst)`
* **Description:** Called when a player activates the prototyper. Plays use animation and sound, cancels any pending activation task, and schedules `FinishUseAnim`.
* **Parameters:** `inst` -- the workstation entity instance
* **Returns:** None
* **Error states:** None

### `OnLoad(inst, data)`
* **Description:** Called when the entity loads from save. Re-learns baseline recipes for moonstorm goggles and moon device construction.
* **Parameters:**
  - `inst` -- the workstation entity instance
  - `data` -- saved data table (unused in current implementation)
* **Returns:** None
* **Error states:** Errors if `inst.components.craftingstation` is nil when `OnLoad` is called.

### `fn()`
* **Description:** Prefab factory function. Creates the entity, adds base components and tags, configures prototyper callbacks, and returns the instance.
* **Parameters:** None
* **Returns:** Entity instance
* **Error states:** None

## Events & listeners
- **Listens to:** None directly. Prototyper component callbacks (`onturnon`, `onturnoff`, `onactivate`) are wired to local functions.
- **Pushes:** None directly. The `wagpunk_arena_manager:WorkstationToggled()` is called but not via `PushEvent`.