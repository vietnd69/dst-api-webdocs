---
id: reviver
title: Reviver
description: An inventory item that emits a rhythmic heartbeat sound and visual FX while held in inventory, and resumes pulsing when dropped.
tags: [inventory, audio, fx]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 66a476e6
system_scope: inventory
---

# Reviver

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `reviver` prefab is an inventory item (typically used as a reskin target) that visualizes and audibly manifests a heartbeat when placed on the ground. While held, the heartbeat is silenced. When dropped, it resumes beating at irregular intervals (~0.75–1.5 seconds). It integrates with the `inventoryitem`, `inspectable`, and `tradable` components, and supports reskinning via the `skin_switched` callback.

## Usage example
```lua
local inst = SpawnPrefab("reviver")
-- The reviver starts beating automatically upon spawn
inst.Transform:SetPosition(x, y, z)

-- While held, the beat pauses; dropping it resumes the beat
-- Reskinning triggers a beat resumption via `skin_switched`
```

## Dependencies & tags
**Components used:** `inventoryitem`, `inspectable`, `tradable`, `transform`, `animstate`, `soundemitter`, `network`  
**Tags:** Adds `reviver`

## Properties
No public properties.

## Main functions
### `PlayBeatAnimation(inst)`
*   **Description:** Plays the idle animation for the reviver, typically used to reset animation state (e.g., after a reskin).
*   **Parameters:** `inst` (Entity) - the reviver instance.
*   **Returns:** Nothing.

### `startbeat(inst)`
*   **Description:** Initializes and starts the reviver’s heartbeat FX loop. Removes any existing beat FX, spawns a new one, attaches it as a follower, and schedules the first beat task.
*   **Parameters:** `inst` (Entity) - the reviver instance.
*   **Returns:** Nothing.

### `beat(inst)`
*   **Description:** Fires the next beat event: plays the heartbeat sound, triggers animation, and schedules the next beat with randomized delay.
*   **Parameters:** `inst` (Entity) - the reviver instance.
*   **Returns:** Nothing.

### `ondropped(inst)`
*   **Description:** Event handler for when the item is dropped. Cancels any pending beat task and immediately restarts the heartbeat loop.
*   **Parameters:** `inst` (Entity) - the reviver instance.
*   **Returns:** Nothing.

### `onpickup(inst)`
*   **Description:** Event handler for when the item is picked up. Cancels the beat task and removes the beat FX.
*   **Parameters:** `inst` (Entity) - the reviver instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `skin_switched` - internally aliased to `ondropped`, so reskinning re-triggers the heartbeat loop.  
- **Pushes:** None. (The prefab does not fire custom events.)