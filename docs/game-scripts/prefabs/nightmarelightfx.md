---
id: nightmarelightfx
title: Nightmarelightfx
description: Creates networked visual FX prefabs for nightmare-themed environmental lights and fissures.
tags: [fx, network, environment]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: def94198
system_scope: fx
---

# Nightmarelightfx

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`nightmarelightfx.lua` defines a factory function (`Make`) that generates lightweight FX prefabs used to visually represent nightmare-related lighting effects — such as rock lights, fissure cracks, and war-related lighting — in the game world. These prefabs are non-interactive, non-persistent visual elements intended for decoration or environment context, not gameplay interaction. The component itself is implemented as a Prefab factory that configures transform, animation state, and network capabilities for server-client sync.

## Usage example
```lua
-- The prefabs are pre-created and returned by the module:
local nightmarelightfx_prefab = require "prefabs/nightmarelightfx"
-- Use TheWorld:SpawnPrefab to instantiate one in the world:
local fx = TheWorld:SpawnPrefab("nightmarelightfx")
if fx ~= nil then
    fx.Transform:SetPos(x, y, z)
end
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `FX` or `DECOR` (depending on `mouseparent` parameter), and always adds `NOCLICK`.

## Properties
No public properties.

## Main functions
This file does not expose any functional methods. It exports only prefab constructors created via the internal `Make` factory function.

### `Make(name, bank, mouseparent)`
*   **Description:** Internal factory function that defines and returns a Prefab for an FX visual element. It sets up the entity's transform, anim state, network state, and tags; if in client context, assigns an optional replication callback (`OnEntityReplicated`) to handle mouseover highlighting parent-child relationships.
*   **Parameters:**
    *   `name` (string) - The unique name for the resulting prefab (e.g., `"nightmarelightfx"`).
    *   `bank` (string) - The animation bank name used to locate the `.zip` animation file.
    *   `mouseparent` (string or nil) - If non-nil, the resulting FX will add the `DECOR` tag and register an `OnEntityReplicated` callback to highlight the parent entity (via `highlightchildren`) when this FX is networked to clients. If nil, it adds the `FX` tag and skips the callback.
*   **Returns:** A `Prefab` object (table) that can be used by `TheWorld:SpawnPrefab(name)`.
*   **Error states:** None identified. If `mouseparent` is `nil`, the replication callback is skipped.

## Events & listeners
- **Listens to:** None identified.  
- **Pushes:** None identified.  
The component does not directly handle or dispatch any events.
