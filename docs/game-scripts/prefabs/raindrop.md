---
id: raindrop
title: Raindrop
description: A one-shot visual effect prefab that plays a short animation and then recycles or destroys itself.
tags: [fx, visual, environment]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2abcd7c3
system_scope: fx
---

# Raindrop

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`raindrop` is a lightweight, non-persistent FX (visual effect) prefab that plays a single animation (`"anim"`) and automatically cleans up after completion. It is designed for transient visual feedback, such as decorative rain particles or temporary splash effects. The entity does not persist across loads, cannot sleep, and is non-networked. It supports optional pooling via `inst.pool` for performance optimization.

## Usage example
```lua
local inst = SpawnPrefab("raindrop")
if inst ~= nil then
    inst.Transform:SetPosition(x, y, z)
    -- Use RestartFx to replay the animation if needed
    -- inst.RestartFx(inst)
end
```

## Dependencies & tags
**Components used:** `animstate`, `transform`
**Tags:** Adds `FX`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `pool` | table or `nil` | `nil` | Optional reference to an entity pool. If valid, the entity is returned to `pool.ents` on animation completion instead of being removed. |

## Main functions
### `RestartFx(inst)`
*   **Description:** Restarts the animation playback from the beginning. Typically called manually after spawning if the effect needs to be re-triggered.
*   **Parameters:** `inst` (entity) — the raindrop instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — triggers `OnAnimOver` to handle cleanup (recycling or removal) when the animation finishes playing.

## Events & listeners
- **Listens to:** `animover` — triggers `OnAnimOver` to handle cleanup (recycling or removal) when the animation finishes playing.
- **Pushes:** None.