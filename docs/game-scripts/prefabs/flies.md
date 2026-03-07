---
id: flies
title: Flies
description: A decorative prefab that emits ambient fly sounds and animations based on player proximity, typically used for atmospheric effects in environments like caves and swamps.
tags: [atmosphere, decor, sound, visual]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 07a9b3ea
system_scope: environment
---

# Flies

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `flies` prefab is a lightweight decorative entity that simulates a swarm of flies. It uses the `playerprox` component to detect when a player is near or far and responds by switching between animation states and playing or stopping sound effects accordingly. It is commonly used in world generation to enhance environmental immersion (e.g., near swamps, caves, or decayed structures). The prefab is non-interactive (`NOCLICK`, `DECOR` tags) and runs pristinely on clients, with logic executed only on the master simulation.

## Usage example
```lua
-- Example: Spawn a flies entity at a specific world position
local inst = SpawnPrefab("flies")
if inst then
    inst.Transform:SetPosition(x, y, z)
end
```

## Dependencies & tags
**Components used:** `playerprox`, `transform`, `animstate`, `soundemitter`, `network`
**Tags:** Adds `NOCLICK` and `DECOR` unconditionally.

## Properties
No public properties.

## Main functions
### `onnear(inst)`
*   **Description:** Called when a player moves within the near distance (`2` units). Stops the ambient fly looping sound and switches to a "post-swarm" animation (`swarm_pst`).
*   **Parameters:** `inst` (Entity) — the flies entity instance.
*   **Returns:** Nothing.

### `onfar(inst)`
*   **Description:** Called when a player moves beyond the far distance (`3` units). Plays the ambient fly sound (`dontstarve/common/flies`) and initiates the swarm animation sequence: first `swarm_pre`, then looping `swarm_loop`.
*   **Parameters:** `inst` (Entity) — the flies entity instance.
*   **Returns:** Nothing.

### `OnWake(inst)`
*   **Description:** Event handler invoked when the entity wakes from sleep. Restarts the ambient sound if no player is close at the time of waking.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnSleep(inst)`
*   **Description:** Event handler invoked when the entity goes to sleep. Immediately kills the "flies" sound.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `oninit(inst)`
*   **Description:** Initialization callback. Forces an immediate update of the `playerprox` component to ensure correct initial state, then triggers either `OnWake` or nothing depending on sleep state. Attaches `OnEntityWake` and `OnEntitySleep` handlers.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `OnEntityWake`, `OnEntitySleep` — entity-level callbacks triggered by world sleep/wake state changes.
- **Pushes:** None identified.