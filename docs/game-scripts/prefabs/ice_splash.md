---
id: ice_splash
title: Ice Splash
description: A one-time visual effect prefab that plays an ice-themed animation and then removes itself.
tags: [fx, animation, visual]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 880b6b39
system_scope: fx
---

# Ice Splash

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`ice_splash` is a non-persistent visual effect prefab designed to display a short, self-contained ice-themed animation. It is instantiated as a dedicated `FX` entity, configured with animation state and bank settings, and automatically destroyed once the animation completes. This prefab does not interact with gameplay logic or other components directly; it exists solely for visual feedback.

## Usage example
```lua
local inst = SpawnPrefab("ice_splash")
if inst ~= nil then
    inst.Transform:SetPosition(x, y, z)
    -- The entity will self-remove upon animation completion
end
```

## Dependencies & tags
**Components used:** `animstate`, `transform`
**Tags:** Adds `FX` to the entity; no other tags are used.

## Properties
No public properties.

## Main functions
No public functions are defined — this prefab is purely declarative.

## Events & listeners
- **Listens to:** `animover` — triggers `inst.Remove()` to destroy the entity once the animation finishes playing.

## Overview
`ice_splash` is instantiated via `Prefab("ice_splash", fn, assets)` and returned as a reusable template. It uses a single `assets` list containing the `"anim/ice_splash.zip"` animation archive. Inside the factory function `fn`, the entity is created, tagged, configured for animation playback, and registered for event cleanup.