---
id: halloweenpotion_common
title: Halloweenpotion Common
description: Provides utility functions for spawning and attaching Halloween-themed particle effects (firepuffs) to targets.
tags: [fx, particles, utility]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: eb14c9a2
system_scope: fx
---

# Halloweenpotion Common

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`halloweenpotion_common.lua` is a utility module that defines reusable assets, prefabs, and helper functions for spawning Halloween-themed visual effects (specifically, firepuff particles). It is not a component but a shared configuration and helper file used by other prefabs—most notably, potion-related prefabs that need to spawn either hot or cold ember effects based on the target's tags. The module exposes functions to attach effects to targets and spawn randomized puff prefabs.

## Usage example
```lua
local halloween_common = require "prefabs/halloweenpotion_common"
local puff = halloween_common.SpawnPuffFx(inst, target)
-- puff will be a spawned firepuff prefab attached to `target`
```

## Dependencies & tags
**Components used:** `burnable` — accessed only for its `fxdata[1].follow`, `x`, `y`, and `z` fields when attaching effects.
**Tags:** Checks `blueflame` on the target to determine whether to spawn cold (`halloween_firepuff_cold_*`) or hot (`halloween_firepuff_*`) effects.

## Properties
No public properties — this is a plain Lua table return with utility functions and static asset/prefab lists.

## Main functions
### `AttachToTarget(inst, target, build, cold_build)`
*   **Description:** Attaches the effect entity (`inst`) to a target entity using parent-child relationships and a follower symbol (if available). Positions the effect at `(0,0,0)` relative to the target.
*   **Parameters:**
    *   `inst` (Entity) — The effect entity to attach (e.g., a spawned firepuff).
    *   `target` (Entity) — The entity to attach the effect to.
    *   `build` — *Unused* — no implementation uses this parameter.
    *   `cold_build` — *Unused* — no implementation uses this parameter.
*   **Returns:** Nothing.
*   **Error states:** Safely handles missing `burnable` component or missing `fxdata[1]` / `follow` by checking `nil` references before use. If the conditions are not met, the effect is still parented but without a follower.

### `SpawnPuffFx(inst, target)`
*   **Description:** Spawns a random firepuff prefab (hot or cold depending on the target's `blueflame` tag), attaches it to the target, and returns the spawned entity.
*   **Parameters:**
    *   `inst` (Entity) — The calling entity (not used in current implementation).
    *   `target` (Entity) — The entity to spawn and attach the effect to.
*   **Returns:** `Entity` — The spawned firepuff prefab instance.
*   **Error states:** None. Uses `math.random(#fx_list)` to safely index a 3-element array (guaranteed to be non-empty per static definition).

## Events & listeners
None — this file contains no event listeners or event pushes.

## Assets & prefabs
*   **ANIM assets:**
    *   `"anim/halloween_embers.zip"`
    *   `"anim/halloween_embers_cold.zip"`
*   **Prefabs returned:**
    *   `"halloween_firepuff_1"`, `"halloween_firepuff_2"`, `"halloween_firepuff_3"`
    *   `"halloween_firepuff_cold_1"`, `"halloween_firepuff_cold_2"`, `"halloween_firepuff_cold_3"`

Note: The module returns a table containing `prefabs`, `assets`, `SpawnPuffFx`, and `AttachToTarget` for external consumption.