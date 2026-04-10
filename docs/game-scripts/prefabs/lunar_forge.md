---
id: lunar_forge
title: Lunar Forge
description: Defines the Lunar Forge structure prefab, including prototyper, workable, and hauntable behaviors.
tags: [structure, crafting, lunar]
sidebar_position: 10
last_updated: 2026-04-07
build_version: 718694
change_status: stable
category_type: prefabs
source_hash: 2d523a14
system_scope: crafting
---

# Lunar Forge

> Based on game build **718694** | Last updated: 2026-04-07

## Overview
`lunar_forge` defines the prefab for the Lunar Forge structure, a craftable station used for prototyping lunar-themed items. It integrates the `prototyper` component to unlock recipes, the `workable` component to allow hammering for loot, and the `hauntable` component for ghost interactions. The prefab manages specific animation states and sound effects based on activation and proximity events.

## Usage example
```lua
-- Spawn the Lunar Forge structure directly
local forge = SpawnPrefab("lunar_forge")
forge.Transform:SetPosition(0, 0, 0)

-- Alternatively, craft the deployable kit
local player = ThePlayer
player.components.inventory:GiveItem(SpawnPrefab("lunar_forge_kit"))
```

## Dependencies & tags
**External dependencies:**
- `prefabutil` -- Provides helper functions for creating prefabs and kit items.

**Components used:**
- `inspectable` -- Allows players to examine the structure.
- `prototyper` -- Enables recipe unlocking; configured with custom callbacks for activation states.
- `lootdropper` -- Handles item drops when the structure is hammered.
- `workable` -- Enables hammering action; configured with finish and work callbacks.
- `hauntable` -- Allows ghosts to haunt the structure for a small effect.

**Tags:**
- `structure` -- Added; identifies entity as a building.
- `lunar_forge` -- Added; specific identifier for this structure type.
- `prototyper` -- Added; marks entity as a prototyping station.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_activecount` | number | `0` | Tracks the number of active uses or interactions. |
| `_activetask` | task | `nil` | Reference to the scheduled task for resetting activation state. |

## Internal Callbacks
### `onhammered(inst, worker)`
* **Description:** Callback triggered when hammering work is completed. Drops loot, spawns collapse effects, and removes the entity.
* **Parameters:**
  - `inst` -- The lunar forge entity instance.
  - `worker` -- The entity performing the hammering.
* **Returns:** None
* **Error states:** Errors if inst has no lootdropper component (nil dereference on inst.components.lootdropper — no guard present in source)

### `onhit(inst, worker)`
* **Description:** Callback triggered when work is performed (hammer hit). Plays animations based on whether the prototyper is currently active.
* **Parameters:**
  - `inst` -- The lunar forge entity instance.
  - `worker` -- The entity performing the work.
* **Returns:** None
* **Error states:** Errors if `inst.components.prototyper` is nil (no guard present).

### `onactivate(inst)`
* **Description:** Callback triggered when the prototyper is activated. Plays use animation, sound, increments active count, and schedules reset tasks.
* **Parameters:** `inst` -- The lunar forge entity instance.
* **Returns:** None
* **Error states:** Errors if `inst.AnimState` or `inst.SoundEmitter` is nil.

### `doonact(inst)`
* **Description:** Internal helper callback that decrements the active count after a delay. Called by `onactivate` after 1.5 seconds.
* **Parameters:** `inst` -- The lunar forge entity instance.
* **Returns:** None
* **Error states:** None

### `doneact(inst)`
* **Description:** Internal helper callback that resets activation state and triggers turn on/off handlers. Called by `onactivate` after animation completes.
* **Parameters:** `inst` -- The lunar forge entity instance.
* **Returns:** None
* **Error states:** Errors if inst has no prototyper component (nil dereference on inst.components.prototyper — no guard present in source)

### `onturnon(inst)`
* **Description:** Callback triggered when the prototyper turns on. Plays proximity loop animations and sound if not already playing.
* **Parameters:** `inst` -- The lunar forge entity instance.
* **Returns:** None
* **Error states:** Errors if `inst.AnimState` or `inst.SoundEmitter` is nil.

### `onturnoff(inst)`
* **Description:** Callback triggered when the prototyper turns off. Plays post-proximity animations and stops loop sounds.
* **Parameters:** `inst` -- The lunar forge entity instance.
* **Returns:** None
* **Error states:** Errors if `inst.AnimState` or `inst.SoundEmitter` is nil.

### `onbuilt(inst, data)`
* **Description:** Callback triggered when the entity is built by a player. Plays placement animation and sound.
* **Parameters:**
  - `inst` -- The lunar forge entity instance.
  - `data` -- Event data table (unused).
* **Returns:** None
* **Error states:** Errors if `inst.AnimState` or `inst.SoundEmitter` is nil.

## Events & listeners
- **Listens to:** `onbuilt` - Triggers `onbuilt` callback when the structure is placed.
- **Pushes:** None identified.