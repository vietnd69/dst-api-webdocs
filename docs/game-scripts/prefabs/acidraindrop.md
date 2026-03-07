---
id: acidraindrop
title: Acidraindrop
description: Creates and manages non-networked smoke particle effects for acid rain impacts in the game world.
tags: [fx, particle, visual]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 274bcb16
system_scope: fx
---

# Acidraindrop

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`acidraindrop` is a prefab generator script that defines two distinct entity prefabs for visual acid rain effects: `acidraindrop` for single-playback smoke puffs and `acidsmoke_endless` for looping smoke effects. It handles animation, sound, and self-cleanup of FX entities without requiring network synchronization.

## Usage example
```lua
-- Spawn a transient smoke puff at position (x, y, z)
local inst = SpawnPrefab("acidraindrop")
if inst then
    inst.Transform:SetPosition(x, y, z)
    inst.RestartFx() -- Re-trigger animation (optional)
end

-- Spawn a looping smoke effect (e.g., near an acid pool)
local endless = SpawnPrefab("acidsmoke_endless")
if endless then
    endless.Transform:SetPosition(x, y, z)
    endless.DoCustomHide() -- Pause looping
    endless.DoCustomShow() -- Resume looping
end
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `FX`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_queue_hide` | boolean or `nil` | `nil` | Internal flag used by the endless variant to queue hiding after animation completes. |
| `pool` | table or `nil` | `nil` | Optional reference to a pooled entity list; used during cleanup. |

## Main functions
### `RestartFx(inst)`
*   **Description:** Randomizes scale (between `0.5` and `0.9`), selects and plays a random smoke animation (`smoke_1`, `smoke_2`, or `smoke_3`), and schedules a sizzle sound effect on the first frame.
*   **Parameters:** `inst` (entity) — the entity instance to affect.
*   **Returns:** Nothing.

### `EndlessHide(inst)`
*   **Description:** Marks the endless smoke entity to be hidden after its current animation completes, instead of restarting.
*   **Parameters:** `inst` (entity) — the endless smoke entity.
*   **Returns:** Nothing.

### `EndlessShow(inst)`
*   **Description:** Makes the endless smoke entity visible and resumes its looping animation cycle.
*   **Parameters:** `inst` (entity) — the endless smoke entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — triggers cleanup (`acidraindrop`) or restart/queue logic (`acidsmoke_endless`).
- **Pushes:** None identified.