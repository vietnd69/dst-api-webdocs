---
id: rock_break_fx
title: Rock Break Fx
description: Spawns a non-persistent, non-networked sound effect entity when a rock is broken.
tags: [fx, audio, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 91c07e83
system_scope: fx
---

# Rock Break Fx

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`rock_break_fx` is a lightweight prefab that plays a sound effect ( `"dontstarve/wilson/rock_break"` ) at the location of a broken rock. It is a client-side visual/audio cue only — it does not persist, contribute to world state, or synchronize over the network. The entity is created locally on non-dedicated clients, positioned via proxy transform, and automatically destroyed shortly after spawning.

## Usage example
This prefab is not directly instantiated by mods. It is used internally by the game (e.g., when rocks are destroyed) via `TheWorld:SpawnPrefab("rock_break_fx")`, typically passing a `proxy` entity to anchor its position.

```lua
-- Example internal usage (not for external mod use)
local fx = TheWorld:SpawnPrefab("rock_break_fx")
if fx ~= nil then
    -- Position is handled internally via proxy; no further setup needed
end
```

## Dependencies & tags
**Components used:** `transform`, `soundemitter`, `network`  
**Tags:** Adds `FX`

## Properties
No public properties

## Main functions
The component is implemented as a Prefab factory (`fn`) and does not expose a component class. Its logic resides in local functions executed at spawn time.

## Events & listeners
None identified.

