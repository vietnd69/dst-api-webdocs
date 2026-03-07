---
id: thunder_far
title: Thunder Far
description: Spawns a non-persistent local FX entity that plays a distant thunder sound.
tags: [fx, sound, world]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2ce72d25
system_scope: fx
---

# Thunder Far

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`thunder_far` is a Prefab definition that creates a lightweight, non-networked FX entity solely for playing a distant thunder sound (`dontstarve/rain/thunder_far`). It is not persisted, does not contribute to world simulation, and is automatically removed after 2 seconds. The entity is only instantiated on non-dedicated clients to avoid wasting resources on dedicated servers.

## Usage example
```lua
-- Internally invoked by the game when triggering distant thunder FX
-- Example of spawning (not typical mod usage; this prefab is auto-resolved by name)
local thunder_fx = SpawnPrefab("thunder_far")
-- The entity handles its own lifecycle; no further interaction required
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `FX`

## Properties
No public properties

## Main functions
### `PlayThunderSound()`
* **Description:** Internal helper function that creates a temporary non-networked entity, plays the thunder sound, and removes itself immediately.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does nothing if the sound fails to play (handled internally by the engine).

### `fn()`
* **Description:** The prefab constructor function. Sets up the entity, adds network capabilities and the `FX` tag, and conditionally spawns the sound entity only on non-dedicated clients.
* **Parameters:** None.
* **Returns:** `inst` (entity) — the created entity, fully configured and ready for destruction.
* **Error states:** Returns immediately on the client with `inst` if not master sim; ensures the entity is pristene and non-persisting.

## Events & listeners
None identified