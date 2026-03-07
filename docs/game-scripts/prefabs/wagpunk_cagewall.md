---
id: wagpunk_cagewall
title: Wagpunk Cagewall
description: A networked, animated wall entity that can be extended or retracted in response to game events, commonly used in the Wagpunk-themed environmental mechanics.
tags: [environment, animation, sound, network]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b14e043f
system_scope: environment
---

# Wagpunk Cagewall

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wagpunk_cagewall` is a prefab that defines a reusable, animated wall entity used in DST’s world environment—particularly in Wagpunk-themed zones (e.g., the Crystalline Hovel or related events). It supports dynamic extension and retraction via animations and sound effects, with server-side behavior and networked state synchronization. The entity transitions between states: `idle_off` → `activate` → `idle_on` (extend) and `idle_on` → `deactivated` → `idle_off` (retract), optionally with randomized time delays via jitter functions. It is not interactable when extended (`NOCLICK` tag removed), and interacts with the `inspectable` component for client-server validation.

## Usage example
```lua
-- Create and configure a cagewall instance (typically done by the game itself via Prefab system)
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst.entity:AddSoundEmitter()
inst.entity:AddNetwork()

-- Attach component logic via the prefab function
-- (In practice, use Prefab("wagpunk_cagewall", fn, assets) as defined in source)
inst.extended = false

-- Later in gameplay
inst:ExtendWall()      -- Extend the wall
inst:RetractWall()     -- Retract the wall
inst:ExtendWallWithJitter(5)  -- Extend after random delay up to 5 seconds
inst:RetractWallWithJitter(3) -- Retract after random delay up to 3 seconds
```

## Dependencies & tags
**Components used:** None directly invoked via `inst.components.X`; the entity uses standard built-in entity components (`animstate`, `soundemitter`, `transform`, `network`) and the `inspectable` component on the master sim.
**Tags:** Adds `NOCLICK` initially; removes `NOCLICK` when extended.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `extended` | boolean | `false` | Whether the wall is currently extended (true) or retracted (false). |
| `sfxlooper` | boolean \| nil | `nil` | If present, enables looping sound playback during extended state. |
| `loopingsfxtask` | Task \| nil | `nil` | Reference to the scheduled task for looping sound; managed internally. |

## Main functions
### `ExtendWall()`
* **Description:** Extends the wall: removes the `NOCLICK` tag, plays the `"activate"` animation followed by `"idle_on"`, and optionally starts looping sound if `sfxlooper` is set.
* **Parameters:** None.
* **Returns:** Nothing.

### `RetractWall()`
* **Description:** Retracts the wall: adds the `NOCLICK` tag, stops looping sound (if active), and plays the `"deactivated"` animation followed by `"idle_off"`.
* **Parameters:** None.
* **Returns:** Nothing.

### `ExtendWallWithJitter(jitter)`
* **Description:** Schedules `ExtendWall()` after a random delay up to `jitter` seconds.
* **Parameters:** `jitter` (number) - maximum random delay in seconds.
* **Returns:** Nothing.

### `RetractWallWithJitter(jitter)`
* **Description:** Schedules `RetractWall()` after a random delay up to `jitter` seconds.
* **Parameters:** `jitter` (number) - maximum random delay in seconds.
* **Returns:** Nothing.

### `PlayLoopingSFX()`
* **Description:** Begins playing the looping sound `"rifts5/wagpunk_fence/fence_LP"` with label `"fence_LP"`.
* **Parameters:** None.
* **Returns:** Nothing.

### `StopLoopingSFX()`
* **Description:** Cancels any pending looping sound task and immediately stops the `"fence_LP"` sound.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave(data)`
* **Description:** Saves the `sfxlooper` flag into the save data table for serialization.
* **Parameters:** `data` (table) - the save data table to populate.
* **Returns:** Nothing.

### `OnLoad(data)`
* **Description:** Restores the `sfxlooper` flag from loaded save data.
* **Parameters:** `data` (table \| nil) - the deserialized save data table.
* **Returns:** Nothing.

## Events & listeners
None identified.