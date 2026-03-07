---
id: thunder_close
title: Thunder Close
description: Spawns a non-networked sound emitter entity that plays a thunder sound at a randomized position and triggers a screen flash effect.
tags: [audio, fx, world]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 97108d33
system_scope: fx
---

# Thunder Close

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`thunder_close` is a client-side FX prefab that creates a localized thunder sound effect with positional audio and triggers a screen flash. It is instantiated locally on the client (excluding dedicated servers) and does not persist in the world. The prefab uses a single-frame delayed task to ensure safe cleanup and randomly generates a sound-emission angle and radius for spatial distribution.

## Usage example
```lua
-- This prefab is automatically spawned by the game engine (e.g., during thunderstorm events).
-- It is not intended for direct manual instantiation by modders.
-- However, if needed:
local inst = Prefab("thunder_close", fn)()
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** Adds `FX` via `inst:AddTag("FX")`.

## Properties
No public properties.

## Main functions
This prefab does not expose any public functions to modders. All behavior is encapsulated within internal helper functions.

## Events & listeners
- **Listens to:** `randdirty` — triggers `OnRandDirty`, which schedules a sound emitter entity spawn on the client.
- **Pushes:** `screenflash` with intensity `.5` via `TheWorld:PushEvent("screenflash", .5)` — triggers a visual flash effect.