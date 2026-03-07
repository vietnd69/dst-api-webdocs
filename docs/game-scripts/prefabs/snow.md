---
id: snow
title: Snow
description: Generates a particle-based snow FX effect that adapts its appearance based on the active season event (e.g., Winter's Feast).
tags: [fx, environment, seasonal]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 145d0cf9
system_scope: fx
---

# Snow

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `snow` prefab creates a non-networked, non-persistent visual effect entity that simulates falling snow particles. It is responsible for spawning and animating snow particles using the `vfx_effect` component and the `emitter_manager`. The effect dynamically switches between standard snow and a modified "winter" variant (e.g., for Winter's Feast) by adjusting particle texture, scale envelope, acceleration, drag, and UV animation settings.

## Usage example
```lua
-- The snow effect is instantiated automatically by the world when snow weather is active.
-- Modders do not typically instantiate this prefab manually, but if needed:
local snow_fx = Prefab("snow")
if snow_fx ~= nil then
    local inst = Entity(0, "snow", nil, nil, snow_fx)
    -- Further configuration would require internal access; not recommended
end
```

## Dependencies & tags
**Components used:** `vfx_effect`, `transform`
**Tags:** Adds `FX`

## Properties
No public properties

## Main functions
This is a `Prefab` definition; it does not expose a reusable component class. Functions are defined within the `fn()` constructor and are not accessible externally after instantiation.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.
