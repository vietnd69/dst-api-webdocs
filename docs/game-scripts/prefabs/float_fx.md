---
id: float_fx
title: Float Fx
description: Creates simple floating visual effect entities used for foreground or background rendering in the game world.
tags: [fx, visual, background]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 42574954
system_scope: fx
---

# Float Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`float_fx` defines two prefabs (`float_fx_front` and `float_fx_back`) that instantiate lightweight visual effect entities. These entities are used to render background or foreground floating graphics (e.g., atmospheric particles or decorative floating visuals) with no gameplay mechanics or physics. They are non-blocking (`NOBLOCK`), persistable-off (`persists = false`), and optimized for rendering only.

## Usage example
```lua
-- Spawn a foreground floating effect
local front_fx = SpawnPrefab("float_fx_front")
front_fx.Transform:SetPosition(x, y, z)

-- Spawn a background floating effect
local back_fx = SpawnPrefab("float_fx_back")
back_fx.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** None  
**Tags:** Adds `NOBLOCK`, `FX`, `ignorewalkableplatforms`

## Properties
No public properties

## Main functions
### `common_fn(is_front)`
*   **Description:** Internal constructor function that builds and configures the effect entity. Sets up transform, animation, sound, tags, and animation states based on whether the effect is foreground or background.
*   **Parameters:** `is_front` (boolean) — determines whether the effect is foreground (`true`) or background (`false`).
*   **Returns:** `inst` (Entity) — the configured entity instance.
*   **Error states:** Returns `nil` on the client if `TheWorld.ismastersim` is `false` (though it still returns the unsent instance locally before that check). The master returns the fully built instance.

## Events & listeners
None identified.