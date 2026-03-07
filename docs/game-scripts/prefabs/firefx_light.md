---
id: firefx_light
title: Firefx Light
description: Creates a lightweight, non-persistent visual light effect for use as a transient fire-related FX entity.
tags: [fx, light, visual]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ef9ccf80
system_scope: fx
---

# Firefx Light

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`firefx_light` is a lightweight prefab intended for short-lived visual effects, specifically as a light source for fire-related FX. It is designed to be non-persistent (does not save to disk) and is only fully initialized on the master simulation (server), while clients receive a minimal version for rendering purposes. It adds only the essential entity components: `transform`, `light`, and `network`.

## Usage example
```lua
-- Typical usage within a higher-level FX system (e.g., when a fire spawns)
local fireLight = SpawnPrefab("firefx_light")
if fireLight then
    fireLight.Transform:SetPosition(x, y, z)
    -- Light properties are configured via the light component directly in prefabs or via Lua
end
```

## Dependencies & tags
**Components used:** `transform`, `light`, `network` (added via `inst.entity:AddX()`)
**Tags:** Adds `FX`

## Properties
No public properties.

## Main functions
Not applicable — this is a prefab definition, not a component.

## Events & listeners
Not applicable — this prefab does not define event listeners or push events.
