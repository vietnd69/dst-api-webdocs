---
id: cane_sharp_fx
title: Cane Sharp Fx
description: Creates a visual effect particle system used for the cane sharp weapon's glowing trail.
tags: [fx, visual, combat, weapon]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7f06bc04
system_scope: fx
---

# Cane Sharp Fx

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`cane_sharp_fx` is a prefab that defines a visual effects (VFX) entity used to render a glowing particle trail behind the Cane Sharp weapon during use. It creates a rotating smoke-style particle system with animated colour and scale envelopes for visual feedback during gameplay. The entity is short-lived, non-dedicated-server-aware, and tagged with `FX`.

## Usage example
This prefab is typically instantiated by the game engine during gameplay when the Cane Sharp weapon is wielded or used. Modders do not usually spawn it directly, but it can be observed via debug tools or as part of larger effect chains.

```lua
-- Example: manually spawn the effect at a specific location (not typical usage)
local fx = SpawnPrefab("cane_sharp_fx")
if fx ~= nil then
    fx.Transform:SetPosition(x, y, z)
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `FX` via `inst:AddTag("FX")`

## Properties
No public properties

## Main functions
This prefab is instantiated as a `Prefab` definition using the `fn()` constructor function. It does not expose public methods beyond standard entity management.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified