---
id: acidsmoke_fx
title: Acidsmoke Fx
description: A visual effect entity that plays looping idle animations for acid smoke, cycling between animation levels with randomized delays.
tags: [fx, visual]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fcf13908
system_scope: fx
---

# Acidsmoke Fx

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`acidsmoke_fx` is a client-side visual effect (FX) prefab that displays looping idle smoke animations. It is automatically spawned to render acid-related smoke visuals in the world and uses the `animover` event to schedule cyclic animation transitions with randomized delays. The entity is not persisted to disk and runs only on the master simulation (server), but its visual state is synchronized to clients.

## Usage example
```lua
-- Example: Spawning the smoke effect at a position with a specific animation level
local inst = SpawnPrefab("acidsmoke_fx")
inst.Transform:SetPosition(x, y, z)
if TheWorld.ismastersim and inst.components.acidsmoke_fx then
    inst.components.acidsmoke_fx.SetLevel(inst, 2)
end
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** Adds `FX` tag.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_anim` | string | `"idle_1"` | The currently selected animation string (e.g., `"idle_1"`). Internal use only. |

## Main functions
### `SetLevel(inst, level)`
*   **Description:** Sets the animation bank to use based on the provided `level`. Prepares `inst._anim` to `"idle_"..level`.
*   **Parameters:** `inst` (entity), `level` (number) — identifies which idle animation sequence to use.
*   **Returns:** Nothing.

### `PlayAnim(inst)`
*   **Description:** Plays the animation currently stored in `inst._anim`.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `OnAnimOver(inst)`
*   **Description:** Schedules the next `PlayAnim` call after a random delay between 5 and 8 seconds.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — triggers `OnAnimOver` to restart the loop with a new random delay after the current animation completes.

