---
id: impact
title: Impact
description: Spawns a short-lived, non-persisted visual effect entity to display impact animations at a specified world position.
tags: [fx, visual]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 26f96757
system_scope: fx
---

# Impact

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`impact` is a lightweight prefab that creates a non-networked visual effect (FX) entity for displaying impact animations. It is intended to be used locally on non-dedicated clients and automatically removed after a short delay. It does not persist across sessions and is not simulated on dedicated servers beyond entity initialization. The prefab uses an `ANIM` asset (`anim/impact.zip`) and plays a fixed "idle" animation with an offset of `3` frames.

## Usage example
```lua
-- Typical usage in another prefab or component:
local impact = SpawnPrefab("impact")
if impact ~= nil then
    impact.Transform:SetPosition(x, y, z)
end
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `network`  
**Tags:** Adds `FX`; does not add or check any gameplay-related tags.

## Properties
No public properties.

## Main functions
The `impact` prefab is a standard DST `Prefab` definition and does not define custom component logic or methods beyond its constructor (`fn`) and internal helper (`PlayImpactAnim`). There are no callable methods exposed via `inst.components` or `inst:` beyond standard entity operations.

## Events & listeners
- **Listens to:** `animover` (on the FX sub-entity created in `PlayImpactAnim`) — triggers automatic removal of the FX entity when the animation completes.
